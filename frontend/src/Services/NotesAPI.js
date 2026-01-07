const BASE_URL = "http://localhost:5000/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// GET NOTES
export const fetchNotes = async () => {
  const res = await fetch(`${BASE_URL}/notes`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch notes");
  return res.json();
};

// CREATE NOTE
export const addNote = async (data) => {
  const res = await fetch(`${BASE_URL}/notes`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create note");
  return res.json();
};

// UPDATE NOTE
export const updateNote = async (id, data) => {
  const res = await fetch(`${BASE_URL}/notes/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update note");
  return res.json();
};

// DELETE NOTE
export const deleteNote = async (id) => {
  const res = await fetch(`${BASE_URL}/notes/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error("Failed to delete note");
  return res.json();
};
