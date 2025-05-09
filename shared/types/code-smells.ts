export type CodeSmell = {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
};