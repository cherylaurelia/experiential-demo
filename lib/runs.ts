export type Step =
  | { kind: "tool"; name: string; input: Record<string, string> }
  | { kind: "text"; text: string }
  | { kind: "result"; text: string };

/** One line per tool call, the way a terminal shows Claude Code's actions. */
export function toolLine(name: string, input: Record<string, string>): string {
  if (name === "Bash") return `Bash(${input.command ?? ""})`;
  const path = input.file_path ?? "";

  return `${name}(${path.split("/").at(-1) ?? path})`;
}

export function seconds(ms: number): string {
  return `${(ms / 1000).toFixed(0)} s`;
}

/** Strips Claude Code's "API Error: 400 " prefix and the trailing "(param: tools)". */
export function refusalText(line: string): string {
  return line.replace(/^API Error: 400 /, "").replace(/ \(param: tools\)$/, "");
}

export function thousands(n: number): string {
  return n.toLocaleString("en-US");
}
