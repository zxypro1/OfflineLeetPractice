import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { AppShell, Container, Group, Title, Button, ActionIcon, Text } from '@mantine/core';
import { IconArrowLeft, IconBrain } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useTranslation, useI18n } from '../src/contexts/I18nContext';
import { LanguageThemeControls } from '../src/components/LanguageThemeControls';
import ProblemGenerator from '../src/components/ProblemGenerator';

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

const GeneratorPage: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { locale } = useI18n();
  const [lastGeneratedProblem, setLastGeneratedProblem] = useState<GeneratedProblem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleProblemGenerated = (problem: GeneratedProblem) => {
    setLastGeneratedProblem(problem);
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleTryProblem = () => {
    if (lastGeneratedProblem) {
      router.push(`/problems/${lastGeneratedProblem.id}`);
    }
  };

  if (!mounted) {
    return (
      <>
        <Head>
          <title>{t('aiGenerator.title')} - {t('header.title')}</title>
          <meta name="description" content={t('aiGenerator.subtitle')} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div>{t('common.loading')}</div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{t('aiGenerator.title')} - {t('header.title')}</title>
        <meta name="description" content={t('aiGenerator.subtitle')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <AppShell
        header={{ height: 70 }}
        padding="md"
      >
        {/* Header */}
        <AppShell.Header>
          <Container size="lg" h="100%">
            <Group h="100%" justify="space-between">
              <Group>
                <ActionIcon
                  variant="subtle"
                  onClick={handleBackToHome}
                  aria-label={t('aiGenerator.backToHome')}
                >
                  <IconArrowLeft size={18} />
                </ActionIcon>
                
                <IconBrain size={24} />
                <Title order={3}>
                  {t('aiGenerator.title')}
                </Title>
              </Group>

              <Group>
                {lastGeneratedProblem && (
                  <Button 
                    variant="outline"
                    onClick={handleTryProblem}
                  >
                    {t('aiGenerator.tryLastProblem')}
                  </Button>
                )}
                <LanguageThemeControls />
              </Group>
            </Group>
          </Container>
        </AppShell.Header>

        {/* Main Content */}
        <AppShell.Main>
          <Container size="lg" py="xl">
            <ProblemGenerator 
              onProblemGenerated={handleProblemGenerated}
            />
          </Container>

          {/* Footer */}
          <Container size="lg" py="md">
            <Text size="sm" ta="center" c="dimmed">
              {t('aiGenerator.poweredBy')} • {t('aiGenerator.unlimitedProblems')}
            </Text>
          </Container>
        </AppShell.Main>
      </AppShell>
    </>
  );
};

export default GeneratorPage;