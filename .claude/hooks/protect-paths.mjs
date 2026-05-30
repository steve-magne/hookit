#!/usr/bin/env node
// Protège les fichiers sensibles contre l'écriture (PreToolUse Write|Edit)
import { readFileSync } from 'fs';

const input = JSON.parse(readFileSync(0, 'utf8'));
const filePath = input.tool_input?.file_path ?? '';

const PROTECTED = [
  /\/\.env$/,
  /\/\.env\.local$/,
  /\/\.env\.production/,
  /\/secrets\//,
  /\/(id_rsa|id_ed25519|.*\.pem)$/,
];

const blocked = PROTECTED.find(p => p.test(filePath));
if (blocked) {
  process.stdout.write(JSON.stringify({
    decision: 'block',
    reason: `Fichier protégé : ${filePath}. Modifiez manuellement si intentionnel.`,
  }));
}
