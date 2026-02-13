import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserAvatar from "../UserDashboard/Avatar";

describe("UserAvatar Component", () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderAvatar = () =>
    render(
      <MemoryRouter>
        <UserAvatar name="Mahnoor" onLogout={mockLogout} />
      </MemoryRouter>
    );

  it("renders avatar with initial letter", () => {
    renderAvatar();
    expect(screen.getByText("M")).toBeInTheDocument();
  });

  it("opens dropdown on avatar click", () => {
    renderAvatar();

    fireEvent.click(screen.getByText("M"));

    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByText("Log out")).toBeInTheDocument();
  });

  it("closes dropdown on outside click", () => {
    renderAvatar();

    fireEvent.click(screen.getByText("M"));
    expect(screen.getByText("Log out")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByText("Log out")).not.toBeInTheDocument();
  });

  it("calls logout handler when clicking logout", () => {
    renderAvatar();

    fireEvent.click(screen.getByText("M"));
    fireEvent.click(screen.getByText("Log out"));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("shows ? when name is empty", () => {
    render(
      <MemoryRouter>
        <UserAvatar name="" onLogout={mockLogout} />
      </MemoryRouter>
    );

    expect(screen.getByText("?")).toBeInTheDocument();
  });
});
