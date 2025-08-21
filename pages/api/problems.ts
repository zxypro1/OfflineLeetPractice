import { NextApiRequest, NextApiResponse } from 'next';
import problems from '../../problems/problems.json';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(problems);
}
