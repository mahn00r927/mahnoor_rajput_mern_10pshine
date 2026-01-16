import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "./../UserDashboard/Sidebar";

describe("Sidebar Component", () => {
  it("renders the logo and title", () => {
    render(<Sidebar onNewNote={vi.fn()} />);
    expect(screen.getByText("Smart Notes")).toBeInTheDocument();
  });

  it("renders 'New Note' button and triggers onNewNote", () => {
    const onNewNoteMock = vi.fn();
    render(<Sidebar onNewNote={onNewNoteMock} />);

    const newNoteBtn = screen.getByText(/New Note/i);
    expect(newNoteBtn).toBeInTheDocument();

    fireEvent.click(newNoteBtn);
    expect(onNewNoteMock).toHaveBeenCalled();
  });

  it("renders 'All Notes' button", () => {
    render(<Sidebar onNewNote={vi.fn()} />);
    expect(screen.getByText(/All Notes/i)).toBeInTheDocument();
  });

  it("renders 'No folders yet' initially", () => {
    render(<Sidebar onNewNote={vi.fn()} />);
    expect(screen.getByText(/No folders yet/i)).toBeInTheDocument();
  });

  it("adds a new folder when prompt is filled", () => {
    // Mock prompt to return a folder name
    const promptMock = vi.spyOn(window, "prompt").mockReturnValue("My Folder");

    render(<Sidebar onNewNote={vi.fn()} />);
    const addFolderBtn = screen.getByRole("button", { name: "" }); // the small plus button
    fireEvent.click(addFolderBtn);

    expect(screen.getByText("My Folder")).toBeInTheDocument();

    promptMock.mockRestore();
  });

  it("does not add a folder when prompt is cancelled", () => {
    const promptMock = vi.spyOn(window, "prompt").mockReturnValue(null);

    render(<Sidebar onNewNote={vi.fn()} />);
    const addFolderBtn = screen.getByRole("button", { name: "" });
    fireEvent.click(addFolderBtn);

    expect(screen.queryByText("My Folder")).not.toBeInTheDocument();

    promptMock.mockRestore();
  });
});
