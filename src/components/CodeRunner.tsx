import React, { useState } from 'react';
import { 
  Button, 
  Paper, 
  Text, 
  Title, 
  Stack, 
  Group, 
  Badge, 
  LoadingOverlay,
  Alert,
  Code,
  Divider
} from '@mantine/core';
import Editor from '@monaco-editor/react';

// 格式化输出结果
function formatOutput(value: any): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'number') return `${value}`;
  if (typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    return `[${value.map(formatOutput).join(',')}]`;
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

export default function CodeRunner({ problem }: any) {
  const [code, setCode] = useState(problem.template.js || '');
  const [result, setResult] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  
  const runTests = async () => {
    setIsRunning(true);
    setResult({ status: 'running' });
    
    try {
      const res = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: problem.id, code }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ 
        status: 'error', 
        error: '运行失败，请检查网络连接' 
      });
    } finally {
      setIsRunning(false);
    }
  };
  
  const renderResult = () => {
    if (!result) return null;
    
    if (result.status === 'running') {
      return (
        <Alert color="blue">
          正在运行测试...
        </Alert>
      );
    }
    
    if (result.error) {
      return (
        <Alert color="red" title="运行错误">
          <Code block>{result.error}</Code>
        </Alert>
      );
    }
    
    if (result.results) {
      const passedTests = result.passed || 0;
      const totalTests = result.total || result.results.length;
      const allPassed = passedTests === totalTests;
      console.log(result.results)
      
      return (
        <Stack gap={10}>
          <Group justify="space-between">
            <Title order={5}>
              📋 测试结果
            </Title>
            <Badge 
              color={allPassed ? 'green' : 'red'} 
              variant="filled"
            >
              {passedTests}/{totalTests} 通过
            </Badge>
          </Group>
          
          <Stack gap={8}>
            {result.results.map((testResult: any, index: number) => (
              <Paper key={index} p="sm" withBorder>
                <Group justify="space-between" mb={5}>
                  <Text size="sm" fw={500}>
                    测试用例 {index + 1}
                  </Text>
                  <Badge 
                    color={testResult.passed ? 'green' : 'red'}
                    variant="light"
                    size="sm"
                  >
                    {testResult.passed ? '通过' : '失败'}
                  </Badge>
                </Group>
                
                <Stack gap={5}>
                  <div>
                    <Text size="xs" c="dimmed">输入:</Text>
                    <Code>{testResult.input}</Code>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed">期望输出:</Text>
                    <Code>{formatOutput(testResult.expected)}</Code>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed">实际输出:</Text>
                    <Code color={testResult.passed ? undefined : 'red'}>
                      {testResult.actual === null ? 'null' : 
                       testResult.actual === undefined ? 'undefined' : 
                       formatOutput(testResult.actual)}
                    </Code>
                  </div>
                  {testResult.error && (
                    <div>
                      <Text size="xs" c="red">错误:</Text>
                      <Code c="red">{testResult.error}</Code>
                    </div>
                  )}
                  {testResult.executionTime !== undefined && (
                    <div>
                      <Text size="xs" c="dimmed">执行时间: {testResult.executionTime}ms</Text>
                    </div>
                  )}
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Stack>
      );
    }
    
    return (
      <Code block>
        {JSON.stringify(result, null, 2)}
      </Code>
    );
  };
  
  return (
    <Stack gap={15}>
      <Paper shadow="sm" p="md" withBorder style={{ position: 'relative' }}>
        <LoadingOverlay visible={isRunning} />
        
        <Group justify="space-between" mb={15}>
          <Title order={4}>
            💻 代码编辑器
          </Title>
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            color="blue"
            variant="filled"
          >
            {isRunning ? '运行中...' : '🚀 提交并运行测试'}
          </Button>
        </Group>
        
        <Editor
          height="400px"
          defaultLanguage="javascript"
          value={code}
          onChange={(v) => setCode(v || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            contextmenu: false,
            folding: false
          }}
        />
      </Paper>
      
      {result && (
        <Paper shadow="sm" p="md" withBorder>
          {renderResult()}
        </Paper>
      )}
    </Stack>
  );
}
