import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RichTextEditor from "../UserDashboard/Editor";
import { BrowserRouter } from "react-router-dom";

// -------------------- MOCKS --------------------
const mockNavigate = vi.fn();
let mockLocation: any = { state: {} };

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

// mock fetch
global.fetch = vi.fn();

// mock alert
window.alert = vi.fn();

// -------------------- HELPERS --------------------
const renderEditor = () =>
  render(
    <BrowserRouter>
      <RichTextEditor />
    </BrowserRouter>
  );

// -------------------- TESTS --------------------
describe("RichTextEditor Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("token", "test-token");
    mockLocation.state = {}; // reset mode
  });

  it("renders title input and editor", () => {
    renderEditor();

    expect(
      screen.getByPlaceholderText("Note title...")
    ).toBeInTheDocument();

    const editor = document.querySelector('[contenteditable="true"]');
    expect(editor).toBeInTheDocument();
  });

  it("loads note in edit mode", async () => {
    mockLocation.state = {
      note: {
        _id: "1",
        title: "Test Note",
        content: "<p>Content</p>",
      },
    };

    renderEditor();

    expect(
      screen.getByDisplayValue("Test Note")
    ).toBeInTheDocument();

    const editor = document.querySelector('[contenteditable="true"]')!;
    expect(editor.innerHTML).toContain("Content");
  });

  it("shows alert if title is empty", async () => {
    renderEditor();

    fireEvent.click(screen.getByText("Save"));

    expect(window.alert).toHaveBeenCalledWith("Title is required");
  });

  it("saves new note (POST)", async () => {
    mockLocation.state = {}; // NEW MODE

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    renderEditor();

    fireEvent.change(
      screen.getByPlaceholderText("Note title..."),
      { target: { value: "New Note" } }
    );

    const editor = document.querySelector('[contenteditable="true"]')!;
    editor.innerHTML = "<p>Hello</p>";

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/notes",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer test-token",
          }),
        })
      );
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("updates note in edit mode (PUT)", async () => {
    mockLocation.state = {
      note: {
        _id: "123",
        title: "Old Title",
        content: "<p>Old</p>",
      },
    };

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    renderEditor();

    fireEvent.change(
      screen.getByPlaceholderText("Note title..."),
      { target: { value: "Updated Title" } }
    );

    const editor = document.querySelector('[contenteditable="true"]')!;
    editor.innerHTML = "<p>Updated</p>";

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/notes/123",
        expect.objectContaining({
          method: "PUT",
        })
      );
    });
  });

  it("navigates back when clicking Back button", () => {
    renderEditor();

    fireEvent.click(screen.getByText("Back"));

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});
