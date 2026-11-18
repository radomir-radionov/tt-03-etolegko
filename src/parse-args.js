/**
 * @param {string[]} argv — process.argv
 * @returns {{ url: string }}
 */
export function parseArgs(argv) {
  const urlArg = argv[2];

  if (urlArg === undefined || urlArg === "") {
    throw new Error("URL is required. Usage: node src/cli.js <url>");
  }

  let parsed;
  try {
    parsed = new URL(urlArg);
  } catch {
    throw new Error(`Invalid URL: ${urlArg}`);
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("URL must use http or https");
  }

  return { url: parsed.href };
}