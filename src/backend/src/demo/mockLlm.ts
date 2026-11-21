/** DEMO MODE ONLY — deterministic assistant replies instead of calling the LLM provider. */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function mockChatReply(messages: { role: string; content: string }[]): Promise<string> {
  await sleep(1200);
  const last = (messages[messages.length - 1]?.content || "").toLowerCase();
  if (/plan|today|schedule|day/.test(last)) {
    return "Here's a plan for today:\n\n1. 09:30 — Deep work: finish the Q3 product brief (90 min)\n2. 11:30 — Team stand-up\n3. 14:00 — Review the onboarding flow feedback\n4. 16:30 — 30-minute walk, no phone\n\nWant me to add these to your calendar and tasks?";
  }
  if (/task|todo|remind/.test(last)) {
    return "Done. I've drafted 3 tasks: \"Send invoice to studio client\" (today), \"Book dentist\" (this week) and \"Renew gym plan\" (next week). Shall I set reminders?";
  }
  if (/telegram/.test(last)) {
    return "To reach me on Telegram, open Settings → Connect Telegram and paste the bot token from BotFather. I'll restart your agent with the channel enabled.";
  }
  return "Got it. I'm your AG7 assistant running in your own isolated OpenClaw container. I can plan your day, manage tasks and calendar, and answer questions. What would you like to do next?";
}
