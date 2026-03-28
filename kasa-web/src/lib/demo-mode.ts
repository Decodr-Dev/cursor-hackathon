export const READ_ONLY_DEMO_MESSAGE =
  "This public demo is browse-only right now. Reports, uploads, votes, and demo verification stay enabled in local development, but are disabled on Vercel until hosted storage is wired up.";

export function isReadOnlyDemo() {
  return process.env.KASA_READ_ONLY === "1";
}
