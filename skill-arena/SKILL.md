---
name: skill-arena
description: Optimize a skill library by grouping competing skills by job, discovering contenders, benchmarking real outputs, and retaining the smallest proven portfolio family by family. Use for skill cleanup, comparative selection and library optimization, not ordinary task execution or general file cleanup.
---

# Skill Arena

Maintain the smallest useful skill set supported by observed task performance. A winner is scoped to a task family and environment; similar names, shorter prompts, popularity, and confident self-reviews do not establish superiority.

Use a library tournament: map task families → expand each candidate pool → benchmark real outputs → select the smallest adequate portfolio → consolidate → advance to the next family. A champion is scoped to a task family, not an eternal or universal winner. Read [references/tournament.md](references/tournament.md) before planning a library cleanup or optimization.

For cleanup or maintenance, traverse the entire scoped family queue in bounded batches. Exact-duplicate housekeeping is optional preparation, not the main objective. Discover contenders before selecting family winners; temporary candidate growth is intentional. One family or easy smoke test does not complete library optimization. Explicit audit-only, cleanup-only, offline or local-only requests narrow the default; a sandbox request keeps all mutations and promotion inside that sandbox.

“Cleanup-only” means the user explicitly limits the run to housekeeping or excludes discovery/optimization. The ordinary request “clean up my skills” still invokes the full family tournament.

## 1. Establish the collection and authority

Identify the requested roots, host, current discovery mechanism, and whether the user requested an audit, benchmark, or actual consolidation. Creating this skill does not authorize cleaning the collection. Audit/compare requests leave active skills unchanged. A cleanup request authorizes reversible consolidation within its stated scope once the evidence gates below pass; reuse that authorization rather than asking again. Permanent deletion requires explicit approval.

Set a bounded scope and budget before running comparisons: task families, candidates, trials, time/tool budget, external-cost authority, and stop conditions. Inventory the whole scoped collection into a resumable family queue, then start with a high-overlap family. Continue to subsequent families within the authorized overall budget; unexamined skills remain queued, not silently out of scope. Use existing tools; do not install an evaluation framework merely to make an audit possible.

Keep a run directory outside all active skill roots. Record exact source paths, versions or content hashes, activation rules, provenance/license, required tools, dependencies and callers, linked resources, and accessible coverage. Record identical copies separately from aliases to the same source. Distinguish installed from currently discoverable: a cached plugin directory alone does not prove activation. Never copy credentials into the evidence bundle.

For cleanup or optimization, back up every complete skills root in the authorized scope before discovery, benchmarking or changes. Use the high-compression, verified ZIP procedure in [references/consolidation.md](references/consolidation.md); a sandbox run backs up its copied roots. Keep this private recovery archive outside all skill roots and separate from shareable evidence. Do not silently omit files or proceed with cleanup after a backup failure. Read-only audits do not require creating an archive unless requested.

Completion: a source manifest, scope, permitted actions, and bounded next family are recorded; cleanup runs also have a verified full-root backup and receipt. When discovery cannot be inspected, label it unknown.

## 2. Find actual overlap

Use names/descriptions and hashes to shortlist; read the full instructions and reachable task-relevant resources before proposing replacement. Compare:

- Trigger overlap: do the skills compete for the same user request?
- Contract overlap: do they promise the same outcome, on the same platform and inputs?
- Instruction conflict: quote the incompatible requirements and conditions under which both apply.
- Unique coverage: specialist cases, tools, templates, examples, resources, permission rules and dependencies.

Classify each relationship as exact duplicate, competing alternatives, complementary stages, conditional alternatives, or unrelated. A build skill and its review skill usually serve distinct stages; tool-specific skills may share an outcome without being interchangeable. Duplicate text does not make either activation path safe to remove until callers are traced.

Build a job-to-candidate map and a capability-to-source map. Different wording, style, file names or methodology do not establish a separate useful specialty. Put claimed unique benefits into actual task tests; preserve required contracts, negative triggers and dependencies. Keep additional specialists only for demonstrated necessary coverage or material performance advantage. Narrower routing is justified by that evidence, not by a desire to retain every alternative.

Completion: each proposed comparison has a shared contract and a preserved-specialist checklist. Semantic similarity is only a screening result.

## Continue from cleanup into discovery

For each family before selecting winners, and for finding better skills, checking outdated skills, or refreshing the library, read [references/discovery.md](references/discovery.md). Use Vercel's Skills CLI or its published directory as an optional discovery source; no separate `find-skills` installation is required. Search and update availability identify candidates, not winners. Only an explicit narrower scope such as local-only cleanup skips online discovery; do not silently infer that exception from the word cleanup.

Apply only already-supported reversible cleanup before discovery, using section 5's controls. Conflicting variants requiring task evidence remain unchanged until benchmarked. Cleanup blocked by a dependency does not block independent read-only discovery. Allocate the pass budget across discovery and actual task execution before polishing the cleanup report. If execution, network, authority or budget prevents a phase, report that phase as blocked or partial with its concrete reason; never report the full pass complete from a duplicate-removal smoke test.

Before downloading candidates, load the task family's champion and previous trials from the authorized record described in [references/champions.md](references/champions.md). Keep an untested incumbent labeled unverified. Bound searches and challenger count, stage pinned packages outside discovery, inspect their contents, and test without activating them globally. Treat an updated champion as a challenger too. Never bulk-update active skills as the discovery step.

Completion: a bounded shortlist with source revisions, compatibility, inspection results and reasons to test or skip. Unknown freshness and unavailable search remain explicit; continue useful local work.

## 3. Benchmark before choosing

Read [references/benchmark.md](references/benchmark.md) before designing or executing trials. Freeze tasks, checks and decision rules before candidate outputs. Compare the current arrangement, relevant alternatives, and a no-added-skill baseline when feasible. Test co-activation when the alleged problem is conflict, and test the proposed routing or merged package as its own candidate.

Use fresh isolated runs with matched model/settings, inputs, tools and budgets. Use independent agents only if authorized and supported; give them the frozen request and source snapshot without intended winners or other outputs. If isolation or behavioral execution is unavailable, produce a static audit and runnable test plan; mark performance UNVERIFIED and retain existing activation.

Judge artifacts and executed checks, not assertions of compliance. Retain failures, incomplete trials, missing measurements and contrary evidence. If candidates need materially different tools, report native-workflow results separately from a common-tool adaptation.

Completion: a result matrix links each finding to raw outputs/checks, execution conditions and limitations. A small pilot can prioritize further trials; it cannot establish a universal winner.

## 4. Select the smallest adequate portfolio

Apply frozen mandatory requirements first. A permission violation, lost required specialist behavior, or failed critical contract cannot be offset by speed, brevity or average scores. Among eligible candidates compare paired task outcomes, then observed cost and maintenance burden. Token counts and latency are unknown unless measured; file size is only a labeled proxy.

Use these dispositions with supporting evidence:

| Disposition | Condition |
|---|---|
| Keep | Selected champion or tested specialist supplying necessary coverage or material advantage |
| Narrow routing | Useful skills collide only because trigger descriptions are too broad |
| Retire duplicate | Redundant source and activation path; dependencies and coverage preserved |
| Replace | Alternative meets required coverage and wins under the frozen comparison rules |
| Merge candidate | Complementary content warrants one entrypoint; merged artifact must be evaluated anew |
| Defer | Inconclusive tie, insufficient trials, unavailable checks, incompatible test conditions, or unresolved regression |

Distinguish demonstrated practical equivalence from an inconclusive tie. Under the frozen equivalence rule and adequate representative tests, retain the smaller/simpler adequate portfolio and retire redundant alternatives reversibly. All-perfect scores on trivial tasks are inconclusive, not equivalence evidence. Every additional retained specialist needs tested marginal value. Never force a winner from insufficient evidence to hit a count target. Report coverage and unresolved conflicts alongside reduction; preserve authorship, licenses and notices.

For champion–challenger runs, rerun the incumbent and challenger under the same current conditions; historical scores are not a matched control. Freeze the minimum meaningful improvement and mandatory non-regression checks before trials. A challenger may join a conditional portfolio only when actual tasks demonstrate that necessary specialty or material advantage; a claimed extra instruction is insufficient. A benchmark winner remains a proposed winner until activation verification succeeds.

Completion: each proposed change has an exact source-to-destination map, evidence, preserved capabilities, risks, consumer updates and rollback. Evidence applies only to tested revisions and conditions.

## 5. Consolidate and verify

Read [references/consolidation.md](references/consolidation.md) before changing active material. Prepare the complete candidate and reviewable diff outside discovery. Follow applicable test-first requirements for executable helpers or changed production behavior; document consistency checks do not substitute for behavioral tests.

When the requested scope includes cleanup and all gates pass, apply the smallest reversible batch using the host's supported mechanism. If approval is still required, present the exact batch, evidence and rollback first, citing the reason approval is needed. Avoid editing generated plugin caches; prefer supported configuration or package management. If the only supported operation also removes unrelated skills/tools, stop that mutation and report the wider effect.

Verify the effective catalog after reload in a fresh host context, activation/non-activation cases, affected callers and representative workflows. A moved directory, changed file, or successful validator alone does not prove a skill is disabled. If host verification is unavailable, leave originals active and report a staged proposal. Restore the prior configuration if an applied batch fails its checks; report any unverified recovery honestly.

Finish with measured before/after active counts when available, dispositions by family, evidence links, remaining gaps and rollback location. Always report the backup's absolute path, covered roots, measured source/archive sizes, compression method and restore-verification result, including partial or failed runs. Say "all done" only when the requested scope is complete. Mark outcomes separately: verified consolidation, staged proposal, or unresolved comparison. After each family, update the queue and proceed to the next actionable family. Stop when the scoped queue is resolved or an overall budget/authority/capability boundary requires a partial checkpoint. No background curation exists without a separately authorized scheduler.

After a discovery/comparison run, update the authorized [champion record](references/champions.md) with source identities, decisions, raw evidence links and retest conditions. Persist losses and ties as well as wins; retain the previous champion until verified promotion. Skip redundant comparisons only while the full comparison context still matches. If durable storage is unavailable, provide an exportable record and disclose that future recall is not established.

The completion report must separately account for cleanup, actual searches, staged source revisions, executed task trials, promotion/retention and saved history. A family may correctly retain its incumbent, but the whole-library report must account for every queued family and must not confuse “no improvement demonstrated” with “improvement achieved.” If discovery finds only verified identical content or no eligible candidates within budget, document that evidence instead of manufacturing a challenger or meaningless benchmark.
