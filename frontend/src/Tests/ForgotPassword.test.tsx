import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ForgotPassword } from "./../PublicView/ForgotPassword";

const renderForgotPassword = () => {
  return render(
    <MemoryRouter>
      <ForgotPassword />
    </MemoryRouter>
  );
};

describe("ForgotPassword Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn();
    global.alert = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ---------------- Initial Rendering ----------------
  it("should render forgot password form with all elements", () => {
    renderForgotPassword();

    expect(screen.getByText("Forgot password?")).toBeInTheDocument();
    expect(
      screen.getByText("No worries, we'll send you reset instructions")
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send reset link/i })
    ).toBeInTheDocument();
  });

  // ---------------- User Interaction ----------------
  it("should enable submit button when email is entered", async () => {
    const user = userEvent.setup();
    renderForgotPassword();

    const input = screen.getByPlaceholderText("Enter your email");
    const button = screen.getByRole("button", { name: /send reset link/i });

    expect(button).toBeDisabled();

    await user.type(input, "test@example.com");
    expect(button).not.toBeDisabled();
  });

  // ---------------- Form Submission ----------------
  it("should call API with correct email on submit", async () => {
    const user = userEvent.setup();

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: "Reset link sent successfully",
      }),
    });

    renderForgotPassword();

    await user.type(
      screen.getByPlaceholderText("Enter your email"),
      "test@example.com"
    );
    await user.click(
      screen.getByRole("button", { name: /send reset link/i })
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/forgot-password/request-reset",
        expect.objectContaining({
          method: "POST",
        })
      );
    });
  });

  it("should show success alert when reset link is sent", async () => {
    const user = userEvent.setup();

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: "Reset link sent successfully",
      }),
    });

    renderForgotPassword();

    await user.type(
      screen.getByPlaceholderText("Enter your email"),
      "test@example.com"
    );
    await user.click(
      screen.getByRole("button", { name: /send reset link/i })
    );

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        "Reset link sent successfully"
      );
    });
  });

  it("should show error alert when API call fails", async () => {
    const user = userEvent.setup();

    (global.fetch as any).mockRejectedValueOnce(
      new Error("Network error")
    );

    renderForgotPassword();

    await user.type(
      screen.getByPlaceholderText("Enter your email"),
      "test@example.com"
    );
    await user.click(
      screen.getByRole("button", { name: /send reset link/i })
    );

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalled();
    });
  });

    it("should allow resending email from success screen", async () => {
      const user = userEvent.setup();
      
      // First submission
      const mockResponse1 = {
        ok: true,
        json: async () => ({ message: "Reset link sent successfully" }),
      };
      (global.fetch as any).mockResolvedValueOnce(mockResponse1);

      const { rerender } = renderForgotPassword();

      const emailInput = screen.getByPlaceholderText("Enter your email");
      const submitButton = screen.getByRole("button", { name: /send reset link/i });

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Loading State", () => {
    it("should show loading state during API call", async () => {
      const user = userEvent.setup();
      
      // Create a promise that we can control
      let resolvePromise: (value: any) => void;
      const mockPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      (global.fetch as any).mockReturnValueOnce(mockPromise);
  // ---------------- Success State ----------------
  it("should stay on same screen after success (no resend feature)", async () => {
    const user = userEvent.setup();

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: "Reset link sent successfully",
      }),
    });

    renderForgotPassword();

    await user.type(
      screen.getByPlaceholderText("Enter your email"),
      "test@example.com"
    );
    await user.click(
      screen.getByRole("button", { name: /send reset link/i })
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    });
  });
});
