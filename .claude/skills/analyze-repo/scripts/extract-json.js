#!/usr/bin/env node
// Extrait le premier tableau JSON valide d'une sortie texte (réponse Claude).
import { readFileSync } from 'node:fs'

const file = process.argv[2]
if (!file) {
  console.error('usage: extract-json.js <file>')
  process.exit(1)
}

const raw = readFileSync(file, 'utf8')

// Retire d'éventuelles fences markdown ```json ... ```
const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
const candidate = fenced ? fenced[1] : raw

// Isole du premier '[' au dernier ']'
const start = candidate.indexOf('[')
const end = candidate.lastIndexOf(']')

if (start === -1 || end === -1 || end < start) {
  process.stdout.write('[]')
  process.exit(0)
}

const slice = candidate.slice(start, end + 1)
try {
  const parsed = JSON.parse(slice)
  process.stdout.write(JSON.stringify(parsed))
} catch {
  process.stdout.write('[]')
}
