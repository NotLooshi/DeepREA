# Matched skill benchmarks

## Freeze the experiment

Create a run manifest before execution. Include:

- Task family, exact source/resource snapshots and hashes, host and tool versions.
- Concrete user outcome, required specialist cases, constraints and adverse paths.
- Candidate arms, current arrangement and relevant control; explain omitted controls.
- Exact tasks, fixtures, check commands or human rubric, critical gates, paired comparison rule and permitted tradeoffs.
- Model/settings, tool access, isolation method, trial/order assignment, repetitions, per-run budget and stop rule.
- Held-out tasks, who can see acceptance checks, and limits on adaptation.

Derive checks from user requirements and original capability contracts, before inspecting candidate results. Verify that the harness detects a known-bad fixture and accepts a known-good one where feasible. A broken runner is an infrastructure error, not evidence against a skill. When production behavior is implemented, satisfy the governing RED/GREEN rules separately.

## Task coverage

Include realistic typical tasks, meaningful edge/adverse cases, specialist requirements, and near-miss requests where the skill should not activate. For conflict investigations, add a request where both competing skills currently trigger and verify which instructions are actually loaded. Separate explicit-invocation performance from automatic-selection performance.

Use tasks drawn from completed work where permitted, with private data removed. Label invented fixtures. Start with a bounded pilot across at least three distinct applicable scenarios when resources permit. Use repeated runs on decision-driving tasks to expose variability; two runs are only a variability probe, not statistical confidence. If the budget cannot support adequate coverage, deliver pilot evidence and defer irreversible conclusions.

A held-out task must not have informed revisions. Once inspected or used to repair a candidate, it becomes development evidence; use a fresh holdout for the next promotion decision. Preserve earlier results rather than replacing failed trials.

## Execute fairly

Use fresh workspaces and contexts, the same starting state and equivalent access. Run sequentially if parallelism is unavailable. Alternate or randomize arm order and record it. Each arm receives only its assigned skill snapshot and shared host instructions; a globally preloaded competing skill contaminates the comparison. Record unavoidable contamination and limit conclusions accordingly.

Keep model, reasoning effort, budget and fixtures constant unless their variation is the explicit experiment. Record timeouts under the frozen budget as incomplete task outcomes, distinguishing external service failure from budget exhaustion. Apply a predefined retry rule symmetrically; never discard inconvenient results or retry only the losing arm.

For packages that depend on different tools, first assess compatibility. Missing mandatory tools means that arm is unavailable in that environment, not universally inferior. An adaptation is a different arm with its changes disclosed. Include all required supporting files and legitimate dependencies, not just the entrypoint.

## Observe and judge

For every task × arm × repetition retain:

| Field | Evidence |
|---|---|
| Identity | Task ID, arm ID, source hash, repetition, settings and start/end timestamps |
| Execution | Transcript or tool log, output artifacts, actual command results |
| Correctness | Each frozen contract outcome: pass, fail, unverified, or inapplicable with reason |
| Safety/authority | Observed prohibited side effects or boundary breaches, not merely reassuring prose |
| Routing | Skills actually loaded where observable; otherwise unknown |
| Quality | Blind artifact rubric where subjective judgment matters; reviewer and disagreements |
| Efficiency | Measured tokens, wall time and external cost, or explicit unknowns |
| Exceptions | Infrastructure errors, contamination, retries and budget exhaustion |

Blind subjective reviewers to candidate identity and claimed scores when possible. Use independent review when available and authorized; label same-agent review as such. An LLM preference is a bounded judgment, not a user study. Skill self-reports cannot establish command execution or authorization.

Compare paired tasks, showing failures by case and required specialty. Keep quality and efficiency separate unless the user supplied tradeoff weights. Do not invent a universal weighted leaderboard. Report sample size and variability; without enough observations, avoid confidence intervals or general superiority claims. A critical failed requirement remains visible even if most tasks pass.

## Decision rule and stopping

Before trials, specify what improvement would justify migration and which regressions forbid it. Prefer clear contract dominance with preserved required coverage; where tradeoffs remain, keep conditional specialists or present the concrete user choice. An inconclusive tie does not justify retirement; practical equivalence demonstrated under the frozen adequate-coverage rule permits reversible selection of the smaller/simpler portfolio. Read [tournament.md](tournament.md) for output-based tasks, equivalence and family progression. Exact duplicates may use equivalence, dependency and activation checks instead of pretending behavioral trials can distinguish identical instructions.

Stop this comparison at its declared budget, adequate evidence for the next reversible batch, or a discovered blocker. A stopped family is not the end of a whole-library run: update its status and continue other actionable families within the overall budget. Log untested families and the cheapest next check likely to change the decision. Rerun affected checks after any source, routing, dependency or host change; old evidence is not automatically transferable.
