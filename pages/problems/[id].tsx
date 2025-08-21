import { GetStaticPaths, GetStaticProps } from 'next';
import { Container, Grid, Title, Paper, Text } from '@mantine/core';
import dynamic from 'next/dynamic';

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

export default function ProblemPage({ problem }: any) {
  return (
    <Container fluid style={{ padding: 16 }}>
      <Title order={3}>{problem.title.zh} · {problem.difficulty}</Title>
      <Grid>
        <Grid.Col span={6}>
          <Paper padding="md">
            <Text>{problem.description.zh}</Text>
            <Title order={5} style={{ marginTop: 12 }}>解法（参考）</Title>
            <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>{problem.solution.js}</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={6}>
          <CodeRunner problem={problem} />
        </Grid.Col>
      </Grid>
    </Container>
  );
}
