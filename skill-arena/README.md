# Skill Arena

**Discover. Benchmark. Keep the best.**

A free agent skill that helps keep your skill collection useful. It groups skills by the jobs they do, finds alternatives, benchmarks real outputs, and keeps the smallest portfolio the evidence supports.

## Install

Ask Codex's skill installer to install the `skill-arena` directory from `NotLooshi/skills`. Or copy this complete folder into your host's skills directory, preserving any previous version outside active discovery. For Codex, that is `$CODEX_HOME/skills/skill-arena`, normally `~/.codex/skills/skill-arena`.

Refresh skill discovery using your host's supported mechanism and confirm `skill-arena` appears. If replacing Skill Maid, preserve that package and update callers from `$skill-maid` to `$skill-arena`; avoid leaving both discoverable.

## Try it

Start with one family on a temporary copy:

```text
Use $skill-arena to compare my UI skills on a temporary copy.
Discover up to two challengers, benchmark actual outputs, and show
which portfolio is worth keeping. Finish this family first.
Leave my live skills unchanged. Set a time and tool budget before trials.
```

For a quick audit:

```text
Use $skill-arena to group my skills by job and identify overlap.
Audit only: do not download, benchmark or change anything.
```

## What you get

A family queue, pinned source identities, actual test artifacts, keep/replace/defer decisions, and recovery information. Discovery temporarily expands the candidate pool; losing contenders do not become active skills. A tie or missing tool can correctly leave the existing collection unchanged.

Resume by pointing the agent at the saved run directory and setting the next family and budget. Nothing runs in the background unless you separately schedule it.

## Boundaries

The agent needs suitable execution tools to benchmark skills. UI comparisons need rendering and interaction checks; live consolidation needs supported host discovery and recovery checks. Without those, it delivers a staged proposal. Instructions do not supply a sandbox or grant spending authority.

Internal tests include real output comparisons, Codex catalog checks and interrupted-recovery execution. Automatic model routing, other hosts and general performance gains remain unverified. See [evaluation and limits](EVALUATION.md).

[MIT licensed](LICENSE). Originally developed as Skill Maid. Tested third-party skills retain their own licenses and are not bundled here.
