import {
  BrainCircuit,
  Check,
  Crown,
  FolderKanban,
  GitCompare,
  History,
  MessageSquare,
  Rocket,
  Sparkles,
  Upload,
} from "lucide-react";

export const navItems = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#services" },
  { label: "Use Cases", href: "#case-studies" },
  { label: "Pricing", href: "#pricing" },
];

export const trustedLogos = ["Research", "Docs", "Strategy", "Support"];

export const services = [
  {
    eyebrow: "Multi-model chat",
    title: "Chat with the right AI model for every task",
    description:
      "Move between leading AI models inside one workspace. Ask, refine, and keep the full conversation history without switching tabs or losing context.",
    tags: ["Model switching", "Saved chats", "Fast prompts"],
    visual: "tasks",
  },
  {
    eyebrow: "File analysis",
    title: "Upload files and turn documents into answers",
    description:
      "Drop in PDFs, notes, briefs, transcripts, or reports. Ask questions, extract summaries, find contradictions, and keep the analysis beside the original chat.",
    tags: ["PDFs", "Reports", "Summaries"],
    visual: "assistant",
    reverse: true,
  },
  {
    eyebrow: "Model comparison",
    title: "Compare responses before you decide",
    description:
      "Run the same question through different models, compare tone and reasoning, then continue with the strongest answer in your research flow.",
    tags: ["Side-by-side", "Better drafts", "Second opinions"],
    visual: "email",
  },
  {
    eyebrow: "Workspace memory",
    title: "Organize projects, chats, and research threads",
    description:
      "Group conversations by project, keep useful outputs in one place, and return to previous research without rebuilding context from scratch.",
    tags: ["Folders", "History", "Research library"],
    visual: "project",
    reverse: true,
  },
];

export const processSteps = [
  {
    step: "Step 1",
    title: "Start a focused workspace",
    description: "Create a chat for a topic, client, class, feature, or research question and keep every thread organized.",
    visual: "radar",
  },
  {
    step: "Step 2",
    title: "Add models and files",
    description: "Choose the model that fits the job, upload source material, and ask questions against your real context.",
    visual: "code",
  },
  {
    step: "Step 3",
    title: "Compare and refine",
    description: "Review multiple AI responses, challenge weak answers, and shape the output into something you can use.",
    visual: "integration",
  },
  {
    step: "Step 4",
    title: "Save the research trail",
    description: "Return to past conversations, reuse decisions, and keep project knowledge inside one searchable workspace.",
    visual: "optimize",
  },
];

export const benefits = [
  {
    icon: MessageSquare,
    title: "One place for AI chat",
    description: "Use multiple models from a single interface instead of scattering prompts across separate tools.",
  },
  {
    icon: Upload,
    title: "Files become context",
    description: "Upload source material and ask questions that stay grounded in the documents you are working with.",
  },
  {
    icon: GitCompare,
    title: "Compare model output",
    description: "Check different responses before committing to a draft, answer, plan, or technical decision.",
  },
  {
    icon: FolderKanban,
    title: "Cleaner project organization",
    description: "Keep research threads, chat history, and useful answers grouped by workspace instead of buried in tabs.",
  },
  {
    icon: History,
    title: "Conversation history that matters",
    description: "Pick up where you left off with saved context, previous prompts, and past conclusions.",
  },
  {
    icon: BrainCircuit,
    title: "Better research workflows",
    description: "Summarize, evaluate, rewrite, and explore ideas without losing the evidence behind each answer.",
  },
];

export const pricingPlans = [
  {
    icon: Rocket,
    name: "Starter",
    price: "$37",
    period: "/month",
    description: "For individuals who want a reliable AI workspace for daily chat, files, and notes.",
    cta: "Start chatting",
    features: [
      "Multi-model AI chat",
      "Conversation history",
      "File upload and analysis",
      "Project folders",
      "Core workspace search",
    ],
  },
  {
    icon: Sparkles,
    name: "Professional",
    price: "$75",
    period: "/month",
    description: "For power users and teams comparing models, files, and research across projects.",
    cta: "Open workspace",
    popular: true,
    features: [
      "Everything in Starter",
      "Side-by-side model comparison",
      "Larger file analysis limits",
      "Shared project workspaces",
      "Priority model access",
    ],
  },
  {
    icon: Crown,
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For organizations that need managed AI workspaces, controls, and team rollout support.",
    cta: "Open workspace",
    features: [
      "Team workspace management",
      "Custom model/provider setup",
      "Admin controls and permissions",
      "Security review support",
      "Dedicated onboarding",
    ],
  },
];

export const testimonials = [
  {
    name: "Maya Chen",
    role: "Product Research Lead",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=96&q=80",
    quote:
      "Xtract keeps our research threads, uploaded interviews, and model comparisons in one place. I can trace every decision back to the source conversation.",
  },
  {
    name: "Sophia Martinez",
    role: "Graduate Researcher",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=96&q=80",
    quote:
      "I use it to upload papers, compare summaries from different models, and keep literature review notes organized by topic.",
  },
  {
    name: "David Reynolds",
    role: "Engineering Manager",
    avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=96&q=80",
    quote:
      "The model comparison flow is useful for technical planning. We test explanations, identify gaps, and save the final reasoning with the project.",
  },
  {
    name: "Emily Wong",
    role: "Content Strategist",
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=96&q=80",
    quote:
      "Instead of copying prompts between tools, I keep outlines, drafts, source files, and revisions inside one workspace.",
  },
];

export const faqs = [
  {
    question: "What is Xtract?",
    answer:
      "Xtract is an AI workspace for chatting with multiple models, analyzing files, comparing responses, and organizing research conversations.",
  },
  {
    question: "Can I upload files and ask questions about them?",
    answer:
      "Yes. You can upload documents and use them as context for summaries, analysis, extraction, rewriting, and follow-up questions.",
  },
  {
    question: "Can I compare different AI model responses?",
    answer:
      "Yes. The workspace is built around using the right model for the task and comparing outputs before you continue with a final answer.",
  },
  {
    question: "Does Xtract save my conversation history?",
    answer:
      "Yes. Conversations are saved so you can return to past research, reuse context, and keep project decisions organized.",
  },
  {
    question: "How do I start using the chat application?",
    answer:
      "Use the Open Workspace or Start Chatting buttons to go to /chat and begin a conversation in the AI workspace.",
  },
];

export const footerLinks = {
  Links: ["Features", "Workflow", "Use cases", "Benefits", "Pricing"],
  Pages: ["Home", "Chat", "FAQ", "Contact"],
  Socials: ["LinkedIn", "Twitter", "GitHub", "Docs"],
};

export const checkIcon = Check;
