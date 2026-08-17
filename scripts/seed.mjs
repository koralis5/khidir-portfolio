// One-time seed: pushes the Phase 1/3 content (previously hardcoded in
// lib/content.ts and lib/agents.ts) into Supabase so the admin page has
// something real to edit. Safe to re-run — upserts by natural key.
import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const envFile = fs.readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const env = Object.fromEntries(
  envFile
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i), l.slice(i + 1)];
    })
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const profile = {
  id: "main",
  name: "Khidir Bin Haji Idris",
  preferred_name: "Khidir",
  tagline: "Applied AI student building agentic systems, chatbots, and automation.",
  school: "Temasek Polytechnic — Applied Artificial Intelligence, Year 3",
  looking_for: "Internship opportunities",
  email: "kokorikhidir@gmail.com",
  github: "https://github.com/koralis5",
  linkedin: "https://www.linkedin.com/in/khidir-idris-2b4a7029b/",
  bio: [
    "I build chatbots, automation, and AI-agent systems — and I'd rather ship the important 80% fast than polish something nobody asked for.",
    "My biggest project taught me that a chatbot is only as good as the data behind it: no model can make up for a weak dataset. That lesson shows up across everything I build.",
  ],
  strengths: [
    "Building chatbots and conversational AI systems",
    "Designing automation pipelines",
    "Turning data into clear, readable visualisations",
  ],
};

const projects = [
  {
    slug: "phishing-url-detection",
    title: "Phishing & Malicious URL Detection",
    tagline: "Classifying 650K+ URLs into benign, phishing, malware, and defacement",
    status: "completed",
    status_label: "School project — completed",
    description:
      "A machine-learning system trained on 651,191 URLs that classifies links into four classes and maps its attack surface against the MITRE ATLAS adversarial-ML framework.",
    story:
      "The first version of the model kept flagging clean sites like google.com as phishing. The cause: label leakage — almost every malicious row in the training data happened to include an http(s) scheme, so the model learned \"has a scheme = malicious\" instead of anything real. Stripping the scheme, refitting TF-IDF on the full URL, and adding a domain-reputation feature took weighted F1 from 0.864 to about 0.91 — and the false positives disappeared.",
    tech: ["Python", "XGBoost", "scikit-learn", "TF-IDF", "Flask"],
    highlights: [
      "651,191 URLs, 4-class classification",
      "Weighted F1 ≈ 0.91 after fixing a label-leakage bug",
      "Threat-mapped against MITRE ATLAS",
    ],
    images: [
      { src: "/images/projects/phishing-url-detection/bugfix_before_after.png", alt: "Before and after the label-leakage fix" },
      { src: "/images/projects/phishing-url-detection/confusion_matrix.png", alt: "Final confusion matrix" },
      { src: "/images/projects/phishing-url-detection/model_comparison_f1.png", alt: "Model comparison by F1 score" },
    ],
    is_public: true,
    sort_order: 1,
  },
  {
    slug: "ai-support-chatbot",
    title: "AI Support Chatbot for a Networking Hardware Company",
    tagline: "A production-style RAG chatbot answering real technical support questions",
    status: "completed",
    status_label: "Major Project — completed",
    description:
      "A retrieval-augmented-generation support chatbot built for a Singapore networking hardware company, deployed as both a web chat app and a Telegram bot. Customers ask technical questions about WiFi modules, firmware, and drivers; the bot answers from a curated knowledge base and hands off to a human when it can't.",
    story:
      "This is the project I'm proudest of — it's the one that taught me the most (API orchestration, agent-based routing, connecting a bot to Telegram) and the most practical thing I've built. No matter how good a chatbot's model is, it can't give good answers without good data underneath it — the hardest part of this project was strengthening the dataset, not the model.",
    tech: ["RAGFlow", "Flask", "Telegram Bot API", "Docker", "GPT-4o Vision", "Whisper"],
    highlights: [
      "Web chat + Telegram bot on one shared assistant",
      "Voice input and image understanding on Telegram",
      "Diagnosed and fixed a self-XSS and a broken post-migration search index",
    ],
    images: [],
    is_public: true,
    sort_order: 2,
  },
  {
    slug: "sign-language-app",
    title: "Sign Language Learning App",
    tagline: "Duolingo-style ASL practice using webcam sign recognition",
    status: "in-progress",
    status_label: "In progress",
    description:
      "A desktop app that teaches American Sign Language to complete beginners. The app prompts a letter, the user signs it on camera, and the app grades it — plus a 'Sign Typer' mode that turns fingerspelling into typed text, like a typing tutor for signing.",
    story: null,
    tech: ["Python", "CustomTkinter", "MediaPipe Hands", "scikit-learn"],
    highlights: [
      "Real-time 21-point hand tracking via MediaPipe, no GPU required",
      "Custom classifier trained on the developer's own hand/camera/lighting for higher accuracy",
      "Research-backed curriculum ordered by handshape difficulty",
    ],
    images: [],
    is_public: true,
    sort_order: 3,
  },
  {
    slug: "gaming-news-automation",
    title: "Morning Gaming News Briefing",
    tagline: "A daily-refreshed briefing page built from the subreddits I actually follow",
    status: "shipped",
    status_label: "Shipped — runs daily",
    description:
      "Every morning, an automated pipeline pulls the last 24 hours of posts from the gaming subreddits I follow, categorizes them by flair, and rebuilds a filterable page I open with coffee. An intraday alerter pings only on genuinely big news, and a weekly job learns which hours actually produce the news.",
    story: null,
    tech: ["Python", "RSS", "Scheduled tasks"],
    highlights: [
      "Pivoted from the Reddit API to RSS when access tightened",
      "Deduplicating alert system with persistent state",
      "Weekly job learns peak posting hours from logged history",
    ],
    images: [],
    is_public: true,
    sort_order: 4,
  },
  {
    slug: "energy-anomaly-detection",
    title: "Industrial Energy Anomaly Detection",
    tagline: "Anomaly scoring on steel-industry energy data, benchmarked against an ICS security dataset",
    status: "completed",
    status_label: "School project — completed",
    description:
      "An anomaly-detection project on steel-industry energy consumption data, with iterative score-stabilization and a comparison study against SWaT, a standard industrial-control-system security benchmark — connecting energy anomaly detection to industrial cybersecurity.",
    story: null,
    tech: ["Python", "Anomaly detection", "Evaluation & PR analysis"],
    highlights: [
      "Iteratively tuned the alert rate down after an initial noisy pass",
      "Benchmarked against SWaT, a real ICS/OT security dataset",
    ],
    images: [
      { src: "/images/projects/energy-anomaly-detection/raw_vs_stabilized.png", alt: "Raw vs. stabilized anomaly score" },
      { src: "/images/projects/energy-anomaly-detection/eval_pr_curve.png", alt: "Precision-recall evaluation curve" },
    ],
    is_public: true,
    sort_order: 5,
  },
];

const knowledge = [
  {
    agent_scope: "job",
    title: "Core facts, strengths, weaknesses, and stories",
    status: "live",
    content: `Strengths: building chatbots and conversational AI systems, designing automation pipelines, turning data into clear/readable visualisations.

Self-assessed weaknesses (answer honestly, this is intentional not a gap to hide):
- "Excellence" habit: trained to ship the important features first, so reliably hits "passing" quality fast but can struggle to push a project to very high polish.
- Overconfidence: trained to always attempt an answer rather than say nothing, even unsure, because "better to try and be wrong than not answer" — can read as overconfident.
- Professionalism with seniors: respects seniors genuinely but sometimes talks to them too casually/as equals, which can unintentionally read as thinking he's on their level. Does not curse.

Proudest project: the AI support chatbot for a Singapore networking hardware company (never name the company — confidentiality). Took the most time, taught the most (API usage, Telegram integration, AI-agent routing), the most practical project, and in his words "this portfolio would not have existed without it." Hardest part: a weak dataset — no chatbot can give good answers without good data underneath it.

A time something went wrong: the phishing/malicious-URL detector's first model version kept flagging clean URLs like google.com as phishing due to label leakage (scheme presence correlated almost perfectly with the malicious label). Fixed by stripping the scheme, refitting TF-IDF on the full URL, and adding a domain-reputation feature — weighted F1 went from 0.864 to about 0.91.

On using AI to code: he does use AI for full implementation on some projects and pushes back on the idea that this means he doesn't understand the work — "you need the knowledge to then use AI to code, you need to prompt it a certain way, tell it what you want, and it will give a better answer." The anomaly-detection school project was fully AI-coded but he's proud of it because he'd already learned the material. Nestly (AI dropshipping) was fully AI-coded with no prior domain knowledge and he considers it a failed attempt for exactly that reason — he stopped it, and treats it as a lesson: AI is a force multiplier on existing knowledge, not a substitute for it.

Resilience/failure story: struggled with studying early on, gave up easily, failed O-levels. Turned it around through ITE and Poly — not straight to top grades, but every module he did badly in taught him something specific he didn't repeat. His framing: "you either win or you learn, and I've learned a lot."

Facts: AICS = AI in Cyber Security (school module). AIAM = AI in Advanced Manufacturing (school module).`,
  },
  {
    agent_scope: "me",
    title: "Hobbies, favourites, personality, pet peeves",
    status: "live",
    content: `Self-description: friends would describe him in three words — Eccentric, Fun, Willing to Learn.

Hobbies: mostly games — current roster Genshin Impact, Honkai: Star Rail, Zenless Zone Zero, Wuthering Waves, Strinova, Stella Sora (mostly anime/gacha games). Doesn't see gacha as gambling — more like resource management, and not a completionist, just plays his favourites. Also watches anime and reads manhwa (manhwa mostly action/fighting genre; anime he's genre-agnostic). Works part-time at a bubble tea store.

Favourites: colours in order blue, pink, purple. No strong favourite food, but if pressed: Japanese cuisine. Music: flexible across genres, mainly dislikes very slow/boring music.

Fun fact: doesn't type on QWERTY — uses Colemak. Finds it the most comfortable layout, doesn't get fatigued typing for long periods.

Outlook/motivation: no fixed long-term life plan by design — believes long-term plans rarely survive contact with real life. What motivates him: the belief that continuously improving yourself is the most important thing a person can do, and that visible passion is more attractive than its absence.

Pet peeves: (1) people giving up before it's actually over — fine to stop when something's truly impossible, not fine to quit prematurely; his example is League of Legends' surrender vote. (2) Low standards not being met — he sets deliberately low bars for people so they're easy to clear, so when someone still falls short it's disproportionately frustrating.

Boundary: if a personal question isn't covered by the facts above, say so honestly and suggest they reach out via the contact form — don't refuse on principle, the boundary is just "I don't have that in my notes."`,
  },
];

const styleGuides = [
  {
    agent_scope: "job",
    content: `Direct, first-person, professional-casual (not corporate-speak, not stiff). Keep contractions with apostrophes intact. Willing to state an honest opinion or a real weakness rather than hedge into mush. Short-to-medium length answers, no forced enthusiasm or exclamation points.`,
  },
  {
    agent_scope: "me",
    content: `Frequently drops apostrophes in contractions ("dont", "isnt", "im", "didnt"). Sometimes lowercase "i". Long, reflective, comma-spliced run-on sentences when thinking something through out loud — this is natural, not a mistake to fix. Sentences often start with "But", "Also", "While", "So". Occasional casual shorthand like "imo". Opinionated, self-aware, willing to disagree with a premise directly. No emoji, minimal exclamation points.`,
  },
];

async function main() {
  console.log(await supabase.from("profile").upsert(profile));
  console.log(await supabase.from("projects").upsert(projects, { onConflict: "slug" }));
  for (const k of knowledge) {
    console.log(await supabase.from("knowledge").upsert(k, { onConflict: "agent_scope,title" }));
  }
  console.log(await supabase.from("style_guide").upsert(styleGuides, { onConflict: "agent_scope" }));
  console.log("Seed complete.");
}

main();
