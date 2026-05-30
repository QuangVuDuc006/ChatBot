import {
  Bot,
  Check,
  Edit3,
  Ellipsis,
  MessageCircle,
  MoreVertical,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Send,
  Settings,
  Sparkles,
  Trash2,
  UserRound,
} from "lucide-react";

const conversations = [
  { id: 1, title: "Create Html Game Environment...", active: false },
  { id: 2, title: "Apply To Leave For Emergency", active: false },
  { id: 3, title: "What Is UI UX Design?", active: false },
  { id: 4, title: "Create POS System", active: false },
  { id: 5, title: "What Is UX Audit?", active: false },
  { id: 6, title: "Create Chatbot GPT...", active: true },
  { id: 7, title: "How Chat GPT Work?", active: false },
  { id: 8, title: "Crypto Lending App Name", active: false, group: "Last 7 Days" },
  { id: 9, title: "Operator Grammar Types", active: false, group: "Last 7 Days" },
  { id: 10, title: "Min States For Binary DFA", active: false, group: "Last 7 Days", muted: true },
];

const aiSteps = [
  {
    title: "Install the required libraries:",
    text: "You will need to install the OpenAI client, a web framework, and a styling layer. Keep the setup small so the project stays easy to understand.",
  },
  {
    title: "Create the chat interface:",
    text: "Build a clean message layout with separate user and assistant bubbles, then connect the input form to your application state.",
  },
  {
    title: "Connect the API:",
    text: "Send the user message to your server, call the model from the backend, and return the assistant reply to the browser.",
  },
  {
    title: "Polish the experience:",
    text: "Add loading states, empty-message protection, responsive spacing, and helpful error messages for a production-ready flow.",
  },
];

function Sidebar() {
  let lastGroup = "Your conversations";

  return (
    <aside className="flex h-full w-[292px] shrink-0 flex-col rounded-[2rem] bg-white/88 p-5 shadow-panel ring-1 ring-white/70 backdrop-blur-xl max-lg:w-[258px] max-md:hidden">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-xl font-black tracking-[0.26em] text-slate-950">CHAT A.I+</h1>
      </div>

      <div className="mb-7 flex items-center gap-3">
        <button className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-indigo-300">
          <Plus size={18} />
          New Chat
        </button>
        <button className="grid h-12 w-12 place-items-center rounded-full bg-slate-950 text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-600">
          <Search size={18} />
        </button>
      </div>

      <div className="mb-3 flex items-center justify-between px-1">
        <p className="text-xs font-medium text-slate-500">Your conversations</p>
        <button className="text-xs font-semibold text-indigo-500 transition hover:text-indigo-700">Clear All</button>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto pr-1 sidebar-scroll">
        {conversations.map((conversation) => {
          const shouldShowGroup = conversation.group && conversation.group !== lastGroup;
          if (conversation.group) {
            lastGroup = conversation.group;
          }

          return (
            <div key={conversation.id}>
              {shouldShowGroup && (
                <p className="mb-3 mt-5 border-t border-slate-100 pt-4 text-xs font-medium text-slate-400">
                  {conversation.group}
                </p>
              )}
              <ChatItem conversation={conversation} />
            </div>
          );
        })}
      </nav>

      <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
        <button className="flex w-full items-center gap-3 rounded-full border border-slate-100 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-100 hover:bg-indigo-50">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-600">
            <Settings size={16} />
          </span>
          Settings
        </button>
        <div className="flex items-center gap-3 rounded-full border border-slate-100 bg-white px-4 py-3 shadow-sm">
          <img
            className="h-9 w-9 rounded-full object-cover"
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&q=80"
            alt="Andrew Neilson"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-800">Andrew Neilson</p>
            <p className="text-xs text-slate-400">Premium</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function ChatItem({ conversation }) {
  return (
    <button
      className={`group mb-1 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
        conversation.active
          ? "bg-indigo-50 text-indigo-600 shadow-sm"
          : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
      } ${conversation.muted ? "opacity-35" : ""}`}
    >
      <MessageCircle size={16} className="shrink-0" />
      <span className="min-w-0 flex-1 truncate text-sm font-medium">{conversation.title}</span>
      <span
        className={`flex shrink-0 items-center gap-1 transition ${
          conversation.active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <Trash2 size={15} className="hover:text-rose-500" />
        <Edit3 size={15} className="hover:text-indigo-600" />
        <MoreVertical size={15} className="hover:text-slate-950" />
      </span>
    </button>
  );
}

function MessageHeader({ user }) {
  if (user) {
    return (
      <div className="mb-3 flex items-center gap-3 text-sm text-slate-600">
        <img
          className="h-8 w-8 rounded-full object-cover shadow-sm ring-2 ring-white"
          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&q=80"
          alt="User avatar"
        />
        <span>Create a chatbot gpt using python language what will be step for that</span>
      </div>
    );
  }

  return (
    <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-normal text-indigo-500">
      <span>CHAT A.I</span>
      <span className="grid h-4 w-4 place-items-center rounded-full bg-indigo-500 text-white">
        <Check size={11} strokeWidth={3} />
      </span>
    </div>
  );
}

function AssistantMessage() {
  return (
    <article className="border-b border-slate-200/70 pb-8">
      <div className="flex gap-4">
        <div className="hidden h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-200 sm:grid">
          <Bot size={20} />
        </div>
        <div className="max-w-3xl flex-1">
          <MessageHeader />
          <div className="space-y-5 text-[15px] leading-7 text-slate-800">
            <p>
              Sure, I can help you get started with creating a chatbot using GPT in Python. Here are the basic
              steps you will need to follow:
            </p>
            <ol className="space-y-5">
              {aiSteps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="pt-0.5 font-bold text-slate-900">{index + 1}.</span>
                  <p>
                    <span className="font-bold text-slate-950">{step.title}</span> {step.text}
                  </p>
                </li>
              ))}
            </ol>
            <p className="font-medium text-slate-900">
              These are the core steps for a polished chatbot experience. You can add more features later, such
              as saved chats, streaming responses, or user accounts.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-400">
              <button className="rounded-full p-2 transition hover:bg-slate-100 hover:text-indigo-600">
                <Check size={16} />
              </button>
              <button className="rounded-full p-2 transition hover:bg-slate-100 hover:text-indigo-600">
                <Pencil size={16} />
              </button>
              <button className="rounded-full p-2 transition hover:bg-slate-100 hover:text-indigo-600">
                <Ellipsis size={16} />
              </button>
            </div>
            <button className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:text-indigo-600 hover:shadow-md">
              <RotateCcw size={14} />
              Regenerate
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function ChatArea() {
  return (
    <main className="relative flex min-w-0 flex-1 flex-col rounded-[2rem] bg-slate-50/80 shadow-panel ring-1 ring-white/70 backdrop-blur-xl">
      <div className="absolute right-8 top-8 z-10 hidden h-10 w-10 place-items-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-100 transition hover:text-indigo-600 lg:grid">
        <Edit3 size={18} />
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-36 pt-10 sm:px-12 lg:px-20 xl:px-24 chat-scroll">
        <section className="mx-auto max-w-4xl space-y-8">
          <article className="border-b border-slate-200/70 pb-7">
            <MessageHeader user />
            <AssistantMessage />
          </article>

          <article className="pb-10">
            <div className="mb-3 flex items-center gap-3 text-sm text-slate-600">
              <img
                className="h-8 w-8 rounded-full object-cover shadow-sm ring-2 ring-white"
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&q=80"
                alt="User avatar"
              />
              <span>What is use of that chatbot ?</span>
            </div>
            <div className="flex gap-4">
              <div className="hidden h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-200 sm:grid">
                <Sparkles size={20} />
              </div>
              <div className="max-w-3xl flex-1">
                <MessageHeader />
                <p className="text-[15px] font-bold leading-7 text-slate-900">
                  Chatbots can be used for a wide range of purposes, including:
                </p>
                <p className="mt-4 text-[15px] leading-7 text-slate-500">
                  Customer service, internal support, onboarding, product recommendations, education, and quick
                  access to company knowledge.
                </p>
              </div>
            </div>
          </article>
        </section>
      </div>

      <InputBar />
    </main>
  );
}

function InputBar() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center px-6">
      <form className="pointer-events-auto flex w-full max-w-2xl items-center gap-3 rounded-full border border-white/80 bg-white/80 p-2 pl-5 shadow-soft backdrop-blur-xl">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-rose-100 to-indigo-100 text-pink-500">
          <Sparkles size={16} />
        </span>
        <input
          className="h-11 min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
          placeholder="What's in your mind?"
          type="text"
        />
        <button className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-indigo-300">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}

function MobileHeader() {
  return (
    <div className="mb-4 flex items-center justify-between rounded-[1.5rem] bg-white/88 p-4 shadow-panel ring-1 ring-white/70 backdrop-blur-xl md:hidden">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
          <Bot size={20} />
        </span>
        <div>
          <p className="text-sm font-black tracking-[0.18em] text-slate-950">CHAT A.I+</p>
          <p className="text-xs text-slate-500">Create Chatbot GPT...</p>
        </div>
      </div>
      <button className="grid h-10 w-10 place-items-center rounded-full bg-slate-950 text-white">
        <Search size={18} />
      </button>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#c8d9ef] p-6 text-slate-900 lg:p-8">
      <div className="mx-auto flex h-[calc(100vh-3rem)] max-w-[1560px] flex-col rounded-[2.2rem] bg-white/45 p-4 shadow-soft ring-1 ring-white/70 backdrop-blur-xl lg:h-[calc(100vh-4rem)] lg:flex-row lg:gap-5">
        <MobileHeader />
        <div className="flex min-h-0 flex-1 gap-5">
          <Sidebar />
          <ChatArea />
        </div>
      </div>
    </div>
  );
}
