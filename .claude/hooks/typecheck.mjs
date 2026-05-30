#!/usr/bin/env node
// Vérifie les types TypeScript après écriture (PostToolUse Write|Edit)
import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { resolve, dirname } from 'path';

const input = JSON.parse(readFileSync(0, 'utf8'));
const filePath = input.tool_input?.file_path ?? '';

if (!filePath || !/\.tsx?$/.test(filePath)) process.exit(0);

// Remonte jusqu'à trouver un tsconfig.json
const projectDir = process.env.CLAUDE_PROJECT_DIR ?? dirname(filePath);

try {
  execSync('npx --no-install tsc --noEmit', {
    cwd: projectDir,
    stdio: 'pipe',
    timeout: 30_000,
  });
} catch (err) {
  const output = err.stdout?.toString() ?? '';
  if (output) process.stderr.write(`TypeScript: ${output.trim()}\n`);
}
