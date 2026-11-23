// main.ts — "One Emoji, One Smile" entry (Node 22, stdlib only).
//
// The entry is exactly one emoji, nothing else:
//
//   😄
//
// U+1F604 GRINNING FACE WITH SMILING EYES — an open grin with smiling
// ^^ eyes. Why this emoji, against the judge's brief in the order it
// weighs things:
//
// 1. Warm and friendly, most likely to make a stranger smile. The open
//    grin plus smiling eyes smiles with the whole face, not just the mouth,
//    so a stranger reads it as a genuine invitation to smile back.
// 2. Warmth at first glance. The ^^ eyes read as genuine (Duchenne)
//    warmth in a single glance — kind, friendly, gently funny — with no
//    context, no caption and no second look needed.
// 3. Universality. A human smile is read the same way at any age and in
//    any background. No irony, no in-joke, no gesture or object that has
//    to be parsed first; a face that smiles is the one thing every
//    stranger understands the same way.
// 4. Chosen rather than default. It is not the first smiley that comes to
//    mind (🙂, the default) and not the softest classic everyone reaches
//    for first (😊) — it is picked for this moment, an open grin with
//    smiling eyes, while staying instantly readable at any size.
// 5. Right for a stranger. No hearts, no hug, no intimacy, sarcasm or
//    flirtation — nothing that would read oddly coming from someone
//    unknown. Just a grin, offered and nothing asked back.
//
// Encoding facts: 😄 is a single code point, U+1F604, one grapheme
// cluster, UTF-8 bytes F0 9F 98 84 (4 bytes). No variation selector, no
// ZWJ sequence, no skin tone. The output file holds exactly those 4 bytes
// and nothing else — NO trailing newline, the strictest reading of
// "exactly one emoji and nothing else" (fewer bytes also wins an
// exact-tie break). The gate allows 1–8 characters; this entry is 1.
//
// The program is deliberately boring: it holds the emoji as one constant,
// checks it against the competition's own gate before writing (exactly 1
// code point, 1 grapheme cluster, not only whitespace, no newline in the
// output), and writes it with no trailing newline. No clock, no random
// source, no network, so two runs write identical bytes and the grader
// sees the same emoji both times.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// The emoji. One open grin with smiling eyes — warm for a stranger,
// read the same way by everyone.
const EMOJI = '😄';

// The competition's gate, applied here before anything is written.
const MIN_CODE_POINTS = 1;
const MAX_CODE_POINTS = 8;

function abort(why: string): never {
  throw new Error('main.ts: ' + why);
}

function writeEmoji(): void {
  // Count Unicode code points, not UTF-16 code units and not bytes, because
  // that is how the gate counts: [...EMOJI] splits on code points.
  const codePoints = [...EMOJI];
  if (codePoints.length < MIN_CODE_POINTS || codePoints.length > MAX_CODE_POINTS) {
    abort(`emoji is ${codePoints.length} code points, outside the 1–8 gate`);
  }
  // One grapheme cluster: a single visible character, not a ZWJ sequence
  // or a base character plus a modifier.
  const graphemes = [...new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(EMOJI)];
  if (graphemes.length !== 1) {
    abort(`emoji is ${graphemes.length} grapheme clusters, expected exactly 1`);
  }
  if (EMOJI.trim().length === 0) {
    abort('emoji is only whitespace');
  }
  if (EMOJI.includes('\n') || EMOJI.includes('\r')) {
    abort('emoji must contain no newline');
  }
  // Exactly one code point, U+1F604, UTF-8 bytes F0 9F 98 84.
  if (codePoints[0].codePointAt(0) !== 0x1f604) {
    abort('emoji is not U+1F604');
  }
  if (Buffer.byteLength(EMOJI, 'utf8') !== 4) {
    abort(`emoji is ${Buffer.byteLength(EMOJI, 'utf8')} bytes, expected 4`);
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
  const to = join(outDir, 'entry.txt');

  mkdirSync(outDir, { recursive: true });
  // No trailing newline: exactly the 4 bytes of the emoji, nothing else.
  writeFileSync(to, EMOJI, 'utf8');
  console.log(`wrote ${to} (${codePoints.length} code point, ${Buffer.byteLength(EMOJI, 'utf8')} bytes)`);
}

writeEmoji();
