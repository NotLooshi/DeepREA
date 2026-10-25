# Champions and comparison history

Keep a durable record only in user-authorized storage outside active skill roots. Reuse an existing project record if present. A library-maintenance request permits its relevant local evidence files; uploading them to a remote service requires that scope. Do not put private task inputs, credentials or user feedback into the distributable skill package. Without durable storage, return the record and label future recall unavailable.

## Identity and record shape

Use a human-readable Markdown table or structured JSON/YAML, whichever fits the existing project. The following fields define the contract; they are not fabricated records to populate with guessed results.

| Record | Required fields |
|---|---|
| Family | Stable family ID, job/outcome, candidates, mandatory capabilities, tested marginal value of specialists, queue status and next action |
| Retained portfolio | Source URL/local origin, immutable revision, complete package/resource digest, local modifications, active path, tool dependencies, verification status |
| Comparison context | Champion and challenger identities, task-suite/fixture revision, rubric and threshold revision, model/settings, host/tool/dependency versions, isolation constraints, budget and repeat policy |
| Trial | Unique run ID, timestamps, raw outputs/check links, each mandatory outcome, observed measurements or unknowns, retries and limitations |
| Decision | Retain, proposed promotion, verified promotion, conditional specialist, defer, or rolled back; rationale and evidence; prior champion |
| Activation | Exact mutation and authorization, observed effective catalog/workflow checks, rollback snapshot and verification result |
| Revisit | Material change that invalidates reuse, failed infrastructure retry condition, next bounded action |

Keep one current portfolio pointer per family and append immutable trial/decision history. A pointer is an index, not proof. Existing installed skills begin as incumbents with unverified performance unless evidence actually supports champion status. Never label an incumbent verified merely because the user calls it a trophy.

## Reuse and invalidation

Skip a redundant losing or tied comparison only if both source packages, linked resources, relevant dependencies, task requirements, rubric, model/settings, environment and evaluation constraints still match the recorded comparison context, and evidence is accessible and adequate. A newer repository commit with identical relevant package content can be recorded as unchanged content after verification; a timestamp alone is insufficient.

A new challenger version, changed incumbent, new required specialty, model/tool change, failed production workflow or revised benchmark can justify a new comparison. Preserve the earlier result and record why it no longer answers today's question. An infrastructure failure is deferred with a concrete retry condition, not a permanent blacklist. No result expires into automatic installation.

## Promotion transaction

1. Record the benchmark outcome as a proposed promotion. Keep the current portfolio pointer unchanged.
2. Stage and apply the authorized reversible batch through the consolidation process. Preserve the exact old source and dependencies required for restoration.
3. Change the portfolio pointer only after observed activation and workflow checks pass. Link those checks and the old pointer in the promotion record.
4. On regression, restore and verify the prior arrangement; append the rollback outcome. If restoration cannot be verified, mark current activation unknown and stop further promotion.

If execution stops between steps, read the recorded intended mutation and compare snapshot, intended post-change state and actual host state before resuming. Preserve subsequent user edits and stop conflicting restoration as described in [consolidation.md](consolidation.md). Never infer successful activation from a pending promotion record. Keep a proposed winner staged when host catalog verification is unavailable.

## Efficient maintenance

At the end of each family batch, update the overall family queue and summarize what was searched, tested, skipped as unchanged, promoted, or deferred. State unexamined coverage and the next retest trigger. Continue the next actionable family within the overall authorized budget. A single completed family is not a completed library; unresolved or untested families require an explicit partial checkpoint and resumption record. Recurring checks need a separately authorized host scheduler. Instruction files and a history table alone do not run a background maintainer.
