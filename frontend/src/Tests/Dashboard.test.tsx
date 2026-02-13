import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor , fireEvent } from "@testing-library/react";
import Dashboard from "../UserDashboard/Dashboard";
import { BrowserRouter } from "react-router-dom";

// ✅ mock navigate
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// ✅ mock child components
vi.mock("../UserDashboard/Sidebar", () => ({
  default: ({ onNewNote }: any) => (
    <button onClick={onNewNote}>New Note</button>
  ),
}));

vi.mock("../UserDashboard/Navbar", () => ({
  default: ({ setSearchQuery }: any) => (
    <input
      placeholder="search"
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  ),
}));

vi.mock("../UserDashboard/NotesList", () => ({
  default: ({ notes, onDelete }: any) => (
    <div>
      {notes.map((n: any) => (
        <div key={n._id}>
          <span>{n.title}</span>
          <button onClick={() => onDelete(n._id)}>Delete</button>
        </div>
      ))}
    </div>
  ),
}));

vi.mock("../UserDashboard/Welcome", () => ({
  default: () => <div>Welcome</div>,
}));

// ✅ helper
const renderDashboard = () =>
  render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );

describe("Dashboard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("token", "fake-token");
  });

  it("shows loading state initially", async () => {
    global.fetch = vi.fn(
      () => new Promise(() => {}) // never resolves
    ) as any;

    renderDashboard();
    expect(screen.getByText(/loading notes/i)).toBeInTheDocument();
  });

  it("fetches and displays notes", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { _id: "1", title: "Test Note", content: "Body" },
      ],
    }) as any;

    renderDashboard();

    await waitFor(() =>
      expect(screen.getByText("Test Note")).toBeInTheDocument()
    );
  });

  it("navigates to editor on new note", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    }) as any;

    renderDashboard();

    const btn = await screen.findByText("New Note");
    btn.click();

    expect(mockNavigate).toHaveBeenCalledWith("/editor", {
      state: { folder: "Default" },
    });
  });

  it("filters notes by search", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { _id: "1", title: "React Note", content: "React content" },
        { _id: "2", title: "Node Note", content: "Node content" },
      ],
    }) as any;

  renderDashboard();

  await waitFor(() =>
    expect(screen.getByText("React Note")).toBeInTheDocument()
  );

  const search = screen.getByPlaceholderText(/search/i);

  fireEvent.change(search, { target: { value: "React" } });

  expect(screen.getByText("React Note")).toBeInTheDocument();
  expect(screen.queryByText("Node Note")).not.toBeInTheDocument();
});


  it("deletes note from UI", async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ _id: "1", title: "Delete Me", content: "Body" }],
      })
      .mockResolvedValueOnce({ ok: true }) as any;

    renderDashboard();

    await waitFor(() =>
      expect(screen.getByText("Delete Me")).toBeInTheDocument()
    );

    screen.getByText("Delete").click();

    await waitFor(() =>
      expect(screen.queryByText("Delete Me")).not.toBeInTheDocument()
    );
  });
});
