"""Back up complete skill roots to a verified DEFLATE-9 ZIP. Python 3.10+."""

import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import stat
import tempfile
import zipfile


def digest(path):
    h = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def reject_link(path):
    info = path.lstat()
    if stat.S_ISLNK(info.st_mode) or getattr(info, "st_file_attributes", 0) & 0x400:
        raise ValueError(f"Link/reparse point requires a separate preservation method: {path}")
    return info


def scan(roots):
    files, directories = {}, []
    for number, root in enumerate(roots, 1):
        for component in (root, *root.parents):
            reject_link(component)
        prefix = f"root-{number}"
        directories.append(prefix + "/")
        # os.walk onerror is required: unreadable subtrees must not be skipped.
        def fail(error):
            raise error
        for directory, dirs, names in os.walk(root, followlinks=False, onerror=fail):
            for name in sorted(dirs + names):
                path = Path(directory) / name
                info = reject_link(path)
                relative = path.relative_to(root).as_posix()
                if "\\" in relative or ":" in relative:
                    raise ValueError(f"Non-portable ZIP path: {path}")
                archive_name = prefix + "/" + relative
                if stat.S_ISDIR(info.st_mode):
                    directories.append(archive_name + "/")
                elif stat.S_ISREG(info.st_mode):
                    files[archive_name] = {
                        "source": str(path), "sha256": digest(path),
                        "bytes": info.st_size, "mtime_ns": info.st_mtime_ns,
                        "mode": stat.S_IMODE(info.st_mode),
                    }
                else:
                    raise ValueError(f"Unsupported special file: {path}")
    return dict(sorted(files.items())), sorted(directories)


def verify_archive(path):
    """Test actual extraction into a fresh directory and compare every byte hash."""
    with zipfile.ZipFile(path) as archive:
        manifest = json.loads(archive.read("MANIFEST.json"))
        expected = set(manifest["files"]) | set(manifest["directories"]) | {"MANIFEST.json"}
        if set(archive.namelist()) != expected or len(archive.namelist()) != len(expected):
            raise ValueError("Archive member mismatch")
        with tempfile.TemporaryDirectory(prefix="skill-arena-restore-") as temporary:
            destination = Path(temporary).resolve()
            for name in archive.namelist():
                target = (destination / name).resolve()
                if not target.is_relative_to(destination) or "\\" in name or ":" in name:
                    raise ValueError("Unsafe archive path")
                if name.endswith("/"):
                    target.mkdir(parents=True, exist_ok=True)
                else:
                    target.parent.mkdir(parents=True, exist_ok=True)
                    with archive.open(name) as source, target.open("xb") as output:
                        shutil.copyfileobj(source, output)
            for name, entry in manifest["files"].items():
                restored = destination / name
                if restored.stat().st_size != entry["bytes"] or digest(restored) != entry["sha256"]:
                    raise ValueError(f"Restore verification failed: {name}")
            if not all((destination / name).is_dir() for name in manifest["directories"]):
                raise ValueError("Directory restoration failed")


def backup(roots, output):
    roots = [Path(root).absolute() for root in roots]
    if not roots:
        raise ValueError("At least one skills directory is required")
    for root in roots:
        if not root.is_dir():
            raise ValueError(f"Not a directory: {root}")
        for component in (root, *root.parents):
            reject_link(component)
    roots = [root.resolve() for root in roots]
    for i, root in enumerate(roots):
        if any(root.is_relative_to(other) or other.is_relative_to(root) for other in roots[:i]):
            raise ValueError("Skills roots overlap")
    output = Path(output).absolute()
    if output.exists() or output.is_symlink():
        raise ValueError("Backup output already exists")
    if output.suffix.lower() != ".zip":
        raise ValueError("Backup output must end in .zip")
    if any(output.resolve().is_relative_to(root) for root in roots):
        raise ValueError("Backup must be outside every source root")
    files, directories = scan(roots)
    manifest = {
        "format": 1, "compression": "ZIP DEFLATE level 9",
        "roots": {f"root-{n}": str(root) for n, root in enumerate(roots, 1)},
        "files": files, "directories": directories,
        "limitations": "File contents and directory structure; not ACLs, ownership, alternate streams or hardlink topology. Links/reparse points rejected.",
    }
    output.parent.mkdir(parents=True, exist_ok=True)
    # Exclusive creation protects earlier backups. No source files are written.
    stream = output.open("xb")
    try:
        with stream:
            with zipfile.ZipFile(stream, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9, strict_timestamps=False) as archive:
                for directory in directories:
                    archive.writestr(directory, b"")
                for name, entry in files.items():
                    archive.write(entry["source"], name)
                archive.writestr("MANIFEST.json", json.dumps(manifest, indent=2))
        verify_archive(output)
        if scan(roots) != (files, directories):
            raise ValueError("Sources changed during backup; retry before cleanup")
    except BaseException:
        output.unlink(missing_ok=True)
        raise
    return {
        "archive": str(output.resolve()), "archive_sha256": digest(output),
        "archive_bytes": output.stat().st_size,
        "source_bytes": sum(entry["bytes"] for entry in files.values()),
        "files": len(files), "roots": manifest["roots"],
        "compression": manifest["compression"], "restore_verified": True,
        "exclusions": [], "limitations": manifest["limitations"],
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", action="append", required=True, type=Path, help="Complete skills directory; repeat for multiple roots")
    parser.add_argument("--output", required=True, type=Path, help="New private ZIP outside all skills roots")
    args = parser.parse_args()
    try:
        print(json.dumps(backup(args.root, args.output), indent=2))
    except (OSError, ValueError, zipfile.BadZipFile) as error:
        parser.exit(1, f"Backup failed; do not proceed with cleanup: {error}\n")


if __name__ == "__main__":
    main()
