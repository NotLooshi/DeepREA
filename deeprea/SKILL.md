---
name: deeprea
description: Investigate shipped applications, binaries, packages or recorded runtime evidence with REA; recover evidence-backed behavior and guide a reconstruction. Use for reverse engineering, feature traces, uncertain decompilation, multi-part investigations and original-versus-rebuild checks. Skip ordinary architecture analysis when complete source already answers the question.
metadata:
  version: "0.2.1-experimental"
  upstream-rea-skill: "42"
---

# DeepREA

Recover the behavior the user needs, with enough evidence to act on it. This is a standalone skill: its REA routing and specialist guidance are bundled. It needs no Cerebellum skill. Installing instructions does not install REA, engines or execution permissions.

## Start with the question and available evidence

Identify the supplied target, requested outcome and permitted actions. An answer, a behavior specification and a working reconstruction are different deliverables. Reuse identities and evidence already established in the task; ask only for a consequential missing choice.

Read [bundled REA guidance](rea-baseline.md) for applicability, connection, target routing and evidence handling. Its original specialist references remain alongside this file's references. Use the current host's actual tool list and schemas; repository documentation can describe a newer release. Diagnose an observed blocker, then continue useful supported work. Never infer tool execution from a workflow prompt or a planned command.

For a tiny target, a direct trace and a few discriminating checks may complete the job. Do not require agents, a project-wide inventory, installation or a large report. For broader work, maintain a compact list of questions, evidence, unresolved decisions and next checks.

## Choose the procedure that changes the next decision

- For unfamiliar code, uncertain pseudocode, naming/types, obfuscation, or an incomplete feature chain, read [investigation](references/investigation.md). Preserve raw evidence and connect each additional read to a specific uncertainty.
- When multiple questions can progress independently, work crosses context boundaries, or findings conflict, read [orchestration](references/orchestration.md). Use parallel workers only if the host actually provides them and the work benefits.
- When producing a behavior specification, rebuilding an application, or assessing compatibility, read [reconstruction](references/reconstruction.md). Separate observed behavior, inferred contracts and chosen design; verify against the original when available and authorized.
- For a native CLI reconstruction, also read [runtime boundaries](references/runtime-boundaries.md). Test how the launcher, OS runtime and shared input streams affect the application's behavior before substituting convenient language-library behavior.

For a JSON-lines CLI reconstruction that fits the bundled runner, use [executable QC](references/quality-control.md) before claiming its finite comparison passed. The runner checks the contract, challenges its comparator, executes both programs, and recomputes release evidence against current artifact identities. A model-written status cannot replace those checks. For other interfaces, choose suitable observable checks and explicitly identify what this runner did not verify; do not force an incompatible target into its format.

These branches compose; they are not mandatory phases. Finish the current question when its evidence is sufficient for the requested decision. Preserve material unknowns without expanding into unrelated features.

## Finish with a scoped result

Return the requested artifact or answer, its supporting sources/runs, the important remaining uncertainties and the next action only when one is required. Mark each requested outcome answered, partial or unverified. Do not turn static evidence into an execution claim, finite tests into universal equivalence, or a fresh context into an enforced access barrier. Preserve originals and close owned native sessions as the bundled guidance requires.

If Cerebellum is separately loaded, let it govern its general planning, test-first and maintenance requirements under the host's instruction hierarchy. Use this skill for target-specific decisions; reuse the same records rather than creating duplicate plans or approval gates. DeepREA does not grant higher instruction authority to itself or a companion file.
