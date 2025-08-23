import { GetStaticPaths, GetStaticProps } from 'next';
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
  Code
} from '@mantine/core';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const CodeRunner = dynamic(() => import('../../src/components/CodeRunner'), { ssr: false });

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await import('../../problems/problems.json');
  const paths = data.default.map((p: any) => ({ params: { id: p.id } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const id = ctx.params?.id as string;
  const data = await import('../../problems/problems.json');
  const prob = data.default.find((p: any) => p.id === id);
  return { props: { problem: prob } };
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy': return 'green';
    case 'Medium': return 'yellow';
    case 'Hard': return 'red';
    default: return 'gray';
  }
};

export default function ProblemPage({ problem }: any) {
  const breadcrumbItems = [
    { title: '首页', href: '/' },
    { title: problem.title.zh, href: '#' }
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
        <Breadcrumbs mb={20}>
          {breadcrumbItems}
        </Breadcrumbs>
        
        <Stack gap={20}>
          <Paper shadow="sm" p="md" withBorder>
            <Group justify="space-between" align="flex-start" mb={15}>
              <div>
                <Title order={2} mb={8}>
                  {problem.title.zh}
                </Title>
                <Text color="dimmed" size="md">
                  {problem.title.en}
                </Text>
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
                  {tag}
                </Badge>
              ))}
            </Group>
          </Paper>

          <Grid gutter={20}>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap={15}>
                <Paper shadow="sm" p="md" withBorder>
                  <Title order={4} mb={15}>
                    📝 题目描述
                  </Title>
                  <Text size="md" style={{ lineHeight: 1.6 }}>
                    {problem.description.zh}
                  </Text>
                </Paper>
                
                {problem.examples && (
                  <Paper shadow="sm" p="md" withBorder>
                    <Title order={4} mb={15}>
                      💡 示例
                    </Title>
                    <Stack gap={10}>
                      {problem.examples.map((example: any, index: number) => (
                        <div key={index}>
                          <Text size="sm" fw={500}>示例 {index + 1}:</Text>
                          <Code block mt={5}>
                            输入: {example.input}
                            {"\n"}输出: {example.output}
                          </Code>
                        </div>
                      ))}
                    </Stack>
                  </Paper>
                )}
                
                <Paper shadow="sm" p="md" withBorder>
                  <Title order={4} mb={15}>
                    🔍 参考解法
                  </Title>
                  <Code block style={{ fontSize: '0.9em' }}>
                    {problem.solution.js}
                  </Code>
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
