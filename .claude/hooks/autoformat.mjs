#!/usr/bin/env node
// Formate le fichier avec prettier après écriture (PostToolUse Write|Edit)
import { readFileSync } from 'fs';
import { execSync } from 'child_process';

const input = JSON.parse(readFileSync(0, 'utf8'));
const filePath = input.tool_input?.file_path ?? '';

if (!filePath) process.exit(0);

try {
  execSync(`npx --no-install prettier --write "${filePath}"`, {
    stdio: 'ignore',
    timeout: 10_000,
  });
} catch {
  // prettier absent ou erreur de format — non bloquant
}
