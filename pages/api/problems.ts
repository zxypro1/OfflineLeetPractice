import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Read problems.json from public folder at runtime
    const problemsPath = path.join(process.cwd(), 'public', 'problems.json');
    const problemsData = fs.readFileSync(problemsPath, 'utf8');
    const problems = JSON.parse(problemsData);
    
    res.status(200).json(problems);
  } catch (error) {
    console.error('Error reading problems.json:', error);
    res.status(500).json({ error: 'Failed to load problems' });
  }
}
