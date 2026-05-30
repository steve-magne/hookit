#!/usr/bin/env node
// Vérifie le fichier avec ESLint après écriture (PostToolUse Write|Edit)
import { readFileSync } from 'fs';
import { execSync } from 'child_process';

const input = JSON.parse(readFileSync(0, 'utf8'));
const filePath = input.tool_input?.file_path ?? '';

if (!filePath || !/\.[cm]?[jt]sx?$/.test(filePath)) process.exit(0);

try {
  execSync(`npx --no-install eslint --max-warnings=0 "${filePath}"`, {
    stdio: 'pipe',
    timeout: 15_000,
  });
} catch (err) {
  const output = err.stdout?.toString() ?? '';
  if (output) process.stderr.write(`ESLint: ${output.trim()}\n`);
}
