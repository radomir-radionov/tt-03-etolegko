import { run } from "./run.js";

try {
  await run(process.argv);
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(message);
  process.exit(1);
}