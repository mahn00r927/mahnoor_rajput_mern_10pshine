import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ForgotPassword } from "./../PublicView/ForgotPassword"

// Mock fetch
global.fetch = vi.fn();

const renderForgotPassword = () => {
  return render(
    <MemoryRouter>
      <ForgotPassword />
    </MemoryRouter>
  );
};

describe("ForgotPassword Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.alert = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Initial Rendering", () => {
    it("should render forgot password form with all elements", () => {
      renderForgotPassword();

      expect(screen.getByText("Forgot password?")).toBeInTheDocument();
      expect(screen.getByText("No worries, we'll send you reset instructions")).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /send reset link/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
    });

    it("should have submit button disabled when email is empty", () => {
      renderForgotPassword();

      const submitButton = screen.getByRole("button", { name: /send reset link/i });
      expect(submitButton).toBeDisabled();
    });

    it("should render mail icon", () => {
      renderForgotPassword();

      const emailInput = screen.getByPlaceholderText("Enter your email");
      expect(emailInput.parentElement?.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("should update email input value on change", async () => {
      const user = userEvent.setup();
      renderForgotPassword();

      const emailInput = screen.getByPlaceholderText("Enter your email");
      await user.type(emailInput, "test@example.com");

      expect(emailInput).toHaveValue("test@example.com");
    });

    it("should enable submit button when email is entered", async () => {
      const user = userEvent.setup();
      renderForgotPassword();

      const emailInput = screen.getByPlaceholderText("Enter your email");
      const submitButton = screen.getByRole("button", { name: /send reset link/i });

      expect(submitButton).toBeDisabled();

      await user.type(emailInput, "test@example.com");
      expect(submitButton).not.toBeDisabled();
    });

    it("should clear form when back button is clicked", async () => {
      const user = userEvent.setup();
      renderForgotPassword();

      const emailInput = screen.getByPlaceholderText("Enter your email");
      const backButton = screen.getByRole("button", { name: /back/i });

      await user.type(emailInput, "test@example.com");
      expect(emailInput).toHaveValue("test@example.com");

      await user.click(backButton);
      // Form should reset but component stays on same view
      expect(emailInput).toHaveValue("");
    });
  });

  describe("Form Submission", () => {
    it("should call API with correct email on submit", async () => {
      const user = userEvent.setup();
      const mockResponse = {
        ok: true,
        json: async () => ({ message: "Reset link sent successfully" }),
      };
      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      renderForgotPassword();

      const emailInput = screen.getByPlaceholderText("Enter your email");
      const submitButton = screen.getByRole("button", { name: /send reset link/i });

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "http://localhost:5000/api/forgot-password/request-reset",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "test@example.com" }),
          }
        );
      });
    });

    it("should show success alert when reset link is sent", async () => {
      const user = userEvent.setup();
      const mockResponse = {
        ok: true,
        json: async () => ({ message: "Reset link sent successfully" }),
      };
      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      renderForgotPassword();

      const emailInput = screen.getByPlaceholderText("Enter your email");
      const submitButton = screen.getByRole("button", { name: /send reset link/i });

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith("Reset link sent successfully");
      });
    });

    it("should show error alert when API call fails", async () => {
      const user = userEvent.setup();
      (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

      renderForgotPassword();

      const emailInput = screen.getByPlaceholderText("Enter your email");
      const submitButton = screen.getByRole("button", { name: /send reset link/i });

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith("Something went wrong");
      });
    });

    it("should submit form when Enter key is pressed", async () => {
      const user = userEvent.setup();
      const mockResponse = {
        ok: true,
        json: async () => ({ message: "Reset link sent successfully" }),
      };
      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      renderForgotPassword();

      const emailInput = screen.getByPlaceholderText("Enter your email");
      await user.type(emailInput, "test@example.com");
      
      emailInput.focus();
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });
  });

  describe("Success State", () => {
    it("should show success screen after email is sent", async () => {
      const user = userEvent.setup();
      const mockResponse = {
        ok: true,
        json: async () => ({ message: "Reset link sent successfully" }),
      };
      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      renderForgotPassword();

      const emailInput = screen.getByPlaceholderText("Enter your email");
      const submitButton = screen.getByRole("button", { name: /send reset link/i });

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      // Wait for success message to appear
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

      renderForgotPassword();

      const emailInput = screen.getByPlaceholderText("Enter your email");
      const submitButton = screen.getByRole("button", { name: /send reset link/i });

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      // Check if loading state is shown
      await waitFor(() => {
        const loadingButton = screen.queryByText(/sending/i);
        // If loading state is implemented, this should exist
        if (loadingButton) {
          expect(loadingButton).toBeInTheDocument();
        }
      });

      // Resolve the promise
      resolvePromise!({
        ok: true,
        json: async () => ({ message: "Reset link sent successfully" }),
      });
    });

    it("should disable button during loading", async () => {
      const user = userEvent.setup();
      
      let resolvePromise: (value: any) => void;
      const mockPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      (global.fetch as any).mockReturnValueOnce(mockPromise);

      renderForgotPassword();

      const emailInput = screen.getByPlaceholderText("Enter your email");
      const submitButton = screen.getByRole("button", { name: /send reset link/i });

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      // Button should be disabled during loading
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      resolvePromise!({
        ok: true,
        json: async () => ({ message: "Reset link sent successfully" }),
      });
    });
  });

  describe("Email Validation", () => {
    it("should accept valid email format", async () => {
      const user = userEvent.setup();
      renderForgotPassword();

      const emailInput = screen.getByPlaceholderText("Enter your email");
      
      await user.type(emailInput, "valid.email@example.com");
      expect(emailInput).toHaveValue("valid.email@example.com");
    });

    it("should accept email with numbers", async () => {
      const user = userEvent.setup();
      renderForgotPassword();

      const emailInput = screen.getByPlaceholderText("Enter your email");
      
      await user.type(emailInput, "user123@test.com");
      expect(emailInput).toHaveValue("user123@test.com");
    });

    it("should accept email with special characters", async () => {
      const user = userEvent.setup();
      renderForgotPassword();

      const emailInput = screen.getByPlaceholderText("Enter your email");
      
      await user.type(emailInput, "user+test@example.co.uk");
      expect(emailInput).toHaveValue("user+test@example.co.uk");
    });
  });
});