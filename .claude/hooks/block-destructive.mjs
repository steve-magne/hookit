#!/usr/bin/env node
// Bloc les commandes Bash destructives irréversibles (PreToolUse)
import { readFileSync } from 'fs';

const input = JSON.parse(readFileSync(0, 'utf8'));
const command = input.tool_input?.command ?? '';

const BLOCKED = [
  [/rm\s+-rf?\s+\/(?:\s|$)/, 'rm -rf / interdit'],
  [/git\s+push\s+.*--force(?:-with-lease)?\s+.*(?:main|master)/, 'force-push sur main/master interdit'],
  [/DROP\s+(?:TABLE|DATABASE)\s+\w+/i, 'DROP TABLE/DATABASE interdit sans confirmation explicite'],
  [/>\s*\/dev\/(?:sda|nvme|disk)\d*/i, 'Écriture directe sur disque bloquée'],
  [/chmod\s+-R\s+777\s+\//i, 'chmod 777 récursif sur / interdit'],
];

const blocked = BLOCKED.find(([pattern]) => pattern.test(command));
if (blocked) {
  process.stdout.write(JSON.stringify({
    decision: 'block',
    reason: `Commande destructive bloquée : ${blocked[1]}`,
  }));
}
