export interface TTask {
  id: number;
  title: string;
  status: string;
  description: string;
  dueDate: string;
  userId: string;
  user?: any;
  createAt: string;
  updateAt: string;
}
