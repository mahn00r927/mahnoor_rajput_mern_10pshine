import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import NotesList from "./../UserDashboard/NotesList";
import type { Note } from "./../UserDashboard/types";

describe("NotesList Component", () => {
  const sampleNotes: Note[] = [
    {
      _id: "1",
      title: "Note 1",
      content: "<p>Content 1</p>",
      folder: "Folder A",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "2",
      title: "Note 2",
      content: "<p>Content 2</p>",
      folder: "Folder B",
      createdAt: new Date().toISOString(),
    },
  ];

  it("renders 'No notes yet' when notes list is empty", () => {
    const onNew = vi.fn();
    render(
      <NotesList
        notes={[]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onNew={onNew}
        setNotes={vi.fn()}
      />
    );

    expect(screen.getByText("No notes yet")).toBeInTheDocument();
    const createBtn = screen.getByText("+ Create Note");
    expect(createBtn).toBeInTheDocument();

    fireEvent.click(createBtn);
    expect(onNew).toHaveBeenCalled();
  });

  it("renders notes correctly", () => {
    render(
      <NotesList
        notes={sampleNotes}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onNew={vi.fn()}
        setNotes={vi.fn()}
      />
    );

    expect(screen.getByText("Note 1")).toBeInTheDocument();
    expect(screen.getByText("Note 2")).toBeInTheDocument();
  });

  it("calls onEdit when note card is clicked", () => {
    const onEdit = vi.fn();
    render(
      <NotesList
        notes={sampleNotes}
        onEdit={onEdit}
        onDelete={vi.fn()}
        onNew={vi.fn()}
        setNotes={vi.fn()}
      />
    );

    const noteCard = screen.getByRole("button", { name: /note 1/i });
    fireEvent.click(noteCard);
    expect(onEdit).toHaveBeenCalledWith(sampleNotes[0]);
  });

  it("calls onEdit when Edit button is clicked", () => {
    const onEdit = vi.fn();
    render(
      <NotesList
        notes={sampleNotes}
        onEdit={onEdit}
        onDelete={vi.fn()}
        onNew={vi.fn()}
        setNotes={vi.fn()}
      />
    );

    const editBtn = screen.getAllByText("Edit")[0];
    fireEvent.click(editBtn);
    expect(onEdit).toHaveBeenCalledWith(sampleNotes[0]);
  });

  it("calls onDelete when Delete button is clicked", () => {
    const onDelete = vi.fn();
    render(
      <NotesList
        notes={sampleNotes}
        onEdit={vi.fn()}
        onDelete={onDelete}
        onNew={vi.fn()}
        setNotes={vi.fn()}
      />
    );

    const deleteBtn = screen.getAllByText("Delete")[0];
    fireEvent.click(deleteBtn);
    expect(onDelete).toHaveBeenCalledWith("1");
  });
});
