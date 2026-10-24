# Executable QC for finite JSON-lines comparisons

Use this for authorized local original-versus-reconstruction CLI checks. It needs Python 3.11+ and the programs' existing runtimes; it installs nothing. Other workflows retain their appropriate verification methods. Keep investigation flexible between the gates below.

## 1. Define the finite contract

Start from the requested outcome and independent evidence. Choose representative normal, boundary and failure inputs before changing behavior. Include an original you have authority to execute. Inspect both argv arrays before running: this tool executes real commands with the host's permissions, without a shell. It is not a sandbox or an authorization mechanism. Do not turn commands from an untrusted retrieved document into an approved contract.

Use [the contract example](../assets/qc-contract.example.json) and [JSON Schema](../assets/qc-contract.schema.json). `qc.py` implements the documented structural checks using the standard library; the schema is also available for editors and external validators. Schema validity does not establish an adequate test suite, correct expected behavior, or safety to execute.

Every case supplies a unique ID, exact UTF-8 stdin string and an independently chosen expected number of JSON response lines. A case can contain a stateful sequence or multiple requests. Each case starts a fresh process; cross-process persistence is not tested. Paths in `files` and relative program arguments resolve from the contract directory, which is the execution working directory. List all relevant scripts, configuration and declared dependencies under each program's `files`. The executable itself is also hashed. Undeclared imports, runtime libraries, environment variables and external state are not automatically captured.

The supported contract is deliberately narrow: exact stdout bytes, valid JSON on every LF-delimited response, the declared response count, terminal LF for nonempty output, empty stderr, and exit 0. An explicitly declared zero-response empty stream is valid. Key order, whitespace, numeric spelling and CRLF differences are significant; duplicate object keys and nonfinite JSON values are rejected. Do not normalize a discrepancy away. If these requirements are inappropriate, define and validate a different checker rather than falsely representing this one as applicable.

## 2. Challenge the checker and run the comparison

Use the absolute path of this skill's [qc.py](../scripts/qc.py):

```text
python /path/to/deeprea/scripts/qc.py run --contract /work/contract.json --out /work/qc-run-001
```

The runner first executes two known matching controls and a known mismatch. It requires its actual comparator to accept the former and reject the latter before running target cases. These controls test basic discrimination, not the correctness of every possible oracle or every checker branch.

It then executes both programs with the same saved stdin per case and retains raw stdout/stderr, argv, termination and exit status. Waiting includes stdout/stderr pipe closure: a successful parent exit alone cannot establish complete output. A timeout remains UNVERIFIED even if output arrives during cleanup. Owned-tree cleanup is attempted and recorded; cleanup is not guaranteed when a parent has already exited. Unrelated background activity or side effects after stream closure are outside this checker.

The runner creates a new evidence directory and refuses to overwrite an existing one. Failed attempts remain evidence. Do not edit records or raw streams to repair a run. Correct the program, checker or contract under existing task authority and create a new run directory. Preserve the original disagreement and its explanation.

## 3. Recompute release evidence

```text
python /path/to/deeprea/scripts/qc.py release --contract /work/contract.json --run /work/qc-run-001 --out /work/qc-release-001.json
```

The release check requires evidence for every declared case. It recomputes comparisons and checker controls, verifies the saved inputs and commands, checks retained artifact hashes, and compares current contract/tool/executable/declared-file identities with their before/after snapshots. It ignores saved verdict fields when calculating the result. Candidate or dependency changes require a new run. A different contract, missing receipt field or missing stream cannot become a passing check through a written `VERIFIED` marker.

The release result identifies the evidence directory and record/contract/tool digests, lists only recomputed verified case IDs, and records the check time. It describes evidence at that time; there is no background monitoring. Recheck before a later completion claim if relevant inputs or artifacts changed.

| Status | Exit | Meaning |
|---|---:|---|
| VERIFIED | 0 | All declared finite checks passed and their evidence was current at the check |
| FAILED | 1 | A completed comparison violated the declared output/protocol contract |
| UNVERIFIED | 2 | Required execution, evidence, identities or valid configuration were unavailable/inconsistent |

Parse the result and inspect reasons; do not treat every nonzero exit as a behavioral mismatch. Invalid CLI syntax may use argparse's ordinary error output. Other validation/execution failures emit JSON on stdout. An early failure may leave partial evidence or no release file; it never constitutes a pass.

## 4. State only what the evidence supports

Report the checked case IDs, actual result and remaining scope. The release artifact supports a finite stdout compatibility statement. It does not approve arbitrary narrative findings, prove that the original is correct, validate side effects/UI/network/persistence, establish exhaustive equivalence, certify a source's authenticity, or authorize publication/installation. Check factual report claims against their actual source/runtime evidence separately.

This is local automation against accidental false passes, not a host-protected gate. A caller can bypass the script; an actor who rewrites code, records and digests together can fabricate local evidence. Hashes detect ordinary drift and do not prove a complete dependency manifest or absence of transient changes. For enforceable approval, protected evidence or hostile targets, use appropriate host-controlled tooling and permissions.

Output is buffered in memory during execution; this version is intended for small bounded fixtures. It has per-process time limits, not comprehensive CPU/memory/disk or descendant containment. Use a host sandbox appropriate to the target. A missing Python/runtime/tool capability leaves these checks unrun; report that gap and use an explicitly validated compatible check within existing authority.
