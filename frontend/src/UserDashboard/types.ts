export type ViewMode = "list" | "editor";

export interface Note {
  _id: string;
  title: string;
  content: string;

  folder?: string;
  createdAt?: string;
  updatedAt?: string;
}
