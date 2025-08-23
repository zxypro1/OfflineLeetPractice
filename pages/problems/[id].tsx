import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Title, 
  Paper, 
  Text, 
  Badge, 
  Group, 
  Stack, 
  Divider,
  Breadcrumbs,
  Anchor,
  Code,
  Button,
  Collapse,
  Loader,
  Alert,
  Center
} from '@mantine/core';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useTranslation, useI18n } from '../../src/contexts/I18nContext';
import { LanguageThemeControls } from '../../src/components/LanguageThemeControls';

const CodeRunner = dynamic(() => import('../../src/components/CodeRunner'), { ssr: false });

export default function ProblemPage() {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation();
  const { locale } = useI18n();
  const [showSolution, setShowSolution] = useState(false);
  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProblem = async () => {
      try {
        const response = await fetch('/api/problems');
        if (!response.ok) {
          throw new Error('Failed to fetch problems');
        }
        const problems = await response.json();
        const foundProblem = problems.find((p: any) => p.id === id);
        
        if (!foundProblem) {
          throw new Error('Problem not found');
        }
        
        setProblem(foundProblem);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load problem');
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);
  
  if (loading) {
    return (
      <Container fluid py={20}>
        <Container size="xl">
          <Group justify="flex-end" mb={10}>
            <LanguageThemeControls />
          </Group>
          <Center style={{ minHeight: '50vh' }}>
            <Stack align="center" gap={20}>
              <Loader size="lg" />
              <Text>{t('common.loading')}</Text>
            </Stack>
          </Center>
        </Container>
      </Container>
    );
  }

  if (error || !problem) {
    return (
      <Container fluid py={20}>
        <Container size="xl">
          <Group justify="flex-end" mb={10}>
            <LanguageThemeControls />
          </Group>
          <Center style={{ minHeight: '50vh' }}>
            <Alert color="red" title={t('common.error')}>
              {error || 'Problem not found'}
            </Alert>
          </Center>
        </Container>
      </Container>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'green';
      case 'Medium': return 'yellow';
      case 'Hard': return 'red';
      default: return 'gray';
    }
  };
  
  const breadcrumbItems = [
    { title: t('common.home'), href: '/' },
    { title: problem.title[locale as keyof typeof problem.title] || problem.title.zh, href: '#' }
  ].map((item, index) => (
    item.href === '#' ? (
      <Text key={index}>{item.title}</Text>
    ) : (
      <Anchor component={Link} href={item.href} key={index}>
        {item.title}
      </Anchor>
    )
  ));

  return (
    <Container fluid py={20}>
      <Container size="xl">
        {/* 语言和主题控件 */}
        <Group justify="flex-end" mb={10}>
          <LanguageThemeControls />
        </Group>
        
        <Breadcrumbs mb={20}>
          {breadcrumbItems}
        </Breadcrumbs>
        
        <Stack gap={20}>
          <Paper shadow="sm" p="md" withBorder>
            <Group justify="space-between" align="flex-start" mb={15}>
              <div>
                <Title order={2} mb={8}>
                  {problem.title[locale as keyof typeof problem.title] || problem.title.zh}
                </Title>
                {/* <Text color="dimmed" size="md">
                  {locale === 'zh' ? problem.title.en : problem.title.zh}
                </Text> */}
              </div>
              <Badge 
                color={getDifficultyColor(problem.difficulty)}
                variant="filled"
                size="lg"
              >
                {problem.difficulty}
              </Badge>
            </Group>
            
            <Group gap={8} mb={15}>
              {problem.tags?.map((tag: string) => (
                <Badge key={tag} color="blue" variant="light">
                  {t(`tags.${tag}`) !== `tags.${tag}` ? t(`tags.${tag}`) : tag}
                </Badge>
              ))}
            </Group>
          </Paper>

          <Grid gutter={20}>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap={15}>
                <Paper shadow="sm" p="md" withBorder>
                  <Title order={4} mb={15}>
                    📝 {t('problemPage.description')}
                  </Title>
                  <Text size="md" style={{ lineHeight: 1.6 }}>
                    {problem.description[locale as keyof typeof problem.description] || problem.description.zh}
                  </Text>
                </Paper>
                
                {problem.examples && (
                  <Paper shadow="sm" p="md" withBorder>
                    <Title order={4} mb={15}>
                      💡 {t('problemPage.examples')}
                    </Title>
                    <Stack gap={10}>
                      {problem.examples.map((example: any, index: number) => (
                        <div key={index}>
                          <Text size="sm" fw={500}>{t('problemPage.example')} {index + 1}:</Text>
                          <Code block mt={5}>
                            {t('problemPage.input')}: {example.input}
                            {"\n"}{t('problemPage.output')}: {example.output}
                          </Code>
                        </div>
                      ))}
                    </Stack>
                  </Paper>
                )}
                
                <Paper shadow="sm" p="md" withBorder>
                  <Group justify="space-between" align="center" mb={15}>
                    <Title order={4}>
                      🔍 {t('problemPage.solution')}
                    </Title>
                    <Button 
                      variant="light" 
                      size="sm"
                      onClick={() => setShowSolution(!showSolution)}
                    >
                      {showSolution ? t('problemPage.hideSolution') : t('problemPage.showSolution')}
                    </Button>
                  </Group>
                  <Collapse in={showSolution}>
                    <Code block style={{ fontSize: '0.9em' }}>
                      {problem.solution.js}
                    </Code>
                  </Collapse>
                  {!showSolution && (
                    <Text size="sm" c="dimmed" ta="center" py="xl">
                      {t('problemPage.solutionHidden')}
                    </Text>
                  )}
                </Paper>
              </Stack>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6 }}>
              <CodeRunner problem={problem} />
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </Container>
  );
}
