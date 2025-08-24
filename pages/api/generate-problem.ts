import { NextApiRequest, NextApiResponse } from 'next';
import * as fs from 'fs';
import * as path from 'path';

interface Problem {
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
  examples: Array<{
    input: string;
    output: string;
  }>;
  template: {
    js: string;
    python: string;
    java: string;
    cpp: string;
    c: string;
  };
  solution: {
    js: string;
  };
  solutions: Array<{
    title: {
      en: string;
      zh: string;
    };
    content: {
      en: string;
      zh: string;
    };
  }>;
  tests: Array<{
    input: string;
    output: string;
  }>;
}

// Function to call DeepSeek API with configurable model
async function callDeepSeekAPI(prompt: string): Promise<any> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
  
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY environment variable is not set');
  }

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content: `You are an expert LeetCode problem generator. Generate high-quality coding problems in the exact JSON format specified. The problem should be original, well-designed, and include comprehensive test cases.

CRITICAL REQUIREMENTS:
1. Return ONLY valid JSON, no additional text or explanations
2. Use kebab-case for the problem ID (e.g., "dynamic-programming-example")
3. Include complete templates for all 5 languages (js, python, java, cpp, c)
4. Provide a working JavaScript solution
5. Include at least 4-5 comprehensive test cases covering edge cases
6. Ensure the problem is solvable and well-defined
7. CRITICAL: ESCAPE ALL special characters properly in JSON strings:
   - Newlines MUST be written as \\n (not actual newlines)
   - Quotes MUST be written as \\\" (not actual quotes)
   - Backslashes MUST be written as \\\\
   - Tabs MUST be written as \\t
8. Make sure all test cases pass with the provided solution
9. Include at least 2 detailed solution explanations in the "solutions" array with markdown formatting
10. ENSURE ALL solutions in the "solutions" array contain COMPLETE working code examples with proper syntax
11. Each solution should have a title and content in both English and Chinese
12. Solutions should include algorithm overview, time/space complexity analysis, implementation, step-by-step explanation, and examples
13. Double-check that your JSON is valid before returning it - parse it to verify`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Function to call OpenAI API
async function callOpenAIAPI(prompt: string): Promise<any> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || 'gpt-4-turbo';
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content: `You are an expert LeetCode problem generator. Generate high-quality coding problems in the exact JSON format specified. The problem should be original, well-designed, and include comprehensive test cases.

CRITICAL REQUIREMENTS:
1. Return ONLY valid JSON, no additional text or explanations
2. Use kebab-case for the problem ID (e.g., "dynamic-programming-example")
3. Include complete templates for all 5 languages (js, python, java, cpp, c)
4. Provide a working JavaScript solution
5. Include at least 4-5 comprehensive test cases covering edge cases
6. Ensure the problem is solvable and well-defined
7. CRITICAL: ESCAPE ALL special characters properly in JSON strings:
   - Newlines MUST be written as \\n (not actual newlines)
   - Quotes MUST be written as \\\" (not actual quotes)
   - Backslashes MUST be written as \\\\
   - Tabs MUST be written as \\t
8. Make sure all test cases pass with the provided solution
9. Include at least 2 detailed solution explanations in the "solutions" array with markdown formatting
10. ENSURE ALL solutions in the "solutions" array contain COMPLETE working code examples with proper syntax
11. Each solution should have a title and content in both English and Chinese
12. Solutions should include algorithm overview, time/space complexity analysis, implementation, step-by-step explanation, and examples
13. Double-check that your JSON is valid before returning it - parse it to verify`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Function to call Qwen API
async function callQwenAPI(prompt: string): Promise<any> {
  const apiKey = process.env.QWEN_API_KEY;
  const model = process.env.QWEN_MODEL || 'qwen-turbo';
  
  if (!apiKey) {
    throw new Error('QWEN_API_KEY environment variable is not set');
  }

  const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'X-DashScope-SSE': 'enable',
    },
    body: JSON.stringify({
      model: model,
      input: {
        messages: [
          {
            role: 'system',
            content: `You are an expert LeetCode problem generator. Generate high-quality coding problems in the exact JSON format specified. The problem should be original, well-designed, and include comprehensive test cases.

CRITICAL REQUIREMENTS:
1. Return ONLY valid JSON, no additional text or explanations
2. Use kebab-case for the problem ID (e.g., "dynamic-programming-example")
3. Include complete templates for all 5 languages (js, python, java, cpp, c)
4. Provide a working JavaScript solution
5. Include at least 4-5 comprehensive test cases covering edge cases
6. Ensure the problem is solvable and well-defined
7. CRITICAL: ESCAPE ALL special characters properly in JSON strings:
   - Newlines MUST be written as \\n (not actual newlines)
   - Quotes MUST be written as \\\" (not actual quotes)
   - Backslashes MUST be written as \\\\
   - Tabs MUST be written as \\t
8. Make sure all test cases pass with the provided solution
9. Include at least 2 detailed solution explanations in the "solutions" array with markdown formatting
10. ENSURE ALL solutions in the "solutions" array contain COMPLETE working code examples with proper syntax
11. Each solution should have a title and content in both English and Chinese
12. Solutions should include algorithm overview, time/space complexity analysis, implementation, step-by-step explanation, and examples
13. Double-check that your JSON is valid before returning it - parse it to verify`
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      parameters: {
        temperature: 0.7,
        max_tokens: 4000,
      }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Qwen API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.output.text;
}

// Function to call Claude API
async function callClaudeAPI(prompt: string): Promise<any> {
  const apiKey = process.env.CLAUDE_API_KEY;
  const model = process.env.CLAUDE_MODEL || 'claude-3-haiku-20240307';
  
  if (!apiKey) {
    throw new Error('CLAUDE_API_KEY environment variable is not set');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'user',
          content: `You are an expert LeetCode problem generator. Generate high-quality coding problems in the exact JSON format specified. The problem should be original, well-designed, and include comprehensive test cases.

CRITICAL REQUIREMENTS:
1. Return ONLY valid JSON, no additional text or explanations
2. Use kebab-case for the problem ID (e.g., "dynamic-programming-example")
3. Include complete templates for all 5 languages (js, python, java, cpp, c)
4. Provide a working JavaScript solution
5. Include at least 4-5 comprehensive test cases covering edge cases
6. Ensure the problem is solvable and well-defined
7. CRITICAL: ESCAPE ALL special characters properly in JSON strings:
   - Newlines MUST be written as \\n (not actual newlines)
   - Quotes MUST be written as \\\" (not actual quotes)
   - Backslashes MUST be written as \\\\
   - Tabs MUST be written as \\t
8. Make sure all test cases pass with the provided solution
9. Include at least 2 detailed solution explanations in the "solutions" array with markdown formatting
10. ENSURE ALL solutions in the "solutions" array contain COMPLETE working code examples with proper syntax
11. Each solution should have a title and content in both English and Chinese
12. Solutions should include algorithm overview, time/space complexity analysis, implementation, step-by-step explanation, and examples
13. Double-check that your JSON is valid before returning it - parse it to verify

${prompt}`
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

// New function to call Ollama API
async function callOllamaAPI(prompt: string): Promise<any> {
  const ollamaEndpoint = process.env.OLLAMA_ENDPOINT || 'http://localhost:11434';
  const ollamaModel = process.env.OLLAMA_MODEL || 'llama3';

  const response = await fetch(`${ollamaEndpoint}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: ollamaModel,
      messages: [
        {
          role: 'system',
          content: `You are an expert LeetCode problem generator. Generate high-quality coding problems in the exact JSON format specified. The problem should be original, well-designed, and include comprehensive test cases.

CRITICAL REQUIREMENTS:
1. Return ONLY valid JSON, no additional text or explanations
2. Use kebab-case for the problem ID (e.g., "dynamic-programming-example")
3. Include complete templates for all 5 languages (js, python, java, cpp, c)
4. Provide a working JavaScript solution
5. Include at least 4-5 comprehensive test cases covering edge cases
6. Ensure the problem is solvable and well-defined
7. CRITICAL: ESCAPE ALL special characters properly in JSON strings:
   - Newlines MUST be written as \\n (not actual newlines)
   - Quotes MUST be written as \\\" (not actual quotes)
   - Backslashes MUST be written as \\\\
   - Tabs MUST be written as \\t
8. Make sure all test cases pass with the provided solution
9. Include at least 2 detailed solution explanations in the "solutions" array with markdown formatting
10. ENSURE ALL solutions in the "solutions" array contain COMPLETE working code examples with proper syntax
11. Each solution should have a title and content in both English and Chinese
12. Solutions should include algorithm overview, time/space complexity analysis, implementation, step-by-step explanation, and examples
13. Double-check that your JSON is valid before returning it - parse it to verify`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      stream: false,
      options: {
        temperature: 0.7,
      }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.message.content;
}

function generatePrompt(userRequest: string): string {
  return `Generate a LeetCode-style coding problem based on this request: "${userRequest}"

Return the response in this EXACT JSON format with proper escaping:

{
  "id": "problem-id-in-kebab-case",
  "title": {
    "en": "Problem Title in English",
    "zh": "中文问题标题"
  },
  "difficulty": "Easy|Medium|Hard",
  "tags": ["tag1", "tag2", "tag3"],
  "description": {
    "en": "Detailed problem description in English with clear requirements and constraints. MUST escape all special characters: newlines as \\n, quotes as \\\"", 
    "zh": "详细的中文问题描述，包含清晰的要求和约束条件。必须转义所有特殊字符：换行符为\\n，引号为\\\""
  },
  "examples": [
    {
      "input": "example input format",
      "output": "example output format"
    }
  ],
  "template": {
    "js": "function functionName(param) {\\n  // write your code here\\n}\\nmodule.exports = functionName;",
    "python": "def function_name(param):\\n    # write your code here\\n    pass",
    "java": "public class Solution {\\n    public ReturnType functionName(ParamType param) {\\n        // write your code here\\n        return null;\\n    }\\n}",
    "cpp": "#include <vector>\\n#include <algorithm>\\nusing namespace std;\\n\\nclass Solution {\\npublic:\\n    ReturnType functionName(ParamType param) {\\n        // write your code here\\n        return {};\\n    }\\n};",
    "c": "#include <stdio.h>\\n#include <stdlib.h>\\n\\nReturnType functionName(ParamType param) {\\n    // write your code here\\n    return 0;\\n}"
  },
  "solutions": [
    {
      "title": {
        "en": "Solution Approach Title",
        "zh": "解法标题"
      },
      "content": {
        "en": "Detailed explanation of the solution approach in English with code examples, complexity analysis, and step-by-step walkthrough. MUST escape all special characters: newlines as \\n, quotes as \\\"", 
        "zh": "详细的解法说明，包含中文的代码示例、复杂度分析和逐步演示。必须转义所有特殊字符：换行符为\\n，引号为\\\""
      }
    }
  ],
  "tests": [
    {
      "input": "test input in JSON format",
      "output": "expected output in JSON format"
    }
  ]
}

CRITICAL INSTRUCTIONS - READ CAREFULLY:
1. Return ONLY valid JSON with no additional text or explanations
2. ESCAPE ALL special characters properly:
   - Newlines MUST be written as \\n (not actual newlines)
   - Quotes MUST be written as \\\" (not actual quotes)
   - Backslashes MUST be written as \\\\
   - Tabs MUST be written as \\t
3. Use kebab-case for the problem ID (e.g., "dynamic-programming-example")
4. Include comprehensive test cases that cover edge cases
5. The JavaScript solution must work correctly with all test cases
6. Include at least 2 detailed solution explanations with code examples
7. ENSURE ALL solutions in the "solutions" array contain COMPLETE working code examples with proper syntax
8. Each solution should have a title and content in both English and Chinese
9. Solutions should include algorithm overview, time/space complexity analysis, implementation, step-by-step explanation, and examples
10. Ensure the problem is solvable and well-defined
11. Double-check that your JSON is valid before returning it

Example of properly escaped content:
"description": {
  "en": "This is a multi-line\\ndescription with \\"quotes\\" and special characters.",
  "zh": "这是一个多行\\n描述，包含\\"引号\\"和特殊字符。"
}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { request, aiProvider } = req.body;

    if (!request || typeof request !== 'string') {
      return res.status(400).json({ error: 'Request description is required' });
    }

    // Check what providers are configured
    const isOllamaConfigured = !!process.env.OLLAMA_ENDPOINT || !!process.env.OLLAMA_MODEL;
    const isDeepSeekConfigured = !!process.env.DEEPSEEK_API_KEY;
    const isOpenAIConfigured = !!process.env.OPENAI_API_KEY;
    const isQwenConfigured = !!process.env.QWEN_API_KEY;
    const isClaudeConfigured = !!process.env.CLAUDE_API_KEY;
    
    // If a specific provider is requested, validate it's configured
    if (aiProvider) {
      if (aiProvider === 'ollama' && !isOllamaConfigured) {
        return res.status(400).json({ error: 'Ollama is not configured. Please check your environment variables.' });
      }
      
      if (aiProvider === 'deepseek' && !isDeepSeekConfigured) {
        return res.status(400).json({ error: 'DeepSeek API key is not configured. Please check your environment variables.' });
      }
      
      if (aiProvider === 'openai' && !isOpenAIConfigured) {
        return res.status(400).json({ error: 'OpenAI API key is not configured. Please check your environment variables.' });
      }
      
      if (aiProvider === 'qwen' && !isQwenConfigured) {
        return res.status(400).json({ error: 'Qwen API key is not configured. Please check your environment variables.' });
      }
      
      if (aiProvider === 'claude' && !isClaudeConfigured) {
        return res.status(400).json({ error: 'Claude API key is not configured. Please check your environment variables.' });
      }
    }
    
    // If no provider is specified, auto-select based on what's available
    let useOllama: boolean;
    let useDeepSeek: boolean;
    let useOpenAI: boolean;
    let useQwen: boolean;
    let useClaude: boolean;
    
    if (aiProvider === 'ollama') {
      useOllama = true;
      useDeepSeek = false;
      useOpenAI = false;
      useQwen = false;
      useClaude = false;
    } else if (aiProvider === 'deepseek') {
      useOllama = false;
      useDeepSeek = true;
      useOpenAI = false;
      useQwen = false;
      useClaude = false;
    } else if (aiProvider === 'openai') {
      useOllama = false;
      useDeepSeek = false;
      useOpenAI = true;
      useQwen = false;
      useClaude = false;
    } else if (aiProvider === 'qwen') {
      useOllama = false;
      useDeepSeek = false;
      useOpenAI = false;
      useQwen = true;
      useClaude = false;
    } else if (aiProvider === 'claude') {
      useOllama = false;
      useDeepSeek = false;
      useOpenAI = false;
      useQwen = false;
      useClaude = true;
    } else {
      // Auto-select logic: prefer in order - Ollama, OpenAI, Claude, Qwen, DeepSeek
      if (isOllamaConfigured) {
        useOllama = true;
        useDeepSeek = false;
        useOpenAI = false;
        useQwen = false;
        useClaude = false;
      } else if (isOpenAIConfigured) {
        useOllama = false;
        useDeepSeek = false;
        useOpenAI = true;
        useQwen = false;
        useClaude = false;
      } else if (isClaudeConfigured) {
        useOllama = false;
        useDeepSeek = false;
        useOpenAI = false;
        useQwen = false;
        useClaude = true;
      } else if (isQwenConfigured) {
        useOllama = false;
        useDeepSeek = false;
        useOpenAI = false;
        useQwen = true;
        useClaude = false;
      } else if (isDeepSeekConfigured) {
        useOllama = false;
        useDeepSeek = true;
        useOpenAI = false;
        useQwen = false;
        useClaude = false;
      } else {
        return res.status(400).json({ 
          error: 'No AI provider is configured. Please configure one of the supported AI providers in your environment variables.' 
        });
      }
    }

    // Generate the problem using the selected AI provider
    const prompt = generatePrompt(request);
    let generatedContent: string;

    if (useOllama) {
      generatedContent = await callOllamaAPI(prompt);
    } else if (useDeepSeek) {
      generatedContent = await callDeepSeekAPI(prompt);
    } else if (useOpenAI) {
      generatedContent = await callOpenAIAPI(prompt);
    } else if (useQwen) {
      generatedContent = await callQwenAPI(prompt);
    } else if (useClaude) {
      generatedContent = await callClaudeAPI(prompt);
    } else {
      return res.status(500).json({ error: 'No valid AI provider configured' });
    }

    // Parse the generated JSON
    let problemData: Problem;
    try {
      problemData = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse generated JSON:', generatedContent, parseError);
      return res.status(500).json({ 
        error: 'Failed to parse generated problem data',
        details: generatedContent
      });
    }

    // Validate the generated problem structure
    const requiredFields = ['id', 'title', 'difficulty', 'tags', 'description', 'examples', 'template', 'solution', 'tests'];
    for (const field of requiredFields) {
      if (!problemData[field as keyof Problem]) {
        return res.status(500).json({ 
          error: `Generated problem is missing required field: ${field}`,
          problemData
        });
      }
    }

    // Load existing problems
    const problemsPath = path.join(process.cwd(), 'public', 'problems.json');
    let existingProblems: Problem[] = [];
    
    try {
      const problemsContent = fs.readFileSync(problemsPath, 'utf8');
      existingProblems = JSON.parse(problemsContent);
    } catch (error) {
      console.error('Error reading problems.json:', error);
      return res.status(500).json({ error: 'Failed to read existing problems' });
    }

    // Check if problem ID already exists
    const existingProblem = existingProblems.find(p => p.id === problemData.id);
    if (existingProblem) {
      // Generate a unique ID by appending a number
      let counter = 1;
      let newId = `${problemData.id}-${counter}`;
      while (existingProblems.find(p => p.id === newId)) {
        counter++;
        newId = `${problemData.id}-${counter}`;
      }
      problemData.id = newId;
    }

    // Add the new problem to the list
    existingProblems.push(problemData);

    // Write back to problems.json
    try {
      fs.writeFileSync(problemsPath, JSON.stringify(existingProblems, null, 2), 'utf8');
    } catch (error) {
      console.error('Error writing problems.json:', error);
      return res.status(500).json({ error: 'Failed to save new problem' });
    }

    return res.status(200).json({
      success: true,
      problem: problemData,
      message: `Successfully generated and added problem: ${problemData.title.en}`
    });

  } catch (error) {
    console.error('Error generating problem:', error);
    return res.status(500).json({ 
      error: 'Failed to generate problem',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}