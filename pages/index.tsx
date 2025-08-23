import Link from 'next/link';
import { GetStaticProps } from 'next';
import { 
  Container, 
  Title, 
  Text, 
  Card, 
  Group, 
  Badge, 
  Grid, 
  Stack,
  Center,
  Divider
} from '@mantine/core';
import { useTranslation, useI18n } from '../src/contexts/I18nContext';
import { LanguageThemeControls } from '../src/components/LanguageThemeControls'

type Problem = {
  id: string;
  title: { en: string; zh: string };
  difficulty: string;
  tags: string[];
  description: { en: string; zh: string };
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy': return 'green';
    case 'Medium': return 'yellow';
    case 'Hard': return 'red';
    default: return 'gray';
  }
};

export const getStaticProps: GetStaticProps = async () => {
  const data = await import('../problems/problems.json');
  return { props: { problems: data.default } };
};

export default function Home({ problems }: { problems: Problem[] }) {
  const { t } = useTranslation();
  const { locale } = useI18n();

  return (
    <Container size="xl" py={40}>
      {/* 语言和主题控件 */}
      <Group justify="flex-end" mb={20}>
        <LanguageThemeControls />
      </Group>
      
      <Center>
        <Stack gap={30}>
          <div>
            <Title order={1} ta="center" mb={10}>
              {t('homepage.title')}
            </Title>
            <Text size="lg" c="dimmed" ta="center">
              {t('homepage.subtitle')}
            </Text>
          </div>
          
          <Divider size="md" />
          
          <Text size="xl" fw={600} ta="center">
            {t('homepage.problemList')} ({problems.length} {t('homepage.problems')})
          </Text>
        </Stack>
      </Center>
      
      <Grid mt={40}>
        {problems.map((problem) => (
          <Grid.Col key={problem.id} span={{ base: 12, sm: 6, lg: 4 }}>
            <Card 
              shadow="sm" 
              padding="lg" 
              radius="md" 
              withBorder
              style={{ height: '100%', cursor: 'pointer', transition: 'all 0.2s ease' }}
              component={Link}
              href={`/problems/${problem.id}`}
            >
              <Stack gap={12}>
                <Group justify="space-between" align="flex-start">
                  <Badge 
                    color={getDifficultyColor(problem.difficulty)}
                    variant="filled"
                    size="sm"
                  >
                    {t(`homepage.difficulty.${problem.difficulty}`)}
                  </Badge>
                </Group>
                
                <div>
                  <Title order={4} mb={8}>
                    {problem.title[locale as keyof typeof problem.title] || problem.title.zh}
                  </Title>
                  {/* <Text size="sm" c="dimmed" mb={8}>
                    {locale === 'zh' ? problem.title.en : problem.title.zh}
                  </Text> */}
                  <Text size="xs" lineClamp={2}>
                    {problem.description[locale as keyof typeof problem.description] || problem.description.zh}
                  </Text>
                </div>
                
                <Group gap={4}>
                  {problem.tags?.slice(0, 3).map((tag) => (
                    <Badge 
                      key={tag} 
                      color="blue" 
                      variant="light" 
                      size="xs"
                    >
                      {t(`tags.${tag}`) !== `tags.${tag}` ? t(`tags.${tag}`) : tag}
                    </Badge>
                  ))}
                  {problem.tags?.length > 3 && (
                    <Badge color="gray" variant="light" size="xs">
                      +{problem.tags.length - 3}
                    </Badge>
                  )}
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}
