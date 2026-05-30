import { readFileSync } from 'fs';

const input = JSON.parse(readFileSync(0, 'utf8'));
const toolName = input.tool_name || '';
const toolInput = input.tool_input || {};

const SAFE_BASH = [
  /^ls/, /^pwd/, /^echo/, /^cat(?!.*>)/, /^head/, /^tail/, /^wc/,
  /^which/, /^whereis/, /^file/, /^stat/,
  /^git\s+(status|log|diff|show|branch|tag)/,
  /^npm\s+(list|ls|outdated|view)/
];

const readOnlyTools = ['Read', 'Glob', 'Grep'];
let allow = readOnlyTools.includes(toolName);

if (!allow && toolName === 'Bash') {
  const cmd = (toolInput.command || '').trim();
  allow = SAFE_BASH.some(p => p.test(cmd));
}

if (allow) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PermissionRequest',
      decision: { behavior: 'allow' }
    }
  }));
}