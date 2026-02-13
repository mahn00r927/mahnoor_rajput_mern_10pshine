import { fetchWithAuth } from "./NotesAPI";

export const getNotes = () => fetchWithAuth("/notes");

export const createNote = (data: { title: string; content: string }) =>
  fetchWithAuth("/notes", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateNote = (id: string, data: any) =>
  fetchWithAuth(`/notes/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteNote = (id: string) =>
  fetchWithAuth(`/notes/${id}`, {
    method: "DELETE",
  });

  
