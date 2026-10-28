# Check the resulting UI state

Use `scripts/check-ui-state.mjs` after task-specific browser actions. It exports a self-contained `inspectUIState(config)` function for the existing browser session; it does not launch a browser or perform actions.

```js
import { inspectUIState } from '/absolute/path/to/skill/scripts/check-ui-state.mjs';
// Playwright: perform the real keyboard/pointer journey and await its settled result.
const saved = await page.evaluate(inspectUIState, {
  focus: '#ticket-42-open',
  content: ['#ticket-42-name', '#ticket-42-priority', '#closed-count'],
  absent: ['#edit-dialog'],
  text: [{selector:'#saved-summary', includes:['Alex Chen','Workshop A','2 people']}]
});
// Vendored Browser Page: await page.eval(inspectUIState, config).
```

On initial load, also check that an action-dependent notification is absent, for example `{absent:['#interest-opened-toast']}`. After save or cancel, select the **current surviving** trigger or other deliberate return destination. Re-rendering often destroys the old trigger; checking a stale object or only the closed modal misses lost focus.

All configuration keys are optional individually, but at least one check is required. `text` is an array of `{selector, includes}` entries, where includes is a nonempty array of expected literal strings. It compares whitespace-normalized rendered HTML innerText, excludes display-hidden descendants, and checks target visibility and clipping. It does not parse numbers, infer truth or support SVG text targets. Unknown entry keys are rejected. `focus` is one nonempty CSS selector; `content` and `absent` are arrays of nonempty CSS selectors. Unknown keys, invalid selectors, ambiguous selectors, or a missing expected focus/content target produce `UNVERIFIED`. Missing absent targets pass. Every specified existing target must be unique.

`PASS` means the selected snapshot checks passed. `FAIL` identifies an observed state mismatch. `UNVERIFIED` means at least one requested check could not be established; other observed failures remain in the returned `checks`. Never treat `UNVERIFIED` as a pass. Keep the result alongside the actual browser journey, viewport and artifact identity.

Focus must equal the current visible, enabled, non-inert target. Hidden ancestors, zero opacity, disabled semantics and clipping are rejected. Content checks inspect element and text geometry against overflow clipping ancestors, including the element's own text clipping. A one-pixel geometry tolerance accommodates rounding. Vertical position below the page fold alone is allowed. Scroll containers are checked in their **current** scroll state: scroll/reveal the content through the intended interaction first if that is the contract.

Choose actual meaningful leaf targets such as the room capacity, price, ticket priority and action label. A wrapper containing a hidden child does not establish that the child is visible. The helper skips hidden descendant text; it cannot infer what missing information ought to exist. Content fields need task-authored expectations and screenshots at narrow and wide widths.

Limitations: no occlusion, contrast, truth of copy, complete accessibility, iframe/shadow DOM, custom-widget keyboard behaviour, or full journey certification. It uses axis-aligned geometry; transformed/rotated clipping, masks and clip-path require visual review. It does not trigger actions, wait for transitions or network responses, or assert status text matches stored data. Use trusted keyboard/pointer interactions and explicit data assertions in your browser harness, then run the probe on the settled state. A visible-only notification check cannot prove that an assistive-technology live region is silent.

## Verify the terminal record and focus together

Before handlers, name the user-visible fields promised by the brief and write independent example values. After pressing the actual final action (not only Review), assert these strings in the terminal summary and focus on a current visible target. Repeat with distinct values. Do not derive expectations from the handler, a previous screen or generated success text. Choose meaningful leaf targets; a wrapper can contain hidden information. Preserve deliberate masking and privacy: never demand passwords, secrets or unnecessary personal information in a summary.

After invalid input, focus the field that actually failed validation, not the first nonempty field or an unrelated selector. Check empty input and nonempty invalid input separately. Run the probe within actual keyboard/pointer journeys; its result must be asserted, not just printed. The same underlying outcomes can use an existing equally explicit test harness. When a helper cannot model a multi-step flow, cover those transitions in task tests and keep the helper limitation visible.
