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
  return (
    <Container size="xl" py={40}>
      <Center>
        <Stack gap={30}>
          <div>
            <Title order={1} ta="center" mb={10}>
              🚀 离线 LeetCode 练习
            </Title>
            <Text size="lg" c="dimmed" ta="center">
              本地题库，支持在浏览器内编辑并运行测试（JavaScript）
            </Text>
          </div>
          
          <Divider size="md" />
          
          <Text size="xl" fw={600} ta="center">
            📚 题目列表 ({problems.length} 题)
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
                    {problem.difficulty}
                  </Badge>
                </Group>
                
                <div>
                  <Title order={4} mb={8}>
                    {problem.title.zh}
                  </Title>
                  <Text size="sm" color="dimmed" mb={8}>
                    {problem.title.en}
                  </Text>
                  <Text size="xs" lineClamp={2}>
                    {problem.description.zh}
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
                      {tag}
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
