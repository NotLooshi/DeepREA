# DeepREA 0.2.3: preserve a report before final delivery

## Decision and scope

A prior 20-minute investigation ended with implementation and checks but no requested report. This release promotes the already evaluated completion-only candidate. It adds no executable behavior, dependency, schema, MCP, routing merge or host controller. Publication does not activate it locally. Rollback: install the preserved v0.2.1 tag through the host's supported mechanism.

## Source-to-rule map

- Local completion evaluation: saving a partial report with the first runnable implementation was observed; this supports the early-persistence rule.
- [Anthropic: effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents): incremental work and persistent progress artifacts support continuity. This corroborates the approach; it is not a DeepREA timeout trial.
- [Anthropic: effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents): structured notes preserve state outside the context window. This supports maintaining concise evidence and gaps, not adding a large process framework.
- [Python subprocess documentation](https://docs.python.org/3/library/subprocess.html#subprocess.Popen.communicate): a communicate timeout alone does not kill its child. Actual command termination requires implementation in the runner; this skill hotfix supplies no such enforcement.

Web sources inspected 2026-10-26. The exact instruction patch was evaluated before this corroborating web review; these sources did not retroactively define its tests. No copied article text is bundled.

## Observed matched comparison

One fresh attempt per condition, known jo 1.9 Windows binary, requested gpt-6-astra/ultra, Codex CLI 0.156.1, isolated profiles without Cerebellum, same 1,200-second limit and grading panels.

| Panel | 0.2.1 baseline | 0.2.3 candidate |
|---|---:|---:|
| Original |56/56|56/56|
| Regression |45/46|45/46|
| Variants |13/13|13/13|
| Earlier exact |20/20|20/20|
| Previously withheld, now known |24/24|24/24|
| Elapsed seconds |1195.080|1136.197|

Both completed with reports and final JSON. Candidate gained file-missing-mixed-warning and lost number-0 (numeric rounding). Equal totals do not establish case-by-case preservation. One stochastic pair on one known target cannot establish causal accuracy or speed improvement.

Candidate trace item_25 saved code and a partial report together before smoke testing. A persisted snapshot recorded verification as pending. Final reporting refreshed the evidence against final bytes. Intermediate checkpoint refresh and pre-finish deadline/reserve calculation were not observed. Neither run timed out, and no forced interruption was tested. Report survival after a future interruption is therefore an inference, not a verified recovery guarantee.

## Evidence boundary and checks

The full traces, artifacts and independent audit remain in the private development workspace. The public completion summary is a reported result, not a public reproduction of those investigations. Existing evidence/ files and verify_release.py retain the older REA-versus-DeepREA comparison and must not be read as hotfix results.

The hotfix package is byte-identical to the evaluated 18-file candidate. Entry description/body, specialist guidance, scripts, schemas, licences and notices are preserved. This is non-executable instruction maintenance with content, identity, structural and regression checks; a historical timeout is not claimed as behavioral test-first RED.

Unverified: repeated timeout frequency, forced-interruption recovery, unavailable-clock behavior, natural activation/non-activation, all specialist branches, other targets and host platforms. No overall performance uplift or guaranteed deadline compliance is claimed.
