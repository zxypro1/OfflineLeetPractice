import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

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
  tests: Array<{
    input: string;
    output: string;
  }>;
}

async function callDeepSeekAPI(prompt: string): Promise<any> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  
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
      model: 'deepseek-chat',
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
7. Use proper escape sequences in strings (\\n for newlines, \\" for quotes)
8. Make sure all test cases pass with the provided solution`
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

function generatePrompt(userRequest: string): string {
  return `Generate a LeetCode-style coding problem based on this request: "${userRequest}"

Return the response in this EXACT JSON format:

{
  "id": "problem-id-in-kebab-case",
  "title": {
    "en": "Problem Title in English",
    "zh": "中文问题标题"
  },
  "difficulty": "Easy|Medium|Hard",
  "tags": ["tag1", "tag2", "tag3"],
  "description": {
    "en": "Detailed problem description in English with clear requirements and constraints.",
    "zh": "详细的中文问题描述，包含清晰的要求和约束条件。"
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
  "solution": {
    "js": "function functionName(param) {\\n  // Complete working solution\\n  return result;\\n}\\nmodule.exports = functionName;"
  },
  "tests": [
    {
      "input": "test input in JSON format",
      "output": "expected output in JSON format"
    }
  ]
}

Requirements:
- Create an original, well-designed problem that matches the user's request
- Ensure the difficulty level is appropriate
- Include comprehensive test cases that cover edge cases
- The JavaScript solution must work correctly with all test cases
- Use proper programming concepts and algorithms
- Make the problem educational and interesting`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { request } = req.body;

    if (!request || typeof request !== 'string') {
      return res.status(400).json({ error: 'Request description is required' });
    }

    // Generate the problem using DeepSeek
    const prompt = generatePrompt(request);
    const generatedContent = await callDeepSeekAPI(prompt);

    // Parse the generated JSON
    let problemData: Problem;
    try {
      problemData = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse generated JSON:', generatedContent);
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