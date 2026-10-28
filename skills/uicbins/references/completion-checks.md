# Outcome checks for implemented interfaces

Use during final verification of implemented artifacts. PLAN and REVIEW retain their scope. Choose checks for features that actually exist; do not add features to satisfy this document.

## Derive expectations from the user task

Write the expected user-visible outcome before reading the implementation's handlers. A click that completes without error, a dialog that opens or a selector that exists does not establish task completion. Test the state after the action. Save a replayable check with assertions that fail the process on a failed outcome; a script that prints false and exits successfully is a failed check.

For a form or reservation-like journey:

| Promise | Exercise | Assert |
|---|---|---|
| Confirm | Enter valid data and submit | Terminal confirmation reflects every task-required submitted field and applicable total; current visible focus; no unexpected network action |
| Edit | Confirm, enter edit mode, change a field, submit again | Field is editable; confirmation reflects the new value and no stale success remains |
| Cancel | Confirm, cancel, then complete a new transaction with different data | Old success is cleared or explicitly cancelled; new data can be entered and confirmed |
| Mutate after success | Attempt each relevant exposed input change | Either intentional read-only state with a working edit path, or success invalidated/recomputed consistently |
| Retry | Trigger supported validation/failure then correct the cause | Input remains usable and a valid retry completes without duplicate/stale results |

Exercise names/emails as well as selectors when editable. A pre-confirmation review is not evidence about the terminal summary. Use the state probe’s text and focus assertions after each consequential transition, including nonempty invalid input and the second completed request. Distinguish dismissing an overlay from cancelling a transaction. Check modal focus placement, containment, Escape, return focus and reopening; disabled controls must not trap the next journey. Use safe local fixtures where network behaviour would mutate real external state.

For navigation, enumerate every visible link and verify its destination exists. At a narrow viewport, open the menu by keyboard, activate a destination, assert that the destination is reached and the menu closes, then return to desktop. Merely opening and toggling the menu is insufficient. For search/filter interfaces, test a matching query, no matches, clearing and keyboard operation. Derive similarly concrete outcomes for other tasks.

## Verify the state the user is left in

Read [state checking](state-checking.md) and run the bundled browser-state probe inside saved journey tests. Choose expected targets from the task before implementing handlers. Run it on the initial view, after consequential actions, and after changing viewport. A probe checks the current state; it does not perform the journey or replace trusted keyboard/pointer tests.

- **After save and cancel:** identify the surviving trigger by stable record identity after rendering. Verify focus reaches that visible, operable control. A reference to a removed node, focus on body, or focus inside a visually closed overlay is a failure. If filtering removes that record, define a meaningful surviving list/filter target. Test both branches when applicable.
- **On a phone:** preserve decision-relevant information, not necessarily the desktop arrangement. Inventory fields and counts from the brief, and inspect their rendered presence, nested clipping and reachability. Reflow them into rows, labelled details or an explicit disclosure; do not hide required facts just to remove document overflow. Test opening the disclosure when that is the chosen design.
- **For feedback:** begin with no notification claiming an action has happened. Show a status only after its corresponding action, with accurate text; clear or replace it when the state changes. Test initial, open, close, success and edit states as applicable. Initial page load is not form-open success.

Use independent expected content for dynamic summaries as well as counts. Render user-supplied text as text; verify a harmless markup fixture remains literal in local demo summaries. Retain the scoped tests and final screenshots. Repeated passing selectors are not evidence that the visible information is useful.

## Check transition branches and final execution

For changes to filtered lists, test the edited record remaining, disappearing and leaving an empty result. After rendering, resolve the current control by stable identity; if absent, deliberately focus a visible next row or list/filter control. Do not focus a detached reference or call focus on a missing node. Assert updated data and counts, the current filtered result, meaningful focus, truthful status and no uncaught errors together. A successful data mutation does not excuse a broken final state.

For public pages or explicit SEO tasks, apply [content and discovery](content-and-discovery.md). Check supplied facts and action promises independently of metadata presence. Render essential content with scripts disabled using [discovery checking](discovery-checking.md); do not equate reduced motion with script failure.

After repairs, execute [final checks](final-checks.md) against all delivered files. Separate behavior, content truth/completeness, visual relevance and applicable discovery findings. Critical failures remain blockers despite a high aggregate pass rate. Unavailable independent review is a limitation, not a completed pass.

## Measure rather than declare

Measure primary-action text contrast from the rendered foreground/background with the relevant font size/weight and threshold. For flat opaque colours, compute relative luminance and contrast; a guessed ratio is not a measurement. For gradients, opacity, images or unsupported paint, inspect an appropriate rendered sample or retain an unresolved result. Inspect focus and disabled states where present. Do not substitute a claimed WCAG pass for measured evidence.

Inspect final wide and narrow renders, overflow and runtime errors. In reduced-motion mode, verify the actual animated elements and scripted scrolling/transitions that the interface uses; checking only a media-query declaration is insufficient.

## Challenge the checks

Before delivery, ask what broken interface could still pass this script. If a test named “edit” never changes and reconfirms a value, repair the test and rerun. If a named requirement has no assertion or observed manual check, label it unverified. Preserve actual output and current artifact identity. After repairs, rerun affected journeys and required regressions. Report failures honestly; source, tests and evidence must describe the same final artifact.


### Complete the terminal step, then repeat

If a journey has a review screen and a separate final confirmation, test both actual controls. Complete request A through its terminal action, close/cancel, then complete a distinct request B through its terminal action. Check B's data, current heading/status, available review/edit/confirm controls and focus; restore every terminal-only state (hidden controls, labels and flags), not just form fields. Editing may belong before the terminal action; do not force post-commit editing when the product intentionally ends the transaction. A test named “edit/reconfirm” that never presses the final control does not cover that path. During review, inspect the test's actual actions or execution trace against the visible user journey.

### Check the outcome of a visual repair

A colour-name or CSS-property assertion is not a contrast test. Measure the foreground against the actual background beneath the text at each affected viewport; a transparent header can cross different surfaces. Check the full text area, not just one convenient point. Preserve unsupported image/gradient paint as a verification gap. After responsive grid/flex changes, inspect whether required subject artwork has a nonzero visible area inside the viewport; DOM presence and a page-wide overflow check can miss off-canvas art hidden by an ancestor. Reopen the repaired phone, intermediate and desktop renders before closing the finding.
