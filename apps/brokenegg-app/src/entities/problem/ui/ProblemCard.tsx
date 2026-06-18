import type { Problem } from '../model/types';

interface ProblemCardProps {
  problem: Problem;
}

export function ProblemCard({ problem }: ProblemCardProps) {
  return (
    <div className="problem-card">
      <span className="num">{problem.num}</span>
      <h3>{problem.title}</h3>
      <p>{problem.body}</p>
    </div>
  );
}
