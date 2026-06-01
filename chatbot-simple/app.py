import json
import os

from dotenv import load_dotenv
from flask import Flask, Response, jsonify, redirect, render_template, request, session, stream_with_context, url_for


load_dotenv()

from services.ai.errors import AIProviderError, UpstreamAPIError
from services.ai.provider_router import ProviderRouter


MAX_ATTACHMENTS = 4
MAX_ATTACHMENT_CHARS = 120_000
MAX_TOTAL_ATTACHMENT_CHARS = 240_000
MAX_IMAGE_BYTES = 5 * 1024 * 1024
IMAGE_MIME_TYPES = {"image/png", "image/jpeg", "image/jpg", "image/webp"}

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY") or os.urandom(24)
ai_router = ProviderRouter()


@app.get("/")
def landing():
    return render_template("landing.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email", "").strip()
        session["chatbot_user"] = email or "guest"
        return redirect(url_for("chat_page"))

    return render_template("login.html")


@app.get("/chat")
def chat_page():
    return render_template("index.html")


def normalize_attachment(attachment):
    if not isinstance(attachment, dict):
        raise ValueError("Each attachment must be an object.")

    kind = attachment.get("kind", "text")

    name = str(attachment.get("name") or "attachment.txt").strip()[:120] or "attachment.txt"
    mime_type = str(attachment.get("mimeType") or attachment.get("mime_type") or "text/plain").strip()
    try:
        size = int(attachment.get("size") or 0)
    except (TypeError, ValueError):
        size = 0

    if kind == "image":
        data_url = str(attachment.get("dataUrl") or attachment.get("data_url") or "")

        if mime_type not in IMAGE_MIME_TYPES:
            raise ValueError("Only PNG, JPG, JPEG, and WebP images are supported.")

        if size > MAX_IMAGE_BYTES:
            raise ValueError("Image files must be 5 MB or smaller.")

        if not data_url.startswith("data:image/") or ";base64," not in data_url:
            raise ValueError("Invalid image attachment.")

        return {
            "kind": "image",
            "name": name,
            "mime_type": mime_type,
            "size": size,
            "data_url": data_url,
        }

    if kind != "text":
        raise ValueError("Only text and image attachments are supported.")

    content = str(attachment.get("content") or "")
    if not content.strip():
        return None

    return {
        "kind": "text",
        "name": name,
        "mime_type": mime_type,
        "size": size,
        "content": content,
    }


def normalize_attachments(raw_attachments):
    if raw_attachments in (None, ""):
        return []

    if not isinstance(raw_attachments, list):
        raise ValueError("Attachments must be a list.")

    if len(raw_attachments) > MAX_ATTACHMENTS:
        raise ValueError(f"You can attach up to {MAX_ATTACHMENTS} files.")

    attachments = []
    total_chars = 0

    for raw_attachment in raw_attachments:
        attachment = normalize_attachment(raw_attachment)

        if attachment is None:
            continue

        if attachment["kind"] == "text":
            remaining_chars = MAX_TOTAL_ATTACHMENT_CHARS - total_chars

            if remaining_chars <= 0:
                break

            content = attachment["content"][: min(MAX_ATTACHMENT_CHARS, remaining_chars)]
            total_chars += len(content)
            attachment["content"] = content

        attachments.append(attachment)

    return attachments


def parse_chat_payload():
    data = request.get_json(silent=True) or {}
    user_message = str(data.get("message", "")).strip()
    provider = str(data.get("provider") or "").strip() or None
    attachments = normalize_attachments(data.get("attachments", []))

    if not user_message and not attachments:
        raise ValueError("Message is required.")

    if not user_message:
        user_message = "Please analyze the attached file."

    return {
        "message": user_message,
        "provider": provider,
        "attachments": attachments,
        "model": data.get("model"),
    }


def json_stream_event(payload):
    return f"{json.dumps(payload, ensure_ascii=False)}\n"


def provider_error_response(error):
    return jsonify(error.to_dict()), error.status_code


@app.get("/models")
def models():
    try:
        return jsonify(ai_router.list_provider_options(request.args.get("provider")))
    except AIProviderError as error:
        return provider_error_response(error)


@app.get("/providers")
def providers():
    try:
        return jsonify(ai_router.list_provider_options(request.args.get("provider")))
    except AIProviderError as error:
        return provider_error_response(error)


@app.post("/chat")
def chat():
    try:
        payload = parse_chat_payload()
        response = ai_router.generate(
            payload["provider"],
            payload["message"],
            payload["model"],
            payload["attachments"],
        )
        return jsonify(response.to_dict())
    except ValueError as error:
        return jsonify({"error": str(error), "code": "invalid_request"}), 400
    except AIProviderError as error:
        return provider_error_response(error)
    except Exception as error:
        app.logger.exception("AI provider request failed")
        wrapped = UpstreamAPIError("AI provider request failed.", details=str(error))
        return provider_error_response(wrapped)


@app.post("/chat/stream")
def chat_stream():
    try:
        payload = parse_chat_payload()
        stream = ai_router.prepare_stream(
            payload["provider"],
            payload["message"],
            payload["model"],
            payload["attachments"],
        )
    except ValueError as error:
        return jsonify({"error": str(error), "code": "invalid_request"}), 400
    except AIProviderError as error:
        return provider_error_response(error)

    def generate():
        try:
            yield json_stream_event({
                "type": "meta",
                "provider": stream.provider,
                "model": stream.model,
            })

            for text in stream.chunks:
                if text:
                    yield json_stream_event({"type": "token", "text": text})

            yield json_stream_event({
                "type": "done",
                "provider": stream.provider,
                "model": stream.model,
            })
        except AIProviderError as error:
            yield json_stream_event({
                "type": "error",
                **error.to_dict(),
            })
        except Exception as error:
            app.logger.exception("AI provider streaming request failed")
            wrapped = UpstreamAPIError("AI provider request failed.", details=str(error))
            yield json_stream_event({
                "type": "error",
                **wrapped.to_dict(),
            })

    return Response(stream_with_context(generate()), mimetype="application/x-ndjson")


if __name__ == "__main__":
    debug_mode = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    port = int(os.getenv("PORT", "5000"))
    app.run(host="127.0.0.1", port=port, debug=debug_mode)
