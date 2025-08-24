import React from 'react';
import { Text, Code, Title, Stack, Divider, List } from '@mantine/core';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Simple markdown parser for basic formatting
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: React.ReactNode[] = [];
    let codeBlock = false;
    let codeLines: string[] = [];
    let codeLanguage = '';

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <List key={`list-${elements.length}`} mb="md">
            {currentList.map((item, index) => (
              <List.Item key={index}>{item}</List.Item>
            ))}
          </List>
        );
        currentList = [];
      }
    };

    const flushCodeBlock = () => {
      if (codeLines.length > 0) {
        elements.push(
          <Code key={`code-${elements.length}`} block mb="md">
            {codeLines.join('\n')}
          </Code>
        );
        codeLines = [];
        codeBlock = false;
        codeLanguage = '';
      }
    };

    lines.forEach((line, index) => {
      // Handle code blocks
      if (line.startsWith('```')) {
        if (codeBlock) {
          flushCodeBlock();
        } else {
          flushList();
          codeBlock = true;
          codeLanguage = line.substring(3).trim();
        }
        return;
      }

      if (codeBlock) {
        codeLines.push(line);
        return;
      }

      // Handle headers
      if (line.startsWith('# ')) {
        flushList();
        elements.push(
          <Title key={`h1-${index}`} order={1} mb="md" mt="lg">
            {formatInlineText(line.substring(2))}
          </Title>
        );
      } else if (line.startsWith('## ')) {
        flushList();
        elements.push(
          <Title key={`h2-${index}`} order={2} mb="md" mt="lg">
            {formatInlineText(line.substring(3))}
          </Title>
        );
      } else if (line.startsWith('### ')) {
        flushList();
        elements.push(
          <Title key={`h3-${index}`} order={3} mb="md" mt="md">
            {formatInlineText(line.substring(4))}
          </Title>
        );
      } else if (line.startsWith('#### ')) {
        flushList();
        elements.push(
          <Title key={`h4-${index}`} order={4} mb="sm" mt="md">
            {formatInlineText(line.substring(5))}
          </Title>
        );
      } else if (line.startsWith('---')) {
        flushList();
        elements.push(<Divider key={`hr-${index}`} my="lg" />);
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        currentList.push(formatInlineText(line.substring(2)));
      } else if (line.trim() === '') {
        flushList();
        if (elements.length > 0 && elements[elements.length - 1] !== null) {
          elements.push(<div key={`br-${index}`} style={{ height: '8px' }} />);
        }
      } else {
        flushList();
        // Handle inline formatting
        const formattedLine = formatInlineText(line);
        elements.push(
          <Text key={`p-${index}`} mb="sm" style={{ lineHeight: 1.6 }}>
            {formattedLine}
          </Text>
        );
      }
    });

    flushList();
    flushCodeBlock();

    return elements;
  };

  const formatInlineText = (text: string) => {
    // Handle inline code
    text = text.replace(/`([^`]+)`/g, (_, code) => `<code>${code}</code>`);
    
    // Handle bold text
    text = text.replace(/\*\*([^*]+)\*\*/g, (_, bold) => `<strong>${bold}</strong>`);
    
    // Handle italic text
    text = text.replace(/\*([^*]+)\*/g, (_, italic) => `<em>${italic}</em>`);

    // Convert back to JSX elements
    const parts = text.split(/(<code>.*?<\/code>|<strong>.*?<\/strong>|<em>.*?<\/em>)/);
    
    return parts.map((part, index) => {
      if (part.startsWith('<code>') && part.endsWith('</code>')) {
        return (
          <Code key={index} color="blue">
            {part.substring(6, part.length - 7)}
          </Code>
        );
      } else if (part.startsWith('<strong>') && part.endsWith('</strong>')) {
        return (
          <strong key={index}>
            {part.substring(8, part.length - 9)}
          </strong>
        );
      } else if (part.startsWith('<em>') && part.endsWith('</em>')) {
        return (
          <em key={index}>
            {part.substring(4, part.length - 5)}
          </em>
        );
      }
      return part;
    });
  };

  return (
    <Stack gap="xs">
      {parseMarkdown(content)}
    </Stack>
  );
};

export default MarkdownRenderer;