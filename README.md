# Claude Code on a local model through Experiential

Unofficial demo by Cheryl Aurelia; not affiliated with Experiential Labs.

A recorded run of [Experiential](https://github.com/experientiallabs/experiential)'s open-source
gateway (0.7.233, main `5bbb352`) in front of llama.cpp serving Qwen3-4B-Instruct-2507, with
Claude Code 2.1.318 pointed at the gateway's Messages endpoint.

## What it shows

- **It works.** With an alias declared `--supports-tools --supports-streaming-tool-arguments`,
  Claude Code read, fixed and re-tested a small Python bug through the gateway in 5 turns (40 s),
  and `/usage.json` attributed the calls to `client_app: claude_code`.
- **Two flags no error names.** Set up headless with the commands `exp --non-interactive` prints,
  the alias refuses every request carrying `tools`. Adding `--supports-tools` gives the identical
  message, because an `openai-compatible` route also needs `--supports-streaming-tool-arguments`.
  Both say "Remove the field and resend the request", which a coding agent can't do. The
  Fireworks recipe in `docs/reference/openai-compatible-recipes.md` hits the second one as written.
- **A patch** ([`public/experiential-tool-refusals.patch`](public/experiential-tool-refusals.patch),
  `git am`-ready): each refusal names its flag (two entries in the existing per-capability message
  map in `native_bridge_errors.py`), and the Fireworks/Modal recipes declare streamed tool
  arguments. Ruff, ruff format and ty pass; their gateway, protocol and recipe tests pass except
  one shutdown-timing test that also fails on the base commit.

## Raw outputs

`runs/`: Claude Code's printed errors for each step, before (released 0.7.233) and after (patched
build), the trimmed transcript of the working run (tool calls, model text, results), and the fixed
file. The page reads `data/runs.json`, built from those files.

## Run the page

```bash
npm install
npm run build && npm run start
npm test   # helper tests
```
