# Evaluation and limitations

This is a summary of local development observations, not an independently reproduced benchmark. Raw session logs and private development history are not published in this package. Counts below distinguish model trials from assertions within one task.

## Main development batch

Six tasks were run once each under three conditions: default host instructions, an eight-file ECC instruction pack, and standalone Cerebellum. Tasks covered cache repair, recursive merge, atomic inventory, revision-aware ledger reconciliation, robust portfolio selection and skill/tool recovery with authority constraints: 18 model trials total.

All three arms passed the six initial artifact grades after symmetric scoring corrections. Supplementary inventory probes then exposed an exception-class defect in ECC and Cerebellum; default passed those probes. These later checks were exploratory, and the original pass counts do not establish full correctness.

On the three coding tasks, observed test-first execution was 0/3 for default, 3/3 for ECC and 3/3 for Cerebellum. On the workflow task, Cerebellum read no irrelevant skill bodies; the other arms read two each, without invoking their workflows. These are bounded process observations. Cerebellum produced 129 implementation lines across the three code tasks versus 123 and 124, so no smaller-code advantage was established.

The ECC pack was pinned to commit `90606c8315ee09cafc303515c5f33024db6b9882` of `affaan-m/ECC`. It is not a test of the complete installed product. Earlier main trials did not record the resolved model identity, limiting reproducibility and comparisons with later explicitly pinned runs.

## Follow-up work

Two fresh diagnostic trials tested one original/candidate pair; both failed the supplementary inventory checks, and the candidate was rejected. Evaluator repairs subsequently caught flawed reference implementations, enforced supplied-test preservation and accepted equivalent valid skill references. Five evaluator regression-test methods and ten additional controls passed. Regrading the 20 historical submissions with the strengthened evaluator yielded 16 passes; this is a corrected development view, not new model trials.

A later six-attempt experiment explicitly requested `gpt-6-astra`: two inventory repetitions per original/candidate arm plus one merge attempt per arm. Inventory results were original 0/2 and candidate 1/2 under the strengthened checks. A further exploratory sequence-protocol probe failed all four inventory submissions, including the passing candidate. The candidate passed merge; the original merge attempt stopped because the selected model was at capacity and is excluded from comparison. The candidate did not meet the predeclared adoption bar and is not included in this release.

## What was and was not verified

The released prompt's SHA-256 is `dcc4bec7433b2e2ba3489bf2754c458c25262d5cd84f2e1786f57cf9b69b3893`. Seven static standalone checks passed before publication: rule preservation, source-context removal, absence of companion-file requirements and internal reference consistency. Skill-body equality is checked separately during packaging. Static checks establish document properties, not runtime compliance.

Trials used additive instruction overlays on one Windows Codex host. Tasks were development material; repeated or supplementary checks are not independent unseen tasks. There is no broad held-out confirmation, cross-model replication, independent human usability review or full-product competitor comparison. Timing was uncontrolled on a shared machine. Same-user filesystem separation was not a security boundary. The optional skill's activation and behavior across hosts have not been independently benchmarked.

The release standard is a useful standalone operating method with disclosed limitations, not competitor superiority. Continue using real task outcomes to decide whether future changes are worth keeping.
