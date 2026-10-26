# Skill Arena

**Stop collecting promises. Compare what actually works.**

[Get started](#install) · [Try a comparison](#try-it) · [Evidence](EVALUATION.md) · [All skills](../README.md)

Your agent has five skills for the same job. You need to know which one helps, which ones overlap, and whether a specialist still earns its place. Skill Arena turns that collection into a bounded comparison with saved evidence and a recovery route.

| Step | What happens | What you keep |
| --- | --- | --- |
| Map | Group skills by the jobs they do | A queue of task families |
| Challenge | Discover alternatives and pin their sources | A bounded candidate pool |
| Compare | Run shared tasks and inspect real outputs | Test artifacts and scoped findings |
| Decide | Keep, replace or defer based on the evidence | A justified portfolio and recovery information |

A tie is a useful result. If a challenger does not earn its place, the current collection can stay as it is.


A free agent skill that helps keep your skill collection useful. It groups skills by the jobs they do, finds alternatives, benchmarks real outputs, and keeps the smallest portfolio the evidence supports.

## Install

Ask Codex's skill installer to install the `skill-arena` directory from `NotLooshi/skills`. Or copy the complete `skill-arena/` folder into your host's skills directory, preserving any previous version outside active discovery. For Codex, that is `$CODEX_HOME/skills/skill-arena`, normally `~/.codex/skills/skill-arena`.

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

## Backup comes first

Before cleanup or optimization, Skill Arena saves every complete skills folder in scope to a new high-compression ZIP outside the skill directories. It uses DEFLATE level 9, includes hidden files and empty folders, and verifies a temporary extraction against file hashes before continuing. It never overwrites an older backup. Audit-only requests remain read-only.

The bundled helper needs Python 3.10+; an existing archiver can be used only with equivalent verified coverage. Links, unreadable files or changing sources stop the backup and cleanup. The ZIP is unencrypted: keep it in a private local directory. It preserves ordinary files and directories, not every filesystem permission or metadata feature.

The final message tells you exactly where the backup is, which folders it covers, its measured size and whether restoration was verified—even if the run stops early. To roll back, extract to a new folder and follow the [conflict-safe restoration procedure](references/consolidation.md), preserving newer edits.

## What you get

A family queue, pinned source identities, actual test artifacts, keep/replace/defer decisions, and recovery information. Discovery temporarily expands the candidate pool; losing contenders do not become active skills. A tie or missing tool can correctly leave the existing collection unchanged.

Resume by pointing the agent at the saved run directory and setting the next family and budget. Nothing runs in the background unless you separately schedule it.

## Boundaries

The agent needs suitable execution tools to benchmark skills. UI comparisons need rendering and interaction checks; live consolidation needs supported host discovery and recovery checks. Without those, it delivers a staged proposal. Instructions do not supply a sandbox or grant spending authority.

Internal tests include real output comparisons, Codex catalog checks and interrupted-recovery execution. Automatic model routing, other hosts and general performance gains remain unverified. See [evaluation and limits](EVALUATION.md).

[MIT licensed](LICENSE). Originally developed as Skill Maid. Tested third-party skills retain their own licenses and are not bundled here.
