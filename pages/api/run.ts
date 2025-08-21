import { NextApiRequest, NextApiResponse } from 'next';
import { NodeVM } from 'vm2';
import problems from '../../problems/problems.json';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { id, code } = req.body;
  const problem = problems.find((p: any) => p.id === id);
  if (!problem) return res.status(404).json({ error: 'not found' });

  const tests = problem.tests || [];
  const vm = new NodeVM({ sandbox: {}, timeout: 2000, console: 'inherit' as any });
  let userFn: any;
  try {
    vm.run(code + '\nmodule.exports = module.exports || exports.default || exports;');
    userFn = vm.run('module.exports');
  } catch (err: any) {
    return res.json({ error: 'compile error', details: String(err) });
  }

  const results: any[] = [];
  let passed = 0;
  for (const t of tests) {
    try {
      const args = parseInput(t.input);
      const expected = evalOutput(t.output);
      const start = Date.now();
      const out = userFn(...(Array.isArray(args) ? args : [args]));
      const time = Date.now() - start;
      const ok = deepEqual(out, expected);
      if (ok) passed++;
      results.push({ input: t.input, expected, out, ok, time });
    } catch (err: any) {
      results.push({ input: t.input, error: String(err) });
    }
  }
  res.json({ total: tests.length, passed, results });
}

function parseInput(s: string) {
  // simple parser for inputs like "[1,2,3],4" => [[1,2,3],4]
  if (!s) return null;
  const parts = splitTopLevel(s);
  return parts.map(p => eval('(' + p + ')'));
}

function evalOutput(s: string) {
  return eval('(' + s + ')');
}

function splitTopLevel(s: string) {
  const parts: string[] = [];
  let cur = '';
  let level = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '[' || ch === '{' || ch === '(') level++;
    if (ch === ']' || ch === '}' || ch === ')') level--;
    if (ch === ',' && level === 0) { parts.push(cur.trim()); cur = ''; } else cur += ch;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}

function deepEqual(a: any, b: any): boolean {
  try { return JSON.stringify(a) === JSON.stringify(b); } catch { return a === b; }
}
