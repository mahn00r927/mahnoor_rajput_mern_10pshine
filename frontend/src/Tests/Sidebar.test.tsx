import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "./../UserDashboard/Sidebar";

describe("Sidebar Component", () => {
  it("renders the logo and title", () => {
    render(
      <Sidebar
        onNewNote={vi.fn()}
        folders={[]}
        selectedFolder={null}
        onSelectFolder={vi.fn()}
        onDeleteFolder={vi.fn()}
      />
    );
    expect(screen.getByText("Smart Notes")).toBeInTheDocument();
  });

  it("renders 'New Note' button and triggers onNewNote", () => {
    const onNewNoteMock = vi.fn();
    render(
      <Sidebar
        onNewNote={onNewNoteMock}
        folders={[]}
        selectedFolder={null}
        onSelectFolder={vi.fn()}
        onDeleteFolder={vi.fn()}
      />
    );

    const newNoteBtn = screen.getByText(/New Note/i);
    expect(newNoteBtn).toBeInTheDocument();

    fireEvent.click(newNoteBtn);
    expect(onNewNoteMock).toHaveBeenCalled();
  });

  it("renders 'All Notes' button", () => {
    render(
      <Sidebar
        onNewNote={vi.fn()}
        folders={[]}
        selectedFolder={null}
        onSelectFolder={vi.fn()}
        onDeleteFolder={vi.fn()}
      />
    );
    expect(screen.getByText(/All Notes/i)).toBeInTheDocument();
  });

  it("calls onCreateFolder when create folder button is clicked", () => {
    const onCreateFolder = vi.fn();

    render(
      <Sidebar
        onNewNote={vi.fn()}
        folders={[]}
        selectedFolder={null}
        onSelectFolder={vi.fn()}
        onDeleteFolder={vi.fn()}
        onCreateFolder={onCreateFolder}
      />
    );

    fireEvent.click(screen.getByTitle(/create folder/i));
    expect(onCreateFolder).toHaveBeenCalled();
  });

  it("renders folder items and triggers onDeleteFolder", () => {
    const onDeleteFolder = vi.fn();
    render(
      <Sidebar
        onNewNote={vi.fn()}
        folders={["Work"]}
        selectedFolder={null}
        onSelectFolder={vi.fn()}
        onDeleteFolder={onDeleteFolder}
      />
    );

    expect(screen.getByText("Work")).toBeInTheDocument();
    const deleteButton = screen.getByText("Work").closest("button");
    if (!deleteButton) throw new Error("Folder button not found");

    const trashIcon = deleteButton.querySelector("svg");
    if (!trashIcon) throw new Error("Delete icon not found");

    fireEvent.click(trashIcon);
    expect(onDeleteFolder).toHaveBeenCalledWith("Work");
  });
});
