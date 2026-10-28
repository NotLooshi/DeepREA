# UICBINS

**UI Can't Believe It's Not Slop** — a compact workflow for building and reviewing distinctive, usable web interfaces.

One request includes a brief and component blueprint, implementation, functional checks, an adversarial design review, and final verification. “One-shot” means one user handoff with internal iteration; it does not mean accepting the first generated page.

Supply a reference website URL to adapt its layout, typography and interactions to your own brief. This standalone release includes the full workflow and works without Pro.

## Install from this repository

For a project-local Codex installation, copy the complete `skills/uicbins` folder to `<your-project>/.agents/skills/uicbins`, then start a new task in that project and invoke `$uicbins`. This route was exercised with a clean extraction and an explicit PLAN invocation in the local Codex CLI. The invocation loaded the expected package version and left the project unchanged.

Preserve every bundled folder, including `references/`, `scripts/` and `toolkit/`, plus `LICENSE` and all notices. Copying only `SKILL.md` omits required resources. Preserve any existing `uicbins` folder before replacing it.

For a personal installation, Codex also uses `$CODEX_HOME/skills` (normally `~/.codex/skills`); the release evaluation tested the project-local route above. The source folder is [skills/uicbins](../../skills/uicbins) in this repository. Other skill-capable hosts may support this format, but their discovery and execution have not been verified here.

## Try it

```text
Use $uicbins to build a responsive landing page for my studio.
Our primary action is requesting a consultation. Use the supplied copy
and keep the booking flow a clearly labelled local demo until an endpoint
is provided. Include keyboard access and reduced-motion behaviour.
```

For a reference-led build, add:

```text
Use https://example.com as the reference website. Adapt its hierarchy
and interaction patterns to this brief while keeping our content and brand.
```

Replace the example URL with your actual reference. Screenshot-only input is not accepted by the live-reference module. The agent may capture the site itself as evidence. An inaccessible site is reported as a limitation, not reconstructed from guesses.

## Requirements and boundaries

The host must provide file editing, Node.js for the bundled check scripts (tested with 24.14.0), and a working Chromium/browser automation route to complete implementation and rendered QA. Use an existing compatible environment; the package does not install these dependencies. The bundled inspector also needs a working Chromium executable (the tested Windows environment supplies it through `CHROME_PATH`). A host with delegated review can run the fresh adversarial reviewer; otherwise the agent must label its challenge as same-agent review. The skill installs no tools and bundles no protected controller. Without the needed tools, the agent should report partial verification. It should preserve project constraints and avoid inventing product facts, customer proof, pricing or backend behaviour.

For commercial pages, it recommends discoverable cost information and asks about undecided pricing treatment. It respects intentional omission; pricing and sales CTAs are not universal requirements for every page.

## Evaluation

Release validation checks package structure separately from generated-site behaviour. A small sample cannot establish universal design quality, accessibility conformance, conversion uplift or superiority over other libraries. Consult [the evaluation summary](EVALUATION.md) for the tested version, model, tasks and unresolved limitations.

## Licence and attribution

Original material: MIT, copyright 2026 Ledio Zefi. Preserve the included licence and notices. Third-party assets and runtime libraries retain their own terms. UICBINS-Pro is a separate package and is not included in this standalone distribution.
