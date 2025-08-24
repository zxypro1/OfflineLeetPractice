import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check what providers are configured
    const isOllamaConfigured = !!process.env.OLLAMA_ENDPOINT || !!process.env.OLLAMA_MODEL;
    const isDeepSeekConfigured = !!process.env.DEEPSEEK_API_KEY;
    const isOpenAIConfigured = !!process.env.OPENAI_API_KEY;
    const isQwenConfigured = !!process.env.QWEN_API_KEY;
    const isClaudeConfigured = !!process.env.CLAUDE_API_KEY;
    
    return res.status(200).json({
      providers: {
        ollama: isOllamaConfigured,
        deepseek: isDeepSeekConfigured,
        openai: isOpenAIConfigured,
        qwen: isQwenConfigured,
        claude: isClaudeConfigured
      }
    });
  } catch (error) {
    console.error('Error checking AI provider configuration:', error);
    return res.status(500).json({ error: 'Failed to check AI provider configuration' });
  }
}