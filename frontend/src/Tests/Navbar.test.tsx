import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TopBar from "./../UserDashboard/Navbar";
import { BrowserRouter } from "react-router-dom";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("./../UserDashboard/Avatar", () => ({
  default: ({ onLogout }: any) => (
    <button onClick={onLogout}>Logout</button>
  ),
}));

describe("TopBar Component", () => {
  const mockSetSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem(
      "user",
      JSON.stringify({ name: "Mahnoor", email: "mahnoor@test.com" })
    );
  });

  const renderTopBar = () =>
    render(
      <BrowserRouter>
        <TopBar
          searchQuery=""
          setSearchQuery={mockSetSearch}
          onSidebarToggle={vi.fn()}
        />
      </BrowserRouter>
    );

  it("renders search input", () => {
    renderTopBar();
    expect(
      screen.getByPlaceholderText(/search notes\.\.\./i)
    ).toBeInTheDocument();
  });

  it("calls setSearchQuery on typing", () => {
    renderTopBar();

    fireEvent.change(
      screen.getByPlaceholderText(/search notes\.\.\./i),
      { target: { value: "React" } }
    );

    expect(mockSetSearch).toHaveBeenCalledWith("React");
  });

  it("clears localStorage and navigates to login on logout", () => {
    renderTopBar();

    fireEvent.click(screen.getByText("Logout"));

    expect(localStorage.getItem("user")).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
  });
});

