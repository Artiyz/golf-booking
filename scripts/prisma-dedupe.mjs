import fs from 'fs';

const p = 'prisma/schema.prisma';
let s = fs.readFileSync(p, 'utf8');

function stripDupBlock(src, kind, name) {
  // Remove every occurrence AFTER the first one
  // Matches "kind name { ... }" including nested braces safely (simple balance)
  const reStart = new RegExp(`\\b${kind}\\s+${name}\\s*\\{`, 'g');

  let match, starts = [];
  while ((match = reStart.exec(src)) !== null) starts.push(match.index);
  if (starts.length <= 1) return src; // nothing to dedupe

  // Keep the first block, remove subsequent ones
  const keepStart = starts[0];
  let i = 1;
  let out = src.slice(0, keepStart);
  // copy the first block including its balanced braces
  const blockEnd = (() => {
    let depth = 0, idx = keepStart;
    while (idx < src.length) {
      const ch = src[idx++];
      if (ch === '{') depth++;
      else if (ch === '}') { depth--; if (depth === 0) break; }
    }
    return idx;
  })();
  out += src.slice(keepStart, blockEnd);

  // Now skip every other duplicate block
  let cursor = blockEnd;
  for (; i < starts.length; i++) {
    const dupStart = starts[i];
    // append intermediate text (between previous cursor and this dupStart)
    out += src.slice(cursor, dupStart);
    // compute end of the dup block and skip it
    let depth = 0, idx = dupStart;
    while (idx < src.length) {
      const ch = src[idx++];
      if (ch === '{') depth++;
      else if (ch === '}') { depth--; if (depth === 0) break; }
    }
    cursor = idx;
  }
  // append remainder
  out += src.slice(cursor);
  return out;
}

s = stripDupBlock(s, 'enum', 'UserState');
s = stripDupBlock(s, 'enum', 'UserRole');
s = stripDupBlock(s, 'model', 'User');

fs.writeFileSync(p, s);
console.log('✅ Deduped prisma/schema.prisma');
