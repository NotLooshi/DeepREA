import { RULE_IDS } from '../toolkit/taste/scripts/lib/rules.mjs';

export const OBJECTIVE_RULES = Object.freeze(['contrast', 'overflow', 'broken-image', 'covered-text', 'clipped-text', 'reduced-hidden', 'scene-not-started', 'scene-not-live']);
const known = new Set(RULE_IDS);

// Classification preserves each upstream observation; it does not edit its severity or wording.
export function classifyInspection(report, vendorExit, required = []) {
  const errors = [];
  if (![0, 1].includes(vendorExit)) errors.push('Inspector did not complete with a supported exit code.');
  if (!Array.isArray(required) || required.some(id => !known.has(id))) errors.push('Unknown required rule.');
  const valid = report && typeof report.url === 'string' && typeof report.at === 'string' && Array.isArray(report.allow) && Array.isArray(report.viewports) && report.viewports.length > 0 && Array.isArray(report.images) && Array.isArray(report.findings);
  if (!valid) errors.push('Malformed or incomplete inspector report.');
  if (valid && report.viewports.some(v => !v || !Number.isFinite(v.width) || v.width <= 0 || v.load !== 'load' || !Number.isFinite(v.metrics?.page?.height) || !Number.isFinite(v.metrics?.viewport?.w) || !Number.isFinite(v.metrics?.viewport?.h))) errors.push('Viewport did not finish loading or lacks measured dimensions.');
  const findings = valid ? report.findings : [];
  if (valid && report.allow.length) errors.push('Report suppressed rules; unsuppressed inspection is required.');
  for (const f of findings) if (!f || !known.has(f.id) || !['FAIL', 'WARN'].includes(f.level) || typeof f.message !== 'string' || typeof f.fix !== 'string') errors.push('Unknown rule or malformed finding.');
  if (valid && [0,1].includes(vendorExit) && Number(findings.some(f => f?.level === 'FAIL')) !== vendorExit) errors.push('Report findings disagree with inspector exit code.');
  const blockers = new Set([...OBJECTIVE_RULES, ...(Array.isArray(required) ? required : [])]);
  const blocking = findings.filter(f => blockers.has(f?.id));
  const advisory = findings.filter(f => !blockers.has(f?.id));
  return { exitCode: errors.length ? 2 : blocking.length ? 1 : 0, scope: 'Mechanical checks only; advisory findings and rendered design still require review. This is not completion or an accessibility certification.', blocking, advisory, errors };
}
