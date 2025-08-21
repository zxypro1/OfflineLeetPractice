import React, { useState } from 'react';
import { Button, Paper, Text, Textarea } from '@mantine/core';
import Editor from '@monaco-editor/react';

export default function CodeRunner({ problem }: any) {
  const [code, setCode] = useState(problem.template.js || '');
  const [result, setResult] = useState<any>(null);
  const runTests = async () => {
    setResult({ status: 'running' });
    const res = await fetch('/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: problem.id, code }),
    });
    const data = await res.json();
    setResult(data);
  };
  return (
    <Paper padding="md">
      <Editor
        height="60vh"
        defaultLanguage="javascript"
        value={code}
        onChange={(v) => setCode(v || '')}
      />
      <Button onClick={runTests} style={{ marginTop: 8 }}>提交并运行测试</Button>
      <Textarea value={JSON.stringify(result, null, 2)} minRows={6} readOnly style={{ marginTop: 8 }} />
    </Paper>
  );
}
