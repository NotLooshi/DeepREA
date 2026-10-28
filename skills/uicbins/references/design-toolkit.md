# Concrete design and verification toolkit

For new builds or substantial visual work; small edits use affected checks only. `<skill>` means this package's absolute directory. Run commands from the target project. The toolkit is pinned Taste 2.1.5 plus UICBINS adapters, with its MIT licence retained. Node 22+ and existing Chrome/Edge/Chromium are required; set `CHROME_PATH` to the working executable when discovery fails. Install nothing automatically.

## Page or app

A page is read and scrolled; an app is worked in. A marketing page containing a dashboard preview uses page composition outside and app principles inside. Inventory distinguishing subject facts, actual assets, the visitor's task and evidence before choosing a direction. Define sections by claims/proof or app regions by jobs/data. Do not inherit a template's invented testimonials, numbers, pricing or extra features.

Set `TASTE_SKILL_HISTORY` to a project-local `.uicbins/history.json` path before drawing. For comparisons, record a `--seed` and isolate history per arm. Actual available assets alone belong in `--have`; use `--keep palette,type` for fixed brand values. Supply the section roles the brief needs.

```text
node <skill>/toolkit/taste/scripts/draw.mjs --list sectors
node <skill>/toolkit/taste/scripts/draw.mjs --sector <sector> --brief "<subject>" --sections <roles> --options 3 --seed <number> --out .uicbins/design
node <skill>/toolkit/taste/scripts/draw.mjs --sector <sector> --brief "<subject>" --sections <roles> --direction <chosen-id> --seed <same-number> --out .uicbins/design
```

Choose a composition for its relationship to the specific subject, not familiarity. Apply type scale, palette proportions, hero and section relationships coherently. Make the distinguishing idea arise from supplied work, place, material, ritual or constraints; test whether simply replacing the brand with a competitor still works. A useful interaction fulfils the task or demonstrates the product, rather than existing to earn a score. Preserve accepted direction. If a dealt section cannot hold real content or available assets, pick a fitting alternative and record why; never invent proof to fill it or redraw repeatedly for a flattering result.

## App route

```text
node <skill>/toolkit/taste/scripts/draw.mjs --app --list kinds
node <skill>/toolkit/taste/scripts/draw.mjs --app --kind <kind> --brief "<product and job>" --options 3 --seed <number> --out .uicbins/app
node <skill>/toolkit/taste/scripts/draw.mjs --app --kind <kind> --brief "<product and job>" --style <chosen-id> --seed <same-number> --out .uicbins/app
```

State the screen's central question and primary job. Derive aggregates from the same rows as the table/chart; assert totals and filtered states. Colour communicates data/status meaning. Preserve context, meaningful data and task access at the required viewport without cramming content to meet a density preference. Cover relevant empty, zero, loading, error and edited states. Mobile navigation and controls must preserve the job.

Optional implementation assets live in `toolkit/taste/assets/`: base styles, app shell, chart helpers and scroll-scene stage. Inspect their API and copy only what fits. The stage is infrastructure, not an exhaustive scene catalogue: do not reference absent demo files. Preserve licence notices and existing project architecture.

## Assets and truthful content

Prefer supplied assets, the actual product interface and original subject-specific illustration. `toolkit/taste/scripts/assets.mjs` can search supported public collections when needed; inspect its help, preserve source/licence metadata and verify that the image supports the copy. A collection licence is not permission to impersonate a depicted brand. No universal image quota: a documentation page, editor or intentional typographic composition can be complete without four photographs. External images and fonts retain their own terms. Apply the brief’s asset/network constraints before adopting a dealt typeface or media suggestion: under local-only/no-download constraints use available local/system fonts and original assets, and verify actual browser requests during final acceptance. A direction recommendation never authorizes fetching a remote font.

## Measure, then judge

```text
node <skill>/scripts/inspect.mjs <file-or-url> --out .uicbins/inspection --widths 1440,768,390
node <skill>/scripts/inspect.mjs <file-or-url> --app --out .uicbins/inspection
```

Use `--film` for intermediate scroll-scene coverage; scenes also need `toolkit/taste/scripts/scenes.mjs`. Inspect the delivered production build. The adapter isolates upstream settings so a direction sheet's `allow` cannot hide defects; pass app/film mode explicitly and separately verify the chosen fonts load. App-mode reduced motion needs an explicit task test because the underlying inspector does not cover that branch.

The default console output shows blockers, errors and the path/count for optional advice. Use `--style-advice` only when a contextual design question warrants reviewing those suggestions. All raw findings, severities, exit and evidence are retained. Objective breakage blocks; known aesthetic findings remain visible as advice. Unknown rules or tool failures remain UNVERIFIED. Exit 0 means mechanical checks only, not design quality or task completion. `--require <rule,rule>` tightens intentionally adopted requirements; it cannot disable objective checks. Do not bypass the adapter using upstream `--allow`.

Consult optional advice in meaningful groups against the brief and actual renders; an advisory count is not a to-do list or quality score. Do not add content or media to reduce that count. Eyebrows, dividers, shadows, muted notes, asymmetry, palettes, headline wrapping, imagery counts and motion density are contextual choices, not universal defects. They can still be wrong here. Preserve substance when removing ornament. Interpret upstream suggested fixes through task requirements; do not blindly delete meaningful content.

Inspect final wide/narrow and interaction-state renders. Challenge specificity, focal hierarchy, imagery, complete content, legibility, rhythm, control clarity and task completion. Record consequential objections with visual evidence and closure checks. Do not use house-style score caps as a neutral benchmark or treat model-scored gallery observations as conversion evidence.

## Submitted-input mutation

Read [mutation checking](mutation-checking.md), then run `scripts/check-mutations.mjs` for forms confirming a submitted snapshot, in addition to task-specific valid/invalid/edit/cancel tests. It inventories actual native controls; omitted or unsupported controls remain uncovered. Custom widgets, async servers, external actions and live calculators need appropriate separate tests. Never remove a control to make a helper pass.

Both editions include these tools and libraries. Pro adds granular references interpreted through the same applicability policy. Helpers support execution; they do not force a host or agent to run them.
