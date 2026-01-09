export type ViewMode = "list" | "editor";

export interface Note {
  id: number;
  title: string;
  content: string;
  folder: string;
  createdAt: string;
}
