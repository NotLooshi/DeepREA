# Native form mutation check

Runtime: Node 22+, installed Chrome/Chromium (or `CHROME_PATH`), and the preserved adjacent Taste CDP module. No npm install. This is a narrow local demo check, not a full journey test or an accessibility inspector.

From a skill directory:

```powershell
node scripts/check-mutations.mjs C:/work/demo/index.html C:/work/mutations.json C:/work/mutation-report.json
```

File URLs and loopback HTTP(S) URLs only. Use local-only demo fixtures: the checker clicks submit, and cannot prevent a local page's JavaScript from making external requests. Do not point it at a live transaction or credentials.

Config (selectors must describe actual rendered behavior):

```json
{
  "form": "#booking-form",
  "submit": "#confirm",
  "success": "#confirmation",
  "edit": "#edit",
  "settleMs": 100,
  "fields": [
    {"selector": "#name", "value": "Ada", "mutation": "Grace"},
    {"selector": "#email", "value": "ada@example.com", "mutation": "grace@example.com"},
    {"selector": "input[name=room]", "value": "Fen", "mutation": "Cove"},
    {"selector": "#newsletter", "value": false, "mutation": true}
  ]
}
```

Required: `form`, `submit`, `success`, nonempty `fields`. Each field needs a selector, a valid initial value, and a distinct valid mutation. `edit` is required when controls become protected/hidden after confirmation. `settleMs` defaults to 100 and is clamped to 20–3000 ms. Radio selectors must select the whole group; value/mutation are option values, not booleans. Checkboxes use booleans. Selects, inputs and textareas use valid strings; multiple select and file inputs are unsupported.

For a form inside an initially closed modal, add `"open": "#open-booking"`. This optional selector is clicked after every navigation, before inventory or filling, including each field's fresh reset. It must identify exactly one visible enabled native button, button-like input, or link with an `href`; disabled, inert, ARIA-disabled, hidden, missing, ambiguous and non-native openers leave the result UNVERIFIED. Omit `open` when the form is already available. This is one setup action, not a general journey language. A broken opener cannot produce PASS because the form fields must subsequently be visible and editable. DOM `.click()` still does not prove real pointer reachability or modal keyboard behavior.

The checker enumerates native form-associated controls before confirmation and again after each independent reset/confirmation. It includes controls lacking a name, such as `#name` and `#email`. Every relevant native control must have exactly one configured fixture. Radio members can share one group fixture. It reports uncovered controls, observed custom widgets, and unsupported input types instead of silently excluding them. Button-based time pickers require separate task-specific tests and leave this helper UNVERIFIED; a separate test does not rewrite that result into PASS.

Each field gets a fresh navigation, valid fixture, actual click and visible success. The checker then changes that field and requires the success indicator to disappear. If the control is protected/hidden, a visible working Edit button must first invalidate success and make editing possible. The changed fixture must subsequently reach visible success again. Reports retain per-field outcomes and inventory.

Exit codes: 0 PASS; 1 observed FAIL (possibly with uncovered controls too); 2 UNVERIFIED, including config/selector/runtime errors. All nonzero results block a claim that this check passed.

Limits: DOM setters plus synthetic `input`/`change` events and DOM `.click()` exercise handlers but do not reproduce trusted keyboard/pointer interaction. No iframe, shadow DOM, arbitrary custom widget, server persistence, accurate summary-content, cancel/restart, invalid-input, layout or keyboard coverage. A task author must choose a meaningful success indicator; visibility alone does not prove the summary reflects the changed value. Run separate browser tests for those promises. These constraints are explicit rather than an assertion of universal form coverage.
