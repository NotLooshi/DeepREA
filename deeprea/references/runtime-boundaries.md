# Native CLI runtime boundaries

Use this only when reconstructing a native command-line interface. The observable program includes launcher quoting, runtime conversion, stream state and diagnostics—not just the recovered application functions. Select interactions relevant to the target; this is not a mandatory exhaustive matrix.

## State the boundary before replacing it

Record the actual process invocation, platform/runtime, argv, stdin delivery (pipe, redirected file or terminal), working directory and permitted file effects. A Python or JavaScript convenience API can implement different semantics from the original native runtime.

For each boundary you rely on, ask what competing implementations would do differently and run a small distinguishing case:

- **Arguments:** wildcard with and without quoting/whitespace; literal versus expanded values. Probe through the actual launcher used by the consumer. A parsed argv string may no longer contain the quoting that controlled native expansion.
- **Shared streams:** a line-oriented command followed by a file-style read from the same stdin, repeated reads, or EOF. Vary payload length around observed buffering transitions and distinguish pipe from seekable-file delivery. An elegant synthetic cursor can preserve bytes the target consumes or discards.
- **Filenames and diagnostics:** distinguish byte/locale conversion from Unicode paths, and empty names from directories. Combine a recoverable warning with a fatal error to check stderr order. Do not assume one high-level exception category models all native failures.

Keep tests inside allowed paths and resources. Reject drive-qualified, rooted, traversal and escaping paths before generated probes execute; Windows single-leading-slash paths require explicit treatment. A string helper's result is not proof of containment, and links/reparse points can escape a nominal workspace.

## Resolve a mismatch before encoding a rule

Retain the original failure. Change one relevant input property to distinguish competing causes, inspect the recovered call chain or runtime primitive, and separate observed behavior from an untraced mechanism. Do not hardcode a sample answer, buffer size or platform rule merely because it passes the discovered cases.

If an allowed OS/runtime primitive accurately supplies the required behavior, it can be simpler than an approximation. Verify its actual behavior and portability limits. It must not load or delegate to the original application. If the cause remains unresolved, preserve the bounded counterexample and mark the inference unknown.

Compatibility includes inconvenient behavior and bugs unless the user requests a replacement with intentional changes. Record an intentional improvement separately rather than silently counting it as equivalence. Confirm the repaired case, a neighboring variation and the relevant existing regressions; then return to the user's objective rather than expanding into unrelated platform research.
