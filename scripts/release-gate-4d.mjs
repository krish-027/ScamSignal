/**
 * ScamSignal Batch 4D: local release gate, without deployment.
 * Runs existing npm gates, production smoke, static packaging audit and production dependency audit.
 * Reports outside the Git repository by default. No API calls except npm's registry audit.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { scanDist } from './release-utils-4d.mjs';

const root = process.cwd();
const reportDir = process.env.SCAM_SIGNAL_RELEASE_REPORT_DIR
  ? path.resolve(process.env.SCAM_SIGNAL_RELEASE_REPORT_DIR)
  : path.resolve(root, '..', 'ScamSignal-ReleaseEvidence');
const report = {
  title: 'ScamSignal — Final Local Release Gate',
  recordedAt: new Date().toISOString(),
  nodeVersion: process.version,
  status: 'INCOMPLETE',
  steps: [],
  bundle: null,
  manualChecksStillRequired: ['Real browser navigation/gameplay', 'Mobile/zoom/keyboard QA', 'Lighthouse in a real browser', 'Embarko HTTPS deployment check', 'Submission video and form'],
};

function execFixed(command, args, label) {
  console.log(`\n===== ${label} =====`);
  const isNpm = command === 'npm';
  const result = process.platform === 'win32' && isNpm
    ? spawnSync(process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', `npm ${args.join(' ')}`],
      { cwd: root, stdio: 'inherit', timeout: 300_000, windowsHide: false })
    : spawnSync(command, args, { cwd: root, stdio: 'inherit', timeout: 300_000 });
  const passed = !result.error && result.status === 0;
  report.steps.push({ label, passed, exitCode: result.status, error: result.error?.message ?? null });
  if (passed) console.log(`PASS  ${label}`);
  else console.error(`FAIL  ${label}${result.error ? ` (${result.error.message})` : ''}`);
  return passed;
}
function recordBundle() {
  console.log('\n===== Production bundle measurement =====');
  try {
    report.bundle = scanDist(path.join(root, 'dist'));
    const js = report.bundle.javascript.gzipBytes;
    const css = report.bundle.css.gzipBytes;
    console.log(`Compiled JS gzip: ${(js/1024).toFixed(1)} KiB`);
    console.log(`Compiled CSS gzip: ${(css/1024).toFixed(1)} KiB`);
    console.log(`Total unpacked dist size: ${(report.bundle.totalBytes/1024/1024).toFixed(2)} MiB`);
    // These are performance review flags, NOT invented pass/fail requirements.
    if (js > 300 * 1024) console.warn('REVIEW  JavaScript gzip exceeds 300 KiB; inspect Chrome Lighthouse.');
    if (report.bundle.totalBytes > 12 * 1024 * 1024) console.warn('REVIEW  Dist exceeds 12 MiB; inspect fonts/images.');
    report.steps.push({ label: 'Production bundle inspection', passed: true });
    return true;
  } catch (error) {
    console.error(`FAIL  Bundle inspection: ${error.message}`);
    report.steps.push({ label: 'Production bundle inspection', passed: false, error: error.message });
    return false;
  }
}
function saveReport() {
  const failed = report.steps.find(step => !step.passed);
  report.status = failed ? 'NO-GO: AUTOMATED CHECK FAILED' : 'AUTOMATED CHECKS PASSED — MANUAL QA PENDING';
  fs.mkdirSync(reportDir, { recursive: true });
  const reportPath = path.join(reportDir, 'scamsignal-batch4d-release-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n', 'utf8');
  console.log(`\nSaved release report: ${reportPath}`);
  console.log(`Release gate: ${report.status}`);
  if (failed) process.exitCode = 1;
}

let continueChecks = true;
try {
  if (!fs.existsSync(path.join(root, 'package.json'))) throw new Error('Run from the ScamSignal project root.');
  const ordered = [
    [process.execPath, ['--test', 'scripts/release-tools-4d.nodecheck.mjs'], 'Release-tool unit tests'],
    ['npm', ['run','typecheck'], 'TypeScript'],
    ['npm', ['run','lint'], 'ESLint'],
    ['npm', ['run','test'], 'Gameplay and regression tests'],
    ['npm', ['run','build'], 'Production build'],
    [process.execPath, ['scripts/release-audit.mjs'], 'Batch 4C metadata/assets audit'],
  ];
  for (const [command, args, label] of ordered) {
    if (!continueChecks) break;
    continueChecks = execFixed(command, args, label);
  }
  if (continueChecks) continueChecks = recordBundle();
  if (continueChecks) continueChecks = execFixed(process.execPath, ['scripts/production-smoke-4d.mjs'], 'Production HTTP smoke test');
  if (continueChecks) continueChecks = execFixed('npm', ['audit','--omit=dev'], 'Production dependency audit');
} catch (error) {
  report.steps.push({ label: 'Release gate preflight', passed: false, error: error.message });
  console.error(`FAIL  Release gate: ${error.message}`);
} finally {
  saveReport();
}
