import { useState } from 'react';
import { Code, Button, Group, Text } from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import { useTranslation } from '../../src/contexts/I18nContext';

interface CodeWithCopyProps {
  code: string;
  language?: string;
}

export function CodeWithCopy({ code, language = 'javascript' }: CodeWithCopyProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code to clipboard:', err);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <Code block style={{ fontSize: '0.9em', position: 'relative' }}>
        {code}
      </Code>
      <Button
        variant="light"
        size="xs"
        onClick={copyToClipboard}
        style={{ position: 'absolute', top: 8, right: 8 }}
        leftSection={copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
      >
        {copied ? t('codeRunner.copied') : t('codeRunner.copy')}
      </Button>
    </div>
  );
}