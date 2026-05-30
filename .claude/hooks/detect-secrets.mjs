#!/usr/bin/env node
// Bloc les commandes Bash contenant des secrets potentiels (PreToolUse)
import { readFileSync } from 'fs';

const input = JSON.parse(readFileSync(0, 'utf8'));
const command = input.tool_input?.command ?? '';

const SECRET_PATTERNS = [
  /(?:ANTHROPIC|OPENAI|CLAUDE|GEMINI|GROQ)_API_KEY\s*=\s*['"]?\S{20,}/i,
  /sk-(?:ant-|proj-)?[a-zA-Z0-9_-]{32,}/,
  /ghp_[a-zA-Z0-9]{36}/,
  /-----BEGIN (?:RSA |EC )?PRIVATE KEY/,
  /(?:password|passwd|secret|token)\s*=\s*['"][^'"]{6,}/i,
];

const match = SECRET_PATTERNS.find(p => p.test(command));
if (match) {
  process.stdout.write(JSON.stringify({
    decision: 'block',
    reason: 'Secret potentiel détecté dans la commande. Vérifiez avant de continuer.',
  }));
}
