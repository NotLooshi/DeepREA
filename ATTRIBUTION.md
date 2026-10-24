# Attribution and source map

## REA

REA by morluto: https://github.com/morluto/rea

Pinned source revision: `2c4338db1fdb7773e05376301c558cff2a0b4b80`, authored skill version 42. The original entry is retained as `deeprea/rea-baseline.md`; its six specialist references are retained under `deeprea/references/`. The original MIT notice is preserved in `deeprea/LICENSE` and the repository LICENSE. New DeepREA material is distributed under the same MIT terms. No endorsement by REA's author is implied.

## DeepREA additions

| Source of the requirement | Destination | Scope |
|---|---|---|
| REA course concepts and comparison against actual REA guidance | investigation.md, orchestration.md, reconstruction.md | Original procedural synthesis: provenance, bounded inquiry, handoffs and finite verification |
| Executed comparator failure experiments | scripts/qc.py, quality-control.md, assets/qc-contract* | Real execution, strict JSON-lines contracts, comparator controls and stale-evidence detection |
| Observed native reconstruction regressions | runtime-boundaries.md and reconstruction.md | Launcher/runtime interactions and final verification discipline |

The REA course at https://reacourse.xyz was a learning source. The course itself, captured lessons, exercises, answer keys, screenshots and detailed course notes are not distributed here. Its content is not assigned the repository's MIT licence. General procedures are expressed in newly authored guidance; a phrase-overlap check is only supporting evidence and cannot establish legal clearance.

Anthropic's skill-creator workflow informed development and evaluation: https://github.com/anthropics/skills/tree/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/skill-creator. Its source/tooling is not bundled in this public release. Anthropic is not an endorser.

The benchmark target was jo 1.9 by Jan-Piet Mens and contributors: https://github.com/jpmens/jo/tree/1.9. No jo executable, source or decompiled source is bundled. Recorded interface inputs and outputs are retained as comparison evidence; the target's own licence remains separate.
