# Bounded work and reliable handoffs

Use a single investigator for a small dependent trace. Parallel work helps when separate questions can consume stable evidence and return independently checkable findings. Tool availability, latency and shared mutable state can make sequential work better; do not assume agents exist or that one function per agent is always sensible.

## Maintain one current investigation state

Track the objective and task revision; artifact/provider/profile identities; accepted findings and provisional names/types; unresolved questions; and the next discriminating actions. A short table or existing report is sufficient. Reuse evidence only while its identity and relevant assumptions still match. Keep prior versions when a consequential conclusion changes.

## Dispatch a bounded question

Give a worker the current revision and exact evidence paths/IDs, its question, relevant accepted hypotheses, allowed read/write/session boundaries, acceptance check, budget and stop condition. Supply only context needed for that question. The return should include source identities, observations, inferences, unknowns, proposed changes and anything not completed. Missing results remain incomplete; a worker's success marker is not verification.

Assign a single owner to a shared mutable native session, active-target switch, annotation database or naming registry. Parallel workers can read immutable exports or use separate verified sessions. A declared dependency list that omits shared state does not make operations independent. Serialize conflicting mutations and verify target identity after switches.

## Merge evidence, not votes

Check returned task/artifact/profile identities before accepting findings. Quarantine stale results as historical evidence; do not relabel them current. Accept supported observations separately from a worker's proposed semantic interpretation. Preserve contradictory sources and compare their scope, object provenance, widths and assumptions.

Choose the smallest discriminating read or experiment. Until it resolves the conflict, retain separate hypotheses or structural names. Confidence scores and majority agreement cannot supply missing evidence. Stable names are useful, but an evidence-supported correction should update dependent records and invalidate affected handoffs rather than preserve an error forever.

## Progress and stop

Continue independent useful work while a dependent question is blocked. Requeue obstructed questions only when evidence or capability changes; record the change and renewed bound. If tools or workers are unavailable, perform the answerable portion sequentially and disclose the limit. Stop when the user's question is answered or remaining uncertainty cannot be reduced within the permitted scope. Report partial coverage instead of declaring every queue item complete.
