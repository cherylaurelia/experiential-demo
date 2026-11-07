import runs from "@/data/runs.json";
import { refusalText, seconds, thousands, toolLine, type Step } from "@/lib/runs";

const REPO = "https://github.com/cherylaurelia/experiential-demo";
const PATCH = "/experiential-tool-refusals.patch";
const BASE = "5bbb3524249c01727332db36e2715de884cd5399";
const SRC = `https://github.com/experientiallabs/experiential/blob/${BASE}`;
const MODEL = "Qwen3-4B-Instruct-2507 Q4_K_M on llama.cpp 0.9.0 (llama-server, 40K context, Apple Silicon)";
const VERSIONS = "experiential 0.7.233 from PyPI (main 5bbb352), Claude Code 2.1.318";

const steps: Step[] = runs.task.steps.map((s) => {
  if (s.kind === "tool") return { kind: "tool", name: s.name ?? "", input: s.input ?? {} };

  if (s.kind === "result") return { kind: "result", text: s.text ?? "" };

  return { kind: "text", text: s.text ?? "" };
});

const usage = runs.usage_claude_code;

const toolLines = steps.flatMap((s) => (s.kind === "tool" ? [toolLine(s.name, s.input)] : []));

function Prompt({ children }: { children: string }) {
  return (
    <div className="whitespace-pre-wrap break-words">
      <span className="text-term-green select-none">$ </span>
      {children}
    </div>
  );
}

function Terminal({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <figure className="border border-ink bg-term text-[13px] leading-relaxed text-white">
      <figcaption className="border-b border-white/15 px-4 py-2 font-mono text-[11px] tracking-wide text-white/60 uppercase">
        {title}
      </figcaption>
      <div className="space-y-2 overflow-x-auto px-4 py-3 font-mono">{children}</div>
    </figure>
  );
}

function Row({ step, cmd, before, after }: { step: string; cmd: string; before: string; after: string }) {
  return (
    <div className="grid gap-px border border-rule bg-rule md:grid-cols-[1fr_1fr]">
      <div className="bg-white p-4 md:col-span-2">
        <p className="font-mono text-[11px] tracking-wide text-muted uppercase">{step}</p>
        <code className="mt-1 block font-mono text-[13px] break-words">{cmd}</code>
      </div>
      <div className="bg-white p-4">
        <p className="mb-2 font-mono text-[11px] tracking-wide text-muted uppercase">Today (0.7.233)</p>
        <p className="font-mono text-[13px] leading-relaxed break-words text-[#b3543e]">{refusalText(before)}</p>
      </div>
      <div className="bg-white p-4">
        <p className="mb-2 font-mono text-[11px] tracking-wide text-accent uppercase">With the patch</p>
        <p className="font-mono text-[13px] leading-relaxed break-words">{refusalText(after)}</p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <main className="mx-auto max-w-[1040px] px-5 pb-16 md:px-8">
      <header className="flex items-center justify-between border-b border-rule py-5">
        <span className="font-mono text-[13px] tracking-[0.12em] uppercase">Experiential × Claude Code, local</span>
        <nav className="flex gap-2 text-[14px]">
          <a className="border border-rule px-3 py-1.5 hover:border-ink" href={PATCH}>
            Patch
          </a>
          <a className="bg-accent px-3 py-1.5 text-white hover:bg-[#0f6636]" href={REPO}>
            Repo
          </a>
        </nav>
      </header>

      <section className="grid items-start gap-10 border-b border-rule py-12 md:grid-cols-[1.15fr_1fr] md:py-16">
        <div>
          <h1 className="text-[34px] leading-[1.08] tracking-tight md:text-[46px]">
            <span className="bg-accent px-1 text-accent-ink">Claude Code</span> on a free local model,
            through Experiential.
          </h1>
          <p className="mt-6 max-w-[560px] text-[17px] leading-relaxed text-muted">
            It works: Claude Code fixed a real bug through the open-source gateway on a 4B model in llama.cpp,
            and the usage view attributed every call to <code className="font-mono text-ink">claude_code</code>.
          </p>
          <p className="mt-4 max-w-[560px] text-[17px] leading-relaxed text-muted">
            Getting there took two alias flags that no error mentions. Both refusals say{" "}
            <em className="text-ink">&ldquo;Remove the field and resend&rdquo;</em>, and a coding agent can&apos;t remove its
            tools. A small patch makes each refusal name its flag, and adds the missing one to the Fireworks
            and Modal recipes.
          </p>
        </div>
        <Terminal title={`claude -p · model alias "qwent" · ${seconds(runs.task.result.duration_ms)}, ${runs.task.result.num_turns} turns`}>
          <Prompt>python3 test_prices.py fails. Find the bug in prices.py, fix it, and run the test again.</Prompt>
          {toolLines.map((line) => (
            <div key={line} className="text-term-green">
              ⏺ {line}
            </div>
          ))}
          <div className="text-white/80">all tests passed</div>
          <div className="border-t border-white/15 pt-2 text-white/60">
            usage.json · client_app claude_code · {thousands(usage.input_tokens)} input tokens (
            {thousands(usage.cached_input_tokens)} cached) · upstream cost $0, local
          </div>
        </Terminal>
      </section>

      <section className="border-b border-rule py-12">
        <h2 className="text-[26px] tracking-tight">The same three alias commands, before and after</h2>
        <p className="mt-3 max-w-[720px] leading-relaxed text-muted">
          A local <code className="font-mono">openai-compatible</code> connection to llama.cpp, set up headless with the
          commands <code className="font-mono">exp --non-interactive</code> prints. Each row is a real Claude Code run;
          the text is what Claude Code printed after <code className="font-mono">API Error: 400</code>.
        </p>
        <div className="mt-8 space-y-6">
          <Row
            step="1 · the printed next command"
            cmd="exp config gateway alias create qwen --deployment local:qwen3-4b --exact-model qwen3-4b"
            before={runs.before.noflags}
            after={runs.after.noflags}
          />
          <Row
            step="2 · add the obvious flag"
            cmd="… --supports-tools"
            before={runs.before.tools}
            after={runs.after.tools}
          />
          <div className="border border-accent bg-[#f3fbf6] p-4">
            <p className="font-mono text-[11px] tracking-wide text-accent uppercase">3 · add the second flag</p>
            <code className="mt-1 block font-mono text-[13px] break-words">
              … --supports-tools --supports-streaming-tool-arguments
            </code>
            <p className="mt-2 text-[15px]">
              Claude Code runs, on 0.7.233 as released (the hero run used this alias, named{" "}
              <code className="font-mono">qwent</code>, beside the flagless <code className="font-mono">qwen</code>). The
              patch changes no routing and no defaults: refusals still happen, they just say why.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-10 border-b border-rule py-12 md:grid-cols-2">
        <div>
          <h2 className="text-[26px] tracking-tight">Why step 2 still fails</h2>
          <p className="mt-3 leading-relaxed text-muted">
            The gateway always streams to the upstream, and an <code className="font-mono">openai-compatible</code>{" "}
            route isn&apos;t certified to stream tool-call arguments, so it refuses tools until the alias declares it. That
            refusal is reported on <code className="font-mono">tools</code> with the generic wording, so it reads exactly
            like step 1.
          </p>
          <p className="mt-3 leading-relaxed text-muted">
            The repo already fixed this wording once: the forced <code className="font-mono">tool_choice</code> refusal
            names its way out because the generic text left callers with &ldquo;nothing actionable&rdquo; (
            <a className="underline" href={`${SRC}/exp/runtime/gateway/native_bridge_test.py#L277-L280`}>
              native_bridge_test.py
            </a>
            ). The patch adds the same kind of message for the two tool refusals. It says &ldquo;ask the gateway
            operator&rdquo; because the reader is usually an agent or app calling someone else&apos;s gateway; on a laptop
            that operator is you.
          </p>
        </div>
        <div>
          <h2 className="text-[26px] tracking-tight">The patch</h2>
          <ul className="mt-3 space-y-2 leading-relaxed text-muted">
            <li>
              <code className="font-mono">native_bridge_errors.py</code>: two entries in the existing per-capability message
              map, <code className="font-mono">function_tools</code> and{" "}
              <code className="font-mono">streaming_tool_arguments</code>.
            </li>
            <li>
              <code className="font-mono">openai-compatible-recipes.md</code>: Fireworks gets{" "}
              <code className="font-mono">--supports-streaming-tool-arguments</code>; Modal gets one paragraph on both
              flags.
            </li>
            <li>
              Tests: one parametrized refusal test, one assertion updated from &ldquo;Remove the field&rdquo;, the
              Fireworks recipe test flags. Ruff, ruff format and ty clean; 6,597 gateway and protocol tests pass, one
              shutdown-timing test fails on the base commit too.
            </li>
          </ul>
          <a className="mt-5 inline-block bg-accent px-4 py-2 text-white hover:bg-[#0f6636]" href={PATCH}>
            Download the patch (git am)
          </a>
        </div>
      </section>

      <section className="py-12">
        <details className="border border-rule">
          <summary className="cursor-pointer px-4 py-3 text-[17px]">More evidence and how to rerun it</summary>
          <div className="space-y-4 border-t border-rule px-4 py-4 leading-relaxed text-muted">
            <p>
              <strong className="text-ink">Not only local models.</strong> A native <code className="font-mono">openai</code>{" "}
              alias created without <code className="font-mono">--supports-tools</code> refuses a tools request the same
              way, before dispatch. With the flag the identical request goes out to OpenAI (it failed only on the dummy
              key I used).
            </p>
            <p>
              <strong className="text-ink">The Fireworks recipe as written.</strong> Running the recipe&apos;s commands with
              a placeholder key: a request with <code className="font-mono">tools</code> gets the step-2 refusal; the
              same request without tools is dispatched to Fireworks.
            </p>
            <p>
              <strong className="text-ink">The interactive wizard.</strong> For a custom endpoint it asks &ldquo;Does this
              custom endpoint stream tool-call arguments?&rdquo; with default No (
              <a className="underline" href={`${SRC}/exp/cli/gateway/setup.py#L231-L235`}>
                setup.py
              </a>
              ). I read this in the code and did not drive the wizard.
            </p>
            <p>
              <strong className="text-ink">Where the default comes from.</strong>{" "}
              <a className="underline" href={`${SRC}/exp/cli/gateway/alias.py#L325`}>
                alias.py:325
              </a>{" "}
              (<code className="font-mono">--supports-tools</code> defaults to False) and the next command printed by{" "}
              <a className="underline" href={`${SRC}/exp/cli/gateway/serve.py#L424`}>
                serve.py:424
              </a>
              .
            </p>
            <p>
              <strong className="text-ink">Setup.</strong> {VERSIONS}. Model: {MODEL}. Claude Code ran with a throwaway
              HOME and <code className="font-mono">ANTHROPIC_BASE_URL</code> pointed at the gateway&apos;s Messages
              endpoint. Usage numbers are cumulative for that gateway session&apos;s Claude Code runs, including the
              refused ones. One task and one small model: this shows the path works, not how good a 4B model is at
              coding.
            </p>
            <pre className="overflow-x-auto bg-wash p-3 font-mono text-[12px] text-ink">{`pip install experiential==0.7.233
llama-server -m qwen3-4b-instruct-2507-q4_k_m.gguf --jinja -c 40960 --port 8080
export LOCAL_LLM_KEY=unused
exp config gateway init --root R --non-interactive --json
exp config gateway provider add local --provider openai-compatible \\
  --base-url http://127.0.0.1:8080/v1 --credential-env LOCAL_LLM_KEY --root R --non-interactive --json
exp config gateway alias create qwent --deployment local:qwen3-4b --exact-model qwen3-4b \\
  --supports-tools --supports-streaming-tool-arguments --root R --non-interactive --json
exp config gateway identity create default --root R --non-interactive --json
exp config gateway grant add default qwent --root R --non-interactive --json
exp config gateway key issue default --key-id k1 --root R --output key.txt --json
exp run --root R
ANTHROPIC_BASE_URL=http://127.0.0.1:8000 ANTHROPIC_AUTH_TOKEN=$(cat key.txt) \\
  ANTHROPIC_MODEL=qwent ANTHROPIC_SMALL_FAST_MODEL=qwent claude -p "..."`}</pre>
          </div>
        </details>
      </section>

      <footer className="border-t border-rule pt-6 text-[13px] text-muted">
        Unofficial demo by Cheryl Aurelia: not affiliated with Experiential Labs. Recorded 2026-11-06.{" "}
        <a className="underline" href={REPO}>
          Source and raw outputs
        </a>
        .
      </footer>
    </main>
  );
}
