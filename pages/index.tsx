import Link from 'next/link';
import { GetStaticProps } from 'next';
import { Container, Title, List, Text } from '@mantine/core';

type Problem = {
  id: string;
  title: { en: string; zh: string };
  difficulty: string;
};

export const getStaticProps: GetStaticProps = async () => {
  const data = await import('../problems/problems.json');
  return { props: { problems: data.default } };
};

export default function Home({ problems }: { problems: Problem[] }) {
  return (
    <Container size="md" style={{ padding: 20 }}>
      <Title order={2}>离线 LeetCode 练习</Title>
      <Text size="sm">本地题库，支持在浏览器内编辑并运行测试（JS）</Text>
      <List>
        {problems.map((p) => (
          <List.Item key={p.id}>
            <Link href={`/problems/${p.id}`}>{p.title.zh} · {p.difficulty}</Link>
          </List.Item>
        ))}
      </List>
    </Container>
  );
}
