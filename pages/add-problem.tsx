import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Container, AppShell, Title, Button, Group } from '@mantine/core';
import { useTranslation } from '../src/contexts/I18nContext';
import ProblemForm from '../src/components/ProblemForm';

const AddProblem: React.FC = () => {
  const { t } = useTranslation();

  return (
    <AppShell header={{ height: 64 }}>
      <Head>
        <title>{t('addProblem.title')} - {t('header.title')}</title>
        <meta name="description" content="Add new coding problems to the practice system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppShell.Header>
        <Container size="xl" h="100%">
          <Group h="100%" justify="space-between">
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Title order={3} c="var(--mantine-color-text)">
                {t('header.title')}
              </Title>
            </Link>
            <Button component={Link} href="/" variant="subtle">
              {t('addProblem.backToProblems')}
            </Button>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="xl" py="xl">
          <ProblemForm />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

export default AddProblem;