export type ParsedArgs = {
  readonly url: string;
};

export function parseArgs(argv: readonly string[]): ParsedArgs {
  const urlArg = argv[2];

  if (urlArg === undefined || urlArg === "") {
    throw new Error("URL is required. Usage: npm start -- <url>");
  }

  let parsed: URL;
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