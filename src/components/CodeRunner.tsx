import React, { useState, useEffect } from 'react';
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
  Divider,
  Select
} from '@mantine/core';
import Editor from '@monaco-editor/react';
import { useTranslation } from '../contexts/I18nContext';
import { useTheme } from '../contexts/ThemeContext';

// Language configurations
const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', monacoLang: 'javascript', templateKey: 'js' },
  { value: 'python', label: 'Python', monacoLang: 'python', templateKey: 'python' },
  { value: 'java', label: 'Java', monacoLang: 'java', templateKey: 'java' },
  { value: 'cpp', label: 'C++', monacoLang: 'cpp', templateKey: 'cpp' },
  { value: 'c', label: 'C', monacoLang: 'c', templateKey: 'c' }
];

// Format output results
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

interface CodeRunnerProps {
  problem: any;
  onTestResult?: (result: any) => void;
  showResults?: boolean;
}

export default function CodeRunner({ problem, onTestResult, showResults = true }: CodeRunnerProps) {
  const { t } = useTranslation();
  const { colorScheme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  
  // Update code when language changes
  useEffect(() => {
    const langConfig = SUPPORTED_LANGUAGES.find(l => l.value === selectedLanguage);
    const templateKey = langConfig?.templateKey || 'js';
    let template = problem.template?.[templateKey];
    
    // Fallback to 'js' template for JavaScript compatibility
    if (!template && selectedLanguage === 'javascript' && problem.template?.js) {
      template = problem.template.js;
    }
    
    setCode(template || '');
  }, [selectedLanguage, problem]);
  
  // Filter available languages based on problem templates
  // Always include JavaScript if any template exists (backward compatibility)
  const availableLanguages = SUPPORTED_LANGUAGES.filter(
    lang => {
      // Check if the specific template exists
      if (problem.template?.[lang.templateKey]) {
        return true;
      }
      // For JavaScript, also check for 'js' key (backward compatibility)
      if (lang.value === 'javascript' && problem.template?.js) {
        return true;
      }
      return false;
    }
  );
  
  const runTests = async () => {
    setIsRunning(true);
    const runningStatus = { status: 'running' };
    setResult(runningStatus);
    
    // Call the callback with running status if provided
    if (onTestResult) {
      onTestResult(runningStatus);
    }
    
    try {
      const res = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: problem.id, 
          code, 
          language: selectedLanguage 
        }),
      });
      const data = await res.json();
      setResult(data);
      
      // Call the callback if provided
      if (onTestResult) {
        onTestResult(data);
      }
    } catch (error) {
      const errorResult = { 
        status: 'error', 
        error: t('codeRunner.networkError')
      };
      setResult(errorResult);
      
      // Call the callback with error if provided
      if (onTestResult) {
        onTestResult(errorResult);
      }
    } finally {
      setIsRunning(false);
    }
  };
  
  const renderResult = () => {
    if (!result) return null;
    
    if (result.status === 'running') {
      return (
        <Alert color="blue">
          {t('codeRunner.runningTests')}
        </Alert>
      );
    }
    
    if (result.error) {
      return (
        <Alert color="red" title={t('codeRunner.runError')}>
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
              {t('codeRunner.testResults')}
            </Title>
            <Badge 
              color={allPassed ? 'green' : 'red'} 
              variant="filled"
            >
              {passedTests}/{totalTests} {t('codeRunner.passed')}
            </Badge>
          </Group>
          
          {/* Performance Information */}
          {result.performance && (
            <Paper p="sm" withBorder style={{ background: 'var(--mantine-color-blue-light)' }}>
              <Group justify="space-between">
                <div>
                  <Text size="xs" c="dimmed">{t('codeRunner.totalExecutionTime')}:</Text>
                  <Text size="sm" fw={500}>{result.performance.totalExecutionTime}ms</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed">{t('codeRunner.averageTime')}:</Text>
                  <Text size="sm" fw={500}>{result.performance.averageExecutionTime}ms</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed">{t('codeRunner.memoryUsed')}:</Text>
                  <Text size="sm" fw={500}>{result.performance.memoryUsage.heapUsed}MB</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed">{t('codeRunner.totalMemory')}:</Text>
                  <Text size="sm" fw={500}>{result.performance.memoryUsage.rss}MB</Text>
                </div>
              </Group>
            </Paper>
          )}
          
          <Stack gap={8}>
            {result.results.map((testResult: any, index: number) => (
              <Paper key={index} p="sm" withBorder>
                <Group justify="space-between" mb={5}>
                  <Text size="sm" fw={500}>
                    {t('codeRunner.testCase')} {index + 1}
                  </Text>
                  <Badge 
                    color={testResult.passed ? 'green' : 'red'}
                    variant="light"
                    size="sm"
                  >
                    {testResult.passed ? t('codeRunner.passed') : t('codeRunner.failed')}
                  </Badge>
                </Group>
                
                <Stack gap={5}>
                  <div>
                    <Text size="xs" c="dimmed">{t('codeRunner.input')}:</Text>
                    <Code>{testResult.input}</Code>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed">{t('codeRunner.expected')}:</Text>
                    <Code>{formatOutput(testResult.expected)}</Code>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed">{t('codeRunner.actual')}:</Text>
                    <Code color={testResult.passed ? undefined : 'red'}>
                      {testResult.actual === null ? 'null' : 
                       testResult.actual === undefined ? 'undefined' : 
                       formatOutput(testResult.actual)}
                    </Code>
                  </div>
                  {testResult.error && (
                    <div>
                      <Text size="xs" c="red">{t('common.error')}:</Text>
                      <Code c="red">{testResult.error}</Code>
                    </div>
                  )}
                  {testResult.executionTime !== undefined && (
                    <div>
                      <Text size="xs" c="dimmed">{t('codeRunner.executionTime')}: {testResult.executionTime}ms</Text>
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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <Paper shadow="sm" p="md" withBorder style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <LoadingOverlay visible={isRunning} />
        
        <Group justify="space-between" mb={15}>
          <Title order={4}>
            {t('codeRunner.title')}
          </Title>
          <Group>
            <Select
              value={selectedLanguage}
              onChange={(value) => setSelectedLanguage(value || 'javascript')}
              data={availableLanguages}
              size="sm"
              w={120}
            />
            <Button 
              onClick={runTests} 
              disabled={isRunning}
              color="blue"
              variant="filled"
            >
              {isRunning ? t('codeRunner.running') : t('codeRunner.submit')}
            </Button>
          </Group>
        </Group>
        
        <div style={{ flex: 1, minHeight: '300px' }}>
          <Editor
            height="100%"
            language={SUPPORTED_LANGUAGES.find(l => l.value === selectedLanguage)?.monacoLang || 'javascript'}
            value={code}
            onChange={(v) => setCode(v || '')}
            theme={colorScheme === 'dark' ? 'vs-dark' : 'light'}
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
        </div>
      </Paper>
      
      {showResults && result && (
        <Paper shadow="sm" p="md" withBorder style={{ maxHeight: '300px', overflow: 'auto' }}>
          {renderResult()}
        </Paper>
      )}
    </div>
  );
}
