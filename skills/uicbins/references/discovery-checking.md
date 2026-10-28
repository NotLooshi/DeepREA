# Check selected content and discovery foundations

Use after [content and discovery](content-and-discovery.md) establishes the page's purpose and supported facts. Run:

```text
node <skill>/scripts/check-discovery.mjs <local-html-or-loopback-url> discovery.json report.json
```

Requires the existing Node/browser runtime used by the inspector. Set CHROME_PATH when needed; install nothing automatically. The output directory must already exist. Example configuration:

```json
{"profile":"public-page","essential":["#product-name","#price","#repair-description"]}
```

Select actual meaningful leaf text from the task; a wrapper with hidden descendants does not establish that its missing answers are visible. Each selector must resolve uniquely. The helper disables page JavaScript **before navigation** and checks selected content at 1440 and 390 CSS pixels using the shared state probe. Below-fold content is allowed; overflow clipping in the current state is checked. This is a static-content resilience test, not Googlebot simulation. Apps dependent on JavaScript should not be forced to render their entire interactive state without it; choose only applicable essential content, or use private-app without essential selectors and retain public SEO as NOT_APPLICABLE.

- `public-page`: nonempty title, one nonempty meta description, a nonempty native H1, existing same-document fragment targets, and nonempty selected essential text visible with scripts disabled.
- `demo`: essential selectors required; same-document fragment checks apply. Add `"metadataRequired":true` when metadata is part of the prototype brief. This does not assert a live business or domain exists.
- `private-app`: public SEO is NOT_APPLICABLE; optional supplied essential selectors still run. No selected checks means an explicitly empty applicable scope, not proof of the whole app's quality.

Unknown keys, malformed configuration/selectors, missing or ambiguous essential targets and browser failures remain UNVERIFIED. Observed empty/hidden/clipped essential text, missing required metadata or broken fragment targets are FAIL. Exit codes: 0 scoped PASS, 1 FAIL, 2 UNVERIFIED. The report retains observations and limitations.

Canonical tags, structured-data block counts, image alt presence and robots metadata are observations only. No fake URL, mandatory schema, image quota, keyword count or automatic noindex is added. Empty alt can be correct for decoration. Inspect relevance, truth, descriptive quality, schema eligibility and intended indexing separately. A nonempty description can still be misleading or generic.

File/loopback restrictions are not network isolation: referenced assets and redirects can make requests. Use trusted local artifacts. External destinations, other routes, deployment headers, redirect status, live canonicals, crawlability/indexing, field performance and search results require separate authorised checks. No occlusion, contrast, screen-reader, iframe/shadow-root or complete accessibility coverage is claimed. Preserve no-script resilience while separately verifying normal/reduced motion and the full interactive journey.
