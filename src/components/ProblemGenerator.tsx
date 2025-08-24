import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Textarea, 
  Title, 
  Text, 
  Card, 
  Alert, 
  Loader, 
  Badge, 
  Group, 
  Stack, 
  Grid,
  useMantineColorScheme
} from '@mantine/core';
import { IconWand, IconPlus, IconBrain } from '@tabler/icons-react';
import { useTranslation, useI18n } from '../contexts/I18nContext';

interface GeneratedProblem {
  id: string;
  title: {
    en: string;
    zh: string;
  };
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  description: {
    en: string;
    zh: string;
  };
}

interface ProblemGeneratorProps {
  onProblemGenerated?: (problem: GeneratedProblem) => void;
  onClose?: () => void;
}

const ProblemGenerator: React.FC<ProblemGeneratorProps> = ({ onProblemGenerated, onClose }) => {
  const { t } = useTranslation();
  const { locale } = useI18n();
  const { colorScheme } = useMantineColorScheme();
  
  const [request, setRequest] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [generatedProblem, setGeneratedProblem] = useState<GeneratedProblem | null>(null);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by ensuring component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  const suggestedRequests = [
    locale === 'zh' ? "我想做一道动态规划题目" : "Generate a dynamic programming problem",
    locale === 'zh' ? "创建一个中等难度的数组操作问题" : "Generate a medium difficulty array manipulation problem",
    locale === 'zh' ? "创建一个关于二分搜索的问题" : "Create a binary search problem",
    locale === 'zh' ? "我想要一个滑动窗口字符串处理问题" : "I want a string processing problem with sliding window",
    locale === 'zh' ? "生成一个困难的图算法题目" : "Generate a hard graph algorithm problem",
    locale === 'zh' ? "创建一个简单的贪心算法问题" : "Create an easy greedy algorithm problem",
    locale === 'zh' ? "我需要一道链表操作的题目" : "I need a linked list operation problem",
    locale === 'zh' ? "生成一个树遍历问题" : "Generate a tree traversal problem"
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'green';
      case 'Medium': return 'yellow';
      case 'Hard': return 'red';
      default: return 'gray';
    }
  };

  const handleGenerate = async () => {
    if (!request.trim()) {
      setError(t('aiGenerator.pleaseEnterRequest'));
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    setGeneratedProblem(null);

    try {
      const response = await fetch('/api/generate-problem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ request: request.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate problem');
      }

      setGeneratedProblem(data.problem);
      setSuccess(data.message);
      
      if (onProblemGenerated) {
        onProblemGenerated(data.problem);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate problem');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setRequest(suggestion);
  };

  // Prevent hydration issues by not rendering until mounted
  if (!mounted) {
    return (
      <Box maw={800} mx="auto" p="md">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="lg">
            <Group gap="md">
              <IconBrain size={32} color={colorScheme === 'dark' ? '#748ffc' : '#339af0'} />
              <Title order={2} c={colorScheme === 'dark' ? 'blue.4' : 'blue.6'}>
                {t('aiGenerator.title')}
              </Title>
            </Group>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <Loader size="md" />
            </div>
          </Stack>
        </Card>
      </Box>
    );
  }

  return (
    <Box maw={800} mx="auto" p="md">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="lg">
          <Group gap="md">
            <IconBrain size={32} color={colorScheme === 'dark' ? '#748ffc' : '#339af0'} />
            <Title order={2} c={colorScheme === 'dark' ? 'blue.4' : 'blue.6'}>
              {t('aiGenerator.title')}
            </Title>
          </Group>

          <Text size="sm" c="dimmed">
            {t('aiGenerator.subtitle')}
          </Text>

          {/* Request Input */}
          <Textarea
            label={t('aiGenerator.requestLabel')}
            placeholder={t('aiGenerator.requestPlaceholder')}
            value={request}
            onChange={(event) => setRequest(event.currentTarget.value)}
            minRows={3}
            disabled={loading}
          />

          {/* Suggested Requests */}
          <div>
            <Title order={4} mb="md">
              💡 {t('aiGenerator.suggestedRequests')}:
            </Title>
            <Group gap="xs">
              {suggestedRequests.map((suggestion, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  size="sm"
                >
                  {suggestion}
                </Badge>
              ))}
            </Group>
          </div>

          {/* Generate Button */}
          <Group>
            <Button
              leftSection={loading ? <Loader size="sm" /> : <IconWand size={16} />}
              onClick={handleGenerate}
              disabled={loading || !request.trim()}
              size="md"
              style={{ minWidth: 200 }}
            >
              {loading ? t('aiGenerator.generating') : t('aiGenerator.generateButton')}
            </Button>
            
            {onClose && (
              <Button
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                {t('aiGenerator.cancel')}
              </Button>
            )}
          </Group>

          {/* Error Display */}
          {error && (
            <Alert color="red" title={t('aiGenerator.errorTitle')}>
              {error}
            </Alert>
          )}

          {/* Success Display */}
          {success && (
            <Alert color="green" title={t('aiGenerator.successTitle')}>
              {success}
            </Alert>
          )}

          {/* Generated Problem Preview */}
          {generatedProblem && (
            <Card withBorder mt="md">
              <Stack gap="md">
                <Title order={4} c={colorScheme === 'dark' ? 'blue.4' : 'blue.6'}>
                  🎉 {t('aiGenerator.previewTitle')}
                </Title>
                
                <Group>
                  <Title order={5}>
                    {generatedProblem.title[locale as keyof typeof generatedProblem.title] || generatedProblem.title.en}
                  </Title>
                  <Badge 
                    color={getDifficultyColor(generatedProblem.difficulty)}
                    size="sm"
                  >
                    {t(`homepage.difficulty.${generatedProblem.difficulty}`)}
                  </Badge>
                </Group>

                <Text size="sm" c="dimmed">
                  {generatedProblem.title[locale === 'zh' ? 'zh' : 'en']}
                </Text>

                <Group gap="xs">
                  {generatedProblem.tags.map((tag, index) => (
                    <Badge key={index} variant="light" size="xs">
                      {t(`tags.${tag}`) !== `tags.${tag}` ? t(`tags.${tag}`) : tag}
                    </Badge>
                  ))}
                </Group>

                <Box
                  style={{
                    maxHeight: 150,
                    overflow: 'auto',
                    border: `1px solid ${colorScheme === 'dark' ? '#373a40' : '#e9ecef'}`,
                    borderRadius: 4,
                    padding: 12,
                    backgroundColor: colorScheme === 'dark' ? '#2e2e2e' : '#f8f9fa'
                  }}
                >
                  <Text size="sm">
                    {generatedProblem.description[locale as keyof typeof generatedProblem.description] || generatedProblem.description.en}
                  </Text>
                </Box>

                <Text size="xs" c="dimmed">
                  {t('aiGenerator.problemId')}: {generatedProblem.id}
                </Text>
              </Stack>
            </Card>
          )}

          {/* Instructions */}
          <Card 
            withBorder 
            style={{ 
              backgroundColor: colorScheme === 'dark' ? '#1a365d' : '#e7f5ff'
            }}
          >
            <Stack gap="sm">
              <Title order={5}>
                📝 {t('aiGenerator.howToUse')}:
              </Title>
              <div style={{ fontSize: '14px' }}>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  <li>{t('aiGenerator.instruction1')}</li>
                  <li>{t('aiGenerator.instruction2')}</li>
                  <li>{t('aiGenerator.instruction3')}</li>
                  <li>{t('aiGenerator.instruction4')}</li>
                  <li>{t('aiGenerator.instruction5')}</li>
                </ul>
              </div>
            </Stack>
          </Card>
        </Stack>
      </Card>
    </Box>
  );
};

export default ProblemGenerator;