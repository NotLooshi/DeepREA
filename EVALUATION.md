# Evaluation evidence and limitations

The public evidence directory contains the unchanged four-panel input/expected-output set, the original comparator, and both recorded grades. Only the top-level local execution argv was removed from each grade to avoid publishing local paths. Case identities, observed stdout/stderr, exit codes, declared file effects, differences and panel hashes are unchanged.

`verify_release.py` recomputes comparisons from these retained bytes and checks the recorded pass counts. The comparator normalizes CRLF to LF only. These records permit checking the scoring arithmetic and actual mismatches; they do not independently prove the provenance of the original executions.

The private development archive retains full transcripts, frozen inputs, final code, source, tool provisioning and audits. Those are not publicly available in this release. The public package therefore does not provide a complete rerunnable reproduction of the two agent investigations. No public-verifiability claim should exceed this boundary.

## Setup

- One fresh standalone REA v42 run and one fresh standalone DeepREA 0.2.1 experimental run.
- Same known jo 1.9 Windows target, stripped binary SHA-256 `d771e6563f52c28e2e6752dc0288526f09b3edeac06d73ac62f18573b6adb8eb`.
- Same Codex CLI 0.156.1, requested gpt-6-astra/ultra, account/profile, tools and 1,200-second limit; separate empty submission directories.
- No coaching, parent repair or hidden-grade feedback during either attempt. Both skill catalogs omitted Cerebellum.
- REA completed in 1,178.385 seconds; DeepREA in 1,197.497 seconds. Concurrent shared-host execution does not support a clean speed comparison.

## Findings that qualify the result

The known-regression advantage is 46/46 versus 38/46; known variants are 13/13 versus 12/13. Both original and newly authored panels tie. New exact cases are not a new application, and one run does not establish a repeatable performance distribution or isolate which instruction caused the gain.

DeepREA attempted a drive-root-relative missing-file probe outside its allowed workspace. No file contents were returned; the attempt was retained and excluded from later replay. This remained a process failure despite an explicit warning in the skill. Its final report was partial, including two self-selected usage-prefix mismatches excluded from the frozen score.

REA's copied regression snapshot raced with a later passing check; the private raw transcript retains the actual earlier failure. A claim about failed agent startup lacked a corresponding retained tool event and was not counted as verified execution. The transcript review was separate from investigator requests but not blinded to skill labels.

No source/oracle leakage was observed in the audit. Advisory access restrictions and transcript inspection do not establish enforced filesystem containment. Historical authentication failures were excluded from scored attempts and retained privately.

## Unrun for this release

No new paid model investigation, new-target generalization panel, full specialist coverage sweep, hostile-target containment test or cross-host activation sweep was run during packaging. Package checks and QC tests are reported separately from the historical behavioral comparison.

## Reporting hotfix 0.2.3

The results above describe the historical 0.2.1 package. See [the separate hotfix evaluation](HOTFIX-0.2.3.md) for the fresh 0.2.1/0.2.3 comparison and its limitations.
