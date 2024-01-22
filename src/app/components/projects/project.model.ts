import { Collaborator } from '../collaboration/collaborator.model';
import { Issue } from '../issue/issue.model';

export type Project = {
  id: string;
  name: string;
  description: string;
  ownerName: string;
  issues: Issue[];
  collaborators: Collaborator[];
  issueMetrics?: {
    Completed: number;
    InProgress: number;
    NotStarted: number;
  };
};
