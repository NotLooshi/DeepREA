# DeepREA

**Understand the behavior. Rebuild it. Check it against the original.**

[Get started](#install-in-codex) · [Measured results](#observed-results) · [Skill source](SKILL.md) · [All skills](../README.md)

You have a shipped application and a specific behavior to recover. DeepREA guides your coding agent from that question through investigation, a behavior specification, and checks against the original.

| Your starting point | The work DeepREA guides |
| --- | --- |
| An app feature without its source | Trace relevant code and runtime evidence |
| Ambiguous decompiled output | Separate observations, hypotheses and unresolved questions |
| A replacement implementation | Check behavior against the original, including runtime edge cases |
| An investigation spanning several sessions | Preserve evidence identities and bounded handoffs |


Evidence-led reverse engineering and reconstruction for coding agents. DeepREA bundles REA's specialist guidance and adds procedures for bounded investigation, evidence reuse, agent handoffs, runtime compatibility and executable checks.

This is an independent adaptation, not an official REA release. It works without Cerebellum. Installing the skill supplies instructions; it does not install REA, analysis engines, Python or a sandbox.

## Install in Codex

Ask Codex's skill installer to install the `deeprea` directory from this repository. Review the files first and keep any existing installation recoverable. With the bundled installer script available, its supported arguments are:

```text
python /path/to/skill-installer/scripts/install-skill-from-github.py --repo NotLooshi/skills --path deeprea --ref v0.2.1
```

The default destination is `$CODEX_HOME/skills/deeprea`, normally `~/.codex/skills/deeprea`. The installer refuses an existing destination. Follow the installed host's reload/discovery instructions, then explicitly invoke:

```text
Use $deeprea to investigate this supplied application. Recover the requested behavior, distinguish observations from hypotheses, and verify the reconstruction against the original within the permitted workspace.
```

Read [the bundled REA connection guidance](references/connection-and-recovery.md) if the task needs REA MCP. Check the tools actually exposed by your host; documented engines are not automatically installed. Python 3.11+ is required only for the bundled JSON-lines QC runner. The native benchmark used Windows, Ghidra and a clean Codex CLI profile; other host/platform workflows have not been established by that experiment.

## What changed

- Explicit evidence identities and uncertainty, with bounded next steps when decompilation or runtime observations are inconclusive.
- Bounded parallel tasks, shared-session ownership and conflict resolution based on evidence.
- A finite JSON-lines comparator that challenges itself and rechecks artifact identities before accepting saved results.
- Native CLI guidance for quoting, wildcards, shared streams, filenames and diagnostics.

The upstream REA entry and six specialist references remain bundled. See [attribution and source mapping](../ATTRIBUTION.md).

## Observed results

One fresh, unaided investigation per skill on the same jo 1.9 Windows binary; same requested model (`gpt-6-astra`, ultra), Codex CLI 0.156.1 and 20-minute limit. No Cerebellum loaded in either condition.

| Panel | REA v42 | DeepREA 0.2.1 |
|---|---:|---:|
| Original cases | 56/56 | 56/56 |
| Known regression cases | 38/46 | 46/46 |
| Known variants | 12/13 | 13/13 |
| Newly authored exact cases | 20/20 | 20/20 |

The observed advantage is on known compatibility regressions. The new cases tie. The target informed skill development, and there is only one attempt per condition: this is not evidence of general superiority. Both finished before the deadline. DeepREA still attempted an out-of-workspace missing-file probe, so its run was not fully scope-compliant. Its local investigation also disclosed two usage-prefix mismatches outside the frozen grading scope.

[Evaluation details and recorded evidence](../EVALUATION.md) explain what can be checked from this release. Host isolation and prompt instructions are not equivalent to an OS security boundary. The QC runner executes real commands with host permissions; use appropriate containment for untrusted targets.

## Verify the package

Run these commands from the repository root:

```text
python verify_release.py
python -m unittest discover -s tests -p test_qc.py -v
```

The first command verifies the packaged skill hashes and recomputes the published grades from retained expected/actual outputs. It does not rerun the original agent investigations. The second runs the QC runner's real subprocess tests. See [release checks](../RELEASE-CHECKS.json) for observed results and unrun checks.

## Status and rollback

Regular, opt-in release. Natural activation/non-activation, every specialist branch, non-Windows native behavior and generalization to a new application have not been established for this exact version. No automatic tool installation, instruction enforcement or guaranteed containment is promised.

Keep your previous skill available outside active discovery. To roll back, remove this candidate from active discovery and restore the prior skill through your host's supported installation mechanism. Do not leave two conflicting `deeprea` versions active. Publication does not install or activate the skill on the author's machine.

The README was added after the evaluated release; the 18 existing package files remain unchanged.

Version 0.2.1 removes the experimental label. Relative to the evaluated snapshot, only the skill version metadata changed; the instruction body and other 17 package files are identical. This release-label change does not expand the measured performance claims.
