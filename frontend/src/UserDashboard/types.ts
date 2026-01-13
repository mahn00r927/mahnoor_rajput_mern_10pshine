export type ViewMode = "list" | "editor";

export interface Note {
  _id: string;
  title: string;
  content: string;

  // optional fields (backend safe)
  folder?: string;
  createdAt?: string;
  updatedAt?: string;
}
