# Reversible consolidation

## Back up before the run

For cleanup/optimization, first create a private ZIP of every complete skills root in scope, including hidden files, resources and empty folders. Do this before discovery, benchmarks or mutations, not only for the eventual losing skills. In sandbox mode, back up the sandbox roots. Do not expand into unrelated home directories or plugin roots without scope. Keep backups outside every active skill root; use a new timestamped path and never overwrite a previous archive.

With Python 3.10+ available, use the bundled [backup helper](../scripts/backup.py):

```text
python /path/to/skill-arena/scripts/backup.py --root /path/to/codex/skills --root /path/to/agents/skills --output /private/backups/skills-before-YYYYMMDD-HHMMSS.zip
```

Pass actual authorized absolute paths. The helper uses ZIP DEFLATE level 9 (maximum DEFLATE compression, broadly supported), embeds a root/path/hash manifest, extracts to a fresh temporary directory, verifies all file bytes and directories, then rescans sources for changes. Save its JSON receipt in the private run record. Compression ratios vary; already-compressed files may not shrink. Allow space for the archive and a full temporary extraction.

Unreadable files, changing sources, links/junctions or special files fail the backup rather than being silently excluded. Preserve links through a suitable native backup method and verify restoration before proceeding; do not replace them with target contents and call that equivalent. If Python is unavailable, an existing archiver is acceptable only with equivalent complete-root coverage, high compression, a source map and verified test restoration. A failed/unavailable backup blocks cleanup; read-only inspection can continue.

The ZIP preserves ordinary file contents and directory structure, with file modes/timestamps recorded where available. It is not a full filesystem image: ACLs, ownership, alternate streams and hardlink topology are not guaranteed. Use a native preservation method when those matter. Do not promise rollback against every failure. A same-disk backup does not protect against disk loss.

The complete-root recovery archive can contain private files. Choose a destination directory restricted to the user and verify its access permissions before writing: the ZIP is not encrypted and the helper inherits filesystem permissions rather than enforcing a private ACL. Keep it local/private; do not upload it with benchmark evidence or public packages. Do not delete or expire it automatically. Configurations and callers outside these roots still need their own snapshots before modification.

To recover, extract into a new empty staging directory, check MANIFEST.json and file hashes against the source-root map, then use the conflict-safe restore procedure below. Never extract directly over active skills or newer user edits. A backup receipt is evidence for its recorded bytes, not evidence that host reload or routing succeeded.

## Stage the batch

1. Confirm the full-root ZIP and restore test passed. Snapshot any additional linked resources, discovery settings and relevant consumers outside every active discovery root. Record hashes and exact restore destinations. Preserve private evidence separately from distributable skill content.
2. Prepare candidates outside activation. Map every original capability, resource, attribution and license to its retained destination or explicitly proposed removal. Trace references from other skills, host configuration and project instructions within authorized scope. Mark inaccessible consumers unknown.
3. Record the exact proposed mutations, scope authorization, benchmark decision, fresh trigger/non-trigger and specialist checks, expected effective catalog and rollback steps. Review the diff for unrelated changes.
4. Confirm how this host disables/removes one entry and refreshes discovery, using available host evidence. An archive folder under a scanned root may still load. A plugin cache can be regenerated. Moving an alias may leave another active copy. Uninstalling a plugin can remove tools and multiple skills; treat that as wider scope.

Gate: preserve originals, pass required candidate checks, resolve affected dependencies, and establish both authorized activation and a supported verification route. When effective host-catalog verification is unavailable, leave originals active and deliver a staged proposal. For other unavailable checks, follow governing exception policy before proceeding; accepted gaps remain unverified, not passed.

## Apply one reversible batch

Use supported host configuration or package mechanisms. Verify absolute source/destination paths stay within the approved boundaries before moves. Preserve unrelated entries and user edits. Prefer reversible disablement or relocation outside discovery over deletion. Do not mutate plugin caches as a durable solution or rewrite host-managed metadata speculatively.

Refresh/reload using the supported mechanism and inspect the actual effective catalog in a fresh context. Check expected names, identities, duplicate activation paths and tools. Then execute the frozen positive triggers, near-miss non-triggers, callers and specialist smoke cases. If the host exposes no routing trace, disclose that routing behavior remains partially observed.

Before applying a batch, record per-path pre-change hashes, intended post-change hashes or absence, and original configuration values. On resume or rollback, compare the snapshot, intended post-change state and current state. Restore only paths still matching the recorded expected state; preserve any subsequent edits in a separate recovery copy and stop conflicting mutations for resolution. Do not overwrite newer files or configuration merely because a snapshot exists. Treat partial moves and missing receipts as unknown until actual state is inspected.

On any critical regression, use this conflict-safe procedure to restore the originals and configuration from the snapshot, reload and recheck the prior catalog/workflows. Verify restoration rather than claiming the existence of a backup proves rollback. Stop further batches until the cause is resolved.

## Completion record

Keep one concise decision table:

| Family/source revision | Disposition and destination | Evidence | Preserved specialty/dependencies | Activation check | Rollback |
|---|---|---|---|---|---|

Report active catalog counts only when directly observed, separately from disk-file counts. Include gaps, deferred families, and recovery results. Retain removed sources and evidence outside discovery for the agreed retention period; permanent deletion needs explicit authorization. Do not repeatedly rewrite this curator's own instructions based on its rankings: self-maintenance is a separate scoped change.

End with a clear backup notice, using measured values rather than this illustrative wording: "Done for the requested scope. Your previous skills are saved at [absolute path] as a high-compression ZIP (DEFLATE-9): [source bytes] → [archive bytes]. Covered: [roots]. Test restoration and hashes verified. Extract to a new folder before restoring." For incomplete work, state "Partial" or "Stopped" instead and still give the backup location and actual verification status. Never claim a verified archive when the helper failed.
