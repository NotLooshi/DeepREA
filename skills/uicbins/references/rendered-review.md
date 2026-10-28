# Rendered outcome coverage

Read during blueprinting and QA. A journey score is not a visual verdict. Before building, list the brief's essential facts and tasks: offer, amounts and their basis, conditions, next step and simulation limits where applicable. Give each fact a short id and independently expected text; add its unique leaf selector once implemented. Audit this ledger against the original brief, not only the generated page. Do not make every paragraph mandatory or invent missing facts.

Run the bundled command with the configured Chromium route:

```sh
node scripts/check-rendered.mjs <local-url-or-file> <critical.json> <evidence-directory>
```

Example configuration (replace with facts actually supplied):

```json
{"critical":[{"id":"materials","selector":"#materials","expectedText":"Materials included"}]}
```

The command checks initial rendered HTML/SVG text boundaries at 390, 768 and 1440 CSS pixels, waits for fonts, and saves first-viewport and full-page PNGs plus report.json. It automatically scans meaningful text, including headings/navigation/labels, so selective fact coverage cannot silently exclude an obvious clipped heading. It checks each declared fact's presence and visibility. It allows scrollable regions and excludes hidden/aria-hidden decorative text from the automatic scan; never hide meaningful content from accessibility to pass a check. Missing/ambiguous selectors, bad configurations and tool errors are UNVERIFIED. Actual missing text or clipped content is FAIL. Exit 0/1/2 means scoped PASS/FAIL/UNVERIFIED. Add this command to finish's mechanical checks; retain discovery and behavioral checks.

The geometry report does not measure painted overlap, contrast, aesthetics or content truth. Critical selectors should target leaf text rather than mixed sections. Legitimate intentionally cropped decorative marks need an explicit rendered disposition; essential content cannot be waived as branding. Preserve raw findings, do not suppress the scanner or change requirements to manufacture a pass.

## Open the images

The builder and fresh reviewer must use an available image-viewing tool to open the saved first-viewport and full-page images at phone, intermediate and desktop widths. Record which files were viewed and concrete observations about headline, supporting facts, action, illustration, spacing and responsive changes. A DOM inspection, capture command, report flag or image hash is not proof of viewing. If image access is unavailable, visual review is UNVERIFIED.

Check the actual painted background behind text, including artwork crossing it. A good palette contrast ratio does not prove local contrast over a similarly coloured illustration. Repair layer placement, protected text space, scale or composition first; use a stroke or shadow only when it makes that specific design readable. Avoid huge empty grid tracks, incidental label crops and a phone illustration that obscures the offer or action. These are observed consequences, not universal bans on whitespace, overlap or below-fold CTAs.

Inspect interaction captures too: invalid submission, valid confirmation and edited/reopened state. For invalid input, test whitespace-only names where a real name is required, accurate field identification, associated error text and an announcement/focus strategy. For automatic motion lasting over five seconds alongside other content, provide an operable persistent pause/stop/hide mechanism unless essential; hover-only pausing and reduced-motion preference alone do not cover that need. Finite decorative entrances may be simpler. Test actual time evolution and reduced motion, not just CSS string presence.

Resolve objections with a visible change and rerun affected checks. Retain four separate conclusions: behavior, supplied-content coverage, rendered/accessibility review, and discovery. Passing one dimension never closes another. A fresh reviewer must receive the brief and files without the builder's winning score. Preserve unresolved findings and the limits of one reviewer/one browser.

## Close the gaps observed in evaluation

The automatic scan excludes conventional accessible-only text only when an absolutely/fixed positioned box is at most 1px in both dimensions and explicitly clipped away with rect(0,0,0,0) or inset(50%). An sr-only class name alone does not exempt content. Explicit critical targets still require visible text. Check that the equivalent visible subject/label is present; this exclusion does not approve hiding essential facts.

Full-page images are often scaled down by viewing tools. Do not approve small text or text crossing artwork from a reduced thumbnail. Capture the affected section at native viewport scale, open that crop, and assess the actual painted background behind the glyphs. Record the colour pair/compositing basis when measurable; otherwise keep contrast unverified. A clean ancestor-background calculation cannot clear a conflicting image or SVG layer.

After a visual repair, inspect the whole composition again. Moving or shrinking an illustration to clear a CTA must not leave accidental empty space or destroy the intended hierarchy. Fix the responsible layout/height relationship; preserve useful art. No universal hero height or above-fold price rule is implied.

After the last delivered-file edit, rerun this rendered command as well as discovery, journeys and inspector through the final runner. A new accessible heading or CSS override added after captures invalidates the relevant previous evidence. Confirm the final runner actually contains these commands rather than inferring coverage from a PASS label.

## Composition disposition

In adversarial review, trace the full rendered page from introduction through the primary task to its destination at phone, intermediate and desktop widths. For each large whitespace region or unexpectedly displaced component, compare the visible relationship with the blueprint. Inspect the relevant grid/flex placement, bounding boxes and responsive rules when the cause is unclear. A full-page thumbnail locates the issue; open a native-scale section capture to judge the affected hierarchy and text.

Record the most consequential composition observation with its screenshot, affected region, user consequence and disposition: repair with an observable closure condition, or retain with a brief task/brand rationale supported by the render. An orphaned rail, unintended empty track or fragmented offer caused by wrapping remains an open defect even when navigation and overflow checks pass. Intentional whitespace, asymmetric grids and decorative cropping may remain when they preserve the intended reading order, legibility and task flow; no universal density, pixel-gap or above-fold rule applies.

The builder must reconcile this observation with the final full-page render before accepting the review. After repair, inspect both the affected region and surrounding sequence at every affected breakpoint. Keep functional results separate from the composition disposition. Missing image access leaves this requirement unverified; a generic “looks good” or passing process receipt does not supply the observation.
