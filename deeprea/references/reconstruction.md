# From recovered behavior to a checked reconstruction

Use this reference only when the user wants a behavior specification, rebuild or compatibility assessment. Preserve the upstream distinction between finite `verify_reconstruction` evidence checks and actual execution of arbitrary rebuilt software; a similarly named prompt does not execute a test suite.

## Define the contract

Describe the requested components/state, inputs and defaults, validation/errors, outputs and side effects, persisted/wire formats and ordering/lifecycle rules. Include concrete normal, boundary and invalid cases. Link each consequential rule to its source and evidence status. Source declarations, observed runs and intentional design choices must remain distinguishable.

Inspect effective configuration rather than copying fallback constants blindly. Specify which behavior unknowns block implementation, which can remain outside the agreed scope, and which require an explicit design decision. Do not invent permissive parsing or duplicate/order policies because an output is missing. A heading-filled spec is not necessarily implementable.

## Transfer only the intended inputs

If separate analyst/builder work is requested, keep raw decompilation, internal names/addresses and unrelated authored material analyst-side. Give the builder the behavior contract, approved dependencies/assets and concrete cases; retain an analyst-side source-to-contract map. Public format magic values, wire offsets and required error strings can be legitimate compatibility facts; do not delete them merely because they resemble implementation constants.

Record the input manifest and how a fresh builder context was actually created. Different folders or removed REA tools do not prevent shell reads. If enforced separation is required, verify the actual host filesystem/tool boundary before claiming it. Otherwise describe the separation as advisory. Text scanning can flag suspicious material, not prove independent development or legal compliance. Use original or appropriately licensed assets; do not make legal guarantees.

## Compare observable behavior

Freeze a small representative set before implementing changed behavior. Use an available permitted original or an independently specified oracle. Run the same inputs and relevant state against original and rebuild; capture actual stdout, stderr, exit status, output files and relevant visible effects. Follow applicable test-first requirements; a broken runner, missing credential or timeout is not the intended behavioral RED.

Declare normalizations/tolerances before comparison and justify them from the consumer contract. Case, order, IDs, paths, timestamps, messages and final newlines can be significant. Preserve raw outputs and the first failing comparison. Do not normalize away an unexplained discrepancy.

Record scheduled, completed-pair, passed, failed and unrun counts. Distinguish attempted-but-incomplete from observed mismatch. Report both completed-case coverage and the remaining schedule; never remove skips to improve the apparent result. A fixed case count or a passing finite tool claim does not establish universal equivalence.

For supported JSON-lines command-line programs, follow [executable QC](quality-control.md) and use the bundled runner rather than hand-writing another pass/fail comparator. Freeze the input/count contract, keep the runner's actual evidence, and rerun after relevant changes. The release check is required for this supported comparison claim; it is not an installation, publication or permission gate. A tool failure leaves the check unverified and does not authorize broadening host permissions.

For each divergence, discriminate implementation, specification, oracle, environment, nondeterminism and intentional differences. Return an uncertain inferred rule to investigation; repair a demonstrated implementation defect within existing authority, retain its failure and rerun the same check. Revisit affected cases after a change without silently rewriting expected outputs.

For native command-line targets, include the relevant [runtime-boundary interactions](runtime-boundaries.md), not just isolated option/value examples. A known failure becomes a regression case; it does not remain a held-out test after the investigator has seen it. Check a neighboring variation against the original before treating a repair as a general rule.

Before the investigation deadline, stop adding exploratory work when it would displace verification of the current artifact. Preserve a runnable version, complete a bounded final subprocess comparison, and report unrun checks explicitly. Avoid editing the candidate while that final comparison runs; later edits invalidate its artifact identity.

## Deliver within scope

Package only the requested interfaces and artifacts. Reuse one implementation across CLI/UI/MCP when those interfaces are requested, rather than adding an unsolicited server. Include measured finite coverage, unresolved behavior, intentional differences, provenance and a practical smoke path. Publication, installation and target execution require their actual task authority; this procedure adds none. Preserve originals and stop when the requested deliverable and checks are satisfied.
