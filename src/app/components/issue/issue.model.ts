export type Issue = {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  projectId: string;
  status: number;
  creatorName: string;
  creatorEmail: string;
};

export type IssueCreate = Pick<Issue, 'title' | 'description' | 'status'>;

export type IssueCreateWithid = IssueCreate & { id: string };
