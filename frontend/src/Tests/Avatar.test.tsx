import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import UserAvatar from "../UserDashboard/Avatar";

describe("UserAvatar Component", () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderAvatar = () =>
    render(
      <UserAvatar
        name="Mahnoor"
        email="mahnoor@test.com"
        onLogout={mockLogout}
      />
    );

  it("renders avatar with initial letter", () => {
    renderAvatar();
    expect(screen.getByText("M")).toBeInTheDocument();
  });

  it("opens dropdown on avatar click", () => {
    renderAvatar();

    fireEvent.click(screen.getByText("M"));

    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByText("mahnoor@test.com")).toBeInTheDocument();
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
      <UserAvatar name="" email="test@test.com" onLogout={mockLogout} />
    );

    expect(screen.getByText("?")).toBeInTheDocument();
  });
});
