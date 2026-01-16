import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ForgotPassword from "../PublicView/ForgotPassword";

// -------------------- MOCKS --------------------
global.fetch = vi.fn();
window.alert = vi.fn();

// -------------------- TESTS --------------------
describe("ForgotPassword Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders email input and send button", () => {
    render(<ForgotPassword />);

    expect(
      screen.getByPlaceholderText(/enter your email/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/send reset link/i)
    ).toBeInTheDocument();
  });

  it("updates email input value", () => {
    render(<ForgotPassword />);

    const input = screen.getByPlaceholderText(/enter your email/i);

    fireEvent.change(input, {
      target: { value: "test@example.com" },
    });

    expect(input).toHaveValue("test@example.com");
  });

  it("disables submit button when email is empty", () => {
    render(<ForgotPassword />);

    const button = screen.getByText(/send reset link/i);
    expect(button).toBeDisabled();
  });

  it("calls API on submit and shows alert on success", async () => {
    (fetch as any).mockResolvedValueOnce({
      json: async () => ({
        message: "Reset link sent",
      }),
    });

    render(<ForgotPassword />);

    fireEvent.change(
      screen.getByPlaceholderText(/enter your email/i),
      { target: { value: "user@test.com" } }
    );

    fireEvent.click(screen.getByText(/send reset link/i));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/forgot-password/request-reset",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "user@test.com" }),
        })
      );
    });

    expect(window.alert).toHaveBeenCalledWith("Reset link sent");
  });

  it("shows error alert if API fails", async () => {
    (fetch as any).mockRejectedValueOnce(new Error("Network error"));

    render(<ForgotPassword />);

    fireEvent.change(
      screen.getByPlaceholderText(/enter your email/i),
      { target: { value: "fail@test.com" } }
    );

    fireEvent.click(screen.getByText(/send reset link/i));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Something went wrong");
    });
  });

  it("submits form when Enter key is pressed", async () => {
    (fetch as any).mockResolvedValueOnce({
      json: async () => ({
        message: "Reset link sent",
      }),
    });

    render(<ForgotPassword />);

    const input = screen.getByPlaceholderText(/enter your email/i);

    fireEvent.change(input, {
      target: { value: "enter@test.com" },
    });

    fireEvent.keyPress(input, {
      key: "Enter",
      code: "Enter",
      charCode: 13,
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });
});

