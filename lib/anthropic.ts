import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { ROUTER_SYSTEM_PROMPT, type AgentSlug } from "@/lib/agents";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODEL = "claude-haiku-4-5-20251001";
const REVIEW_MODEL = "claude-sonnet-5";

export type ChatTurn = { role: "user" | "assistant"; content: string };

export async function classifyAgent(message: string): Promise<AgentSlug> {
  const res = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 100,
    system: ROUTER_SYSTEM_PROMPT,
    messages: [{ role: "user", content: message }],
    tools: [
      {
        name: "classify",
        description: "Classify which agent should answer this message.",
        input_schema: {
          type: "object",
          properties: {
            agent: { type: "string", enum: ["job", "projects", "me"] },
          },
          required: ["agent"],
        },
      },
    ],
    tool_choice: { type: "tool", name: "classify" },
  });

  const toolUse = res.content.find((b) => b.type === "tool_use");
  const agent = (toolUse && "input" in toolUse ? (toolUse.input as { agent?: string }).agent : undefined) as
    | AgentSlug
    | undefined;
  return agent && ["job", "projects", "me"].includes(agent) ? agent : "me";
}

export async function getAgentReply(
  systemPrompt: string,
  history: ChatTurn[]
): Promise<{ reply: string; needsFollowup: boolean }> {
  const res = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 600,
    system: [
      {
        type: "text",
        text: systemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: history.map((turn) => ({ role: turn.role, content: turn.content })),
    tools: [
      {
        name: "respond",
        description: "Send the reply to the visitor.",
        input_schema: {
          type: "object",
          properties: {
            reply: {
              type: "string",
              description: "The reply text, written in character, in the specified style.",
            },
            needsFollowup: {
              type: "boolean",
              description:
                "True if the knowledge provided doesn't actually answer this question and it should be flagged for a real follow-up instead of guessed at.",
            },
          },
          required: ["reply", "needsFollowup"],
        },
      },
    ],
    tool_choice: { type: "tool", name: "respond" },
  });

  const toolUse = res.content.find((b) => b.type === "tool_use");
  const input = toolUse && "input" in toolUse ? (toolUse.input as { reply?: string; needsFollowup?: boolean }) : {};

  return {
    reply: input.reply ?? "Sorry, something went wrong on my end — please try again.",
    needsFollowup: input.needsFollowup ?? false,
  };
}

export type KnowledgeProposal = {
  agentScope: "job" | "me" | "projects" | "shared";
  title: string;
  content: string;
  addressesQuestions: string[];
};

const REVIEW_SYSTEM_PROMPT = `
You review a portfolio chatbot's unanswered visitor questions and draft knowledge-base entries for the site owner to review and approve — nothing you write goes live automatically.

Hard rule: you may only use facts already present in the "Existing knowledge base" you're given. You must NEVER invent, guess, or infer new personal facts about the site owner (hobbies, opinions, history, preferences, anything biographical). If a question can be answered by cross-referencing or synthesizing facts that already exist in the knowledge base, draft that answer. Otherwise, draft a placeholder entry that clearly flags the gap and asks the owner to fill in the real answer — write the placeholder content as an honest note to the owner ("Visitors keep asking about X — no info in the knowledge base yet. Replace this with your real answer before approving."), not as a fabricated first-person answer.

Group similar/duplicate questions into a single proposal. Skip questions that are just privacy-boundary requests (address, phone, etc.) — those are handled correctly elsewhere and don't need a knowledge entry.
`.trim();

export async function proposeKnowledgeUpdates(
  openTickets: { question: string; agent: string }[],
  existingKnowledge: { agentScope: string; title: string; content: string }[],
  projectsSummary: string
): Promise<KnowledgeProposal[]> {
  if (openTickets.length === 0) return [];

  const ticketsBlock = openTickets.map((t, i) => `${i + 1}. [${t.agent}] ${t.question}`).join("\n");
  const knowledgeBlock = existingKnowledge.map((k) => `### [${k.agentScope}] ${k.title}\n${k.content}`).join("\n\n");

  const res = await anthropic.messages.create({
    model: REVIEW_MODEL,
    max_tokens: 2000,
    system: REVIEW_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Open visitor questions the chatbot couldn't answer:\n${ticketsBlock}\n\nExisting knowledge base:\n${knowledgeBlock || "(empty)"}\n\nProject data (also usable as source facts — tech stacks, descriptions, etc. count as real facts, not invented ones):\n${projectsSummary}`,
      },
    ],
    tools: [
      {
        name: "propose_knowledge_updates",
        description: "Propose knowledge-base entries addressing the open questions.",
        input_schema: {
          type: "object",
          properties: {
            proposals: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  agentScope: { type: "string", enum: ["job", "me", "projects", "shared"] },
                  title: { type: "string" },
                  content: { type: "string" },
                  addressesQuestions: {
                    type: "array",
                    items: { type: "string" },
                    description: "Exact question text(s) from the list above that this proposal addresses.",
                  },
                },
                required: ["agentScope", "title", "content", "addressesQuestions"],
              },
            },
          },
          required: ["proposals"],
        },
      },
    ],
    tool_choice: { type: "tool", name: "propose_knowledge_updates" },
  });

  const toolUse = res.content.find((b) => b.type === "tool_use");
  const input = toolUse && "input" in toolUse ? (toolUse.input as { proposals?: KnowledgeProposal[] }) : {};
  return input.proposals ?? [];
}
