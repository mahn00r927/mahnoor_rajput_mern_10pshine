import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Signup } from "../PublicView/SignUp";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock fetch
global.fetch = vi.fn();

// Helper function to render component
const renderSignup = () => {
  return render(
    <MemoryRouter>
      <Signup />
    </MemoryRouter>
  );
};

describe("Signup Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.alert = vi.fn();
    // Mock window.history.back
    window.history.back = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Rendering", () => {
    it("should render all form elements correctly", () => {
      renderSignup();

      expect(screen.getByText("Smart Notes")).toBeInTheDocument();
      expect(screen.getByText("Create your account")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("John Doe")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
    });

    it("should render password requirement text", () => {
      renderSignup();

      expect(
        screen.getByText(/must be at least 8 characters/i)
      ).toBeInTheDocument();
    });

    it("should render sign in link", () => {
      renderSignup();

      expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
      expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("should update name input value on change", async () => {
      const user = userEvent.setup();
      renderSignup();

      const nameInput = screen.getByPlaceholderText("John Doe");
      await user.type(nameInput, "John Doe");

      expect(nameInput).toHaveValue("John Doe");
    });

    it("should update email input value on change", async () => {
      const user = userEvent.setup();
      renderSignup();

      const emailInput = screen.getByPlaceholderText("you@example.com");
      await user.type(emailInput, "john@example.com");

      expect(emailInput).toHaveValue("john@example.com");
    });

    it("should update password input value on change", async () => {
      const user = userEvent.setup();
      renderSignup();

      const passwordInput = screen.getByPlaceholderText("••••••••");
      await user.type(passwordInput, "Test@1234");

      expect(passwordInput).toHaveValue("Test@1234");
    });

    it("should toggle password visibility", async () => {
      const user = userEvent.setup();
      renderSignup();

      const passwordInput = screen.getByPlaceholderText("••••••••");
      const toggleButtons = screen.getAllByRole("button");
      // Find the eye icon button (not the back, create account, or sign in buttons)
      const toggleButton = toggleButtons.find(
        (btn) => !btn.textContent?.includes("Back") && 
                 !btn.textContent?.includes("Create Account") && 
                 !btn.textContent?.includes("Sign in")
      );

      expect(passwordInput).toHaveAttribute("type", "password");

      if (toggleButton) {
        await user.click(toggleButton);
        expect(passwordInput).toHaveAttribute("type", "text");

        await user.click(toggleButton);
        expect(passwordInput).toHaveAttribute("type", "password");
      }
    });

    it("should navigate back when back button is clicked", async () => {
      const user = userEvent.setup();
      renderSignup();

      const backButton = screen.getByRole("button", { name: /back/i });
      await user.click(backButton);

      expect(window.history.back).toHaveBeenCalledOnce();
    });

    it("should navigate to login when sign in link is clicked", async () => {
      const user = userEvent.setup();
      renderSignup();

      const signInButton = screen.getByText(/sign in/i);
      await user.click(signInButton);

      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  describe("Form Validation", () => {
    it("should show alert when name is empty", async () => {
      const user = userEvent.setup();
      renderSignup();

      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /create account/i });

      await user.type(emailInput, "john@example.com");
      await user.type(passwordInput, "Test@1234");
      await user.click(submitButton);

      expect(global.alert).toHaveBeenCalledWith("All fields are required");
    });

    it("should show alert when email is empty", async () => {
      const user = userEvent.setup();
      renderSignup();

      const nameInput = screen.getByPlaceholderText("John Doe");
      const passwordInput = screen.getByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /create account/i });

      await user.type(nameInput, "John Doe");
      await user.type(passwordInput, "Test@1234");
      await user.click(submitButton);

      expect(global.alert).toHaveBeenCalledWith("All fields are required");
    });

    it("should show alert when password is empty", async () => {
      const user = userEvent.setup();
      renderSignup();

      const nameInput = screen.getByPlaceholderText("John Doe");
      const emailInput = screen.getByPlaceholderText("you@example.com");
      const submitButton = screen.getByRole("button", { name: /create account/i });

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.click(submitButton);

      expect(global.alert).toHaveBeenCalledWith("All fields are required");
    });

    it("should show alert for weak password (no uppercase)", async () => {
      const user = userEvent.setup();
      renderSignup();

      const nameInput = screen.getByPlaceholderText("John Doe");
      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /create account/i });

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.type(passwordInput, "test@1234");
      await user.click(submitButton);

      expect(global.alert).toHaveBeenCalledWith(
        "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character"
      );
    });

    it("should show alert for weak password (no special character)", async () => {
      const user = userEvent.setup();
      renderSignup();

      const nameInput = screen.getByPlaceholderText("John Doe");
      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /create account/i });

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.type(passwordInput, "Test1234");
      await user.click(submitButton);

      expect(global.alert).toHaveBeenCalledWith(
        "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character"
      );
    });

    it("should show alert for weak password (too short)", async () => {
      const user = userEvent.setup();
      renderSignup();

      const nameInput = screen.getByPlaceholderText("John Doe");
      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /create account/i });

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.type(passwordInput, "Te@12");
      await user.click(submitButton);

      expect(global.alert).toHaveBeenCalledWith(
        "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character"
      );
    });
  });

  describe("API Integration", () => {
    it("should call signup API with correct data on successful validation", async () => {
      const user = userEvent.setup();
      const mockResponse = { ok: true, json: async () => ({ message: "Success" }) };
      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      renderSignup();

      const nameInput = screen.getByPlaceholderText("John Doe");
      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /create account/i });

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.type(passwordInput, "Test@1234");
      await user.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "http://localhost:5000/api/auth/signup",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: "John Doe",
              email: "john@example.com",
              password: "Test@1234",
            }),
          }
        );
      });
    });

    it("should show success alert and navigate to login on successful signup", async () => {
      const user = userEvent.setup();
      const mockResponse = { ok: true, json: async () => ({ message: "Success" }) };
      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      renderSignup();

      const nameInput = screen.getByPlaceholderText("John Doe");
      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /create account/i });

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.type(passwordInput, "Test@1234");
      await user.click(submitButton);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith("Account created successfully!");
        expect(mockNavigate).toHaveBeenCalledWith("/login");
      });
    });

    it("should show error alert when signup fails", async () => {
      const user = userEvent.setup();
      const mockResponse = {
        ok: false,
        json: async () => ({ message: "Email already exists" }),
      };
      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      renderSignup();

      const nameInput = screen.getByPlaceholderText("John Doe");
      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /create account/i });

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.type(passwordInput, "Test@1234");
      await user.click(submitButton);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith("Email already exists");
      });
    });

    it("should show generic error alert when API call fails", async () => {
      const user = userEvent.setup();
      (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

      renderSignup();

      const nameInput = screen.getByPlaceholderText("John Doe");
      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /create account/i });

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.type(passwordInput, "Test@1234");
      await user.click(submitButton);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(
          "Something went wrong. Please try again."
        );
      });
    });
  });

  describe("Keyboard Interactions", () => {
    it("should submit form when Enter is pressed in name field", async () => {
      const user = userEvent.setup();
      const mockResponse = { ok: true, json: async () => ({ message: "Success" }) };
      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      renderSignup();

      const nameInput = screen.getByPlaceholderText("John Doe");
      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.type(passwordInput, "Test@1234");
      
      // Focus on name input and press Enter
      nameInput.focus();
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });

    it("should submit form when Enter is pressed in email field", async () => {
      const user = userEvent.setup();
      const mockResponse = { ok: true, json: async () => ({ message: "Success" }) };
      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      renderSignup();

      const nameInput = screen.getByPlaceholderText("John Doe");
      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.type(passwordInput, "Test@1234");
      
      // Focus on email input and press Enter
      emailInput.focus();
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });

    it("should submit form when Enter is pressed in password field", async () => {
      const user = userEvent.setup();
      const mockResponse = { ok: true, json: async () => ({ message: "Success" }) };
      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      renderSignup();

      const nameInput = screen.getByPlaceholderText("John Doe");
      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.type(passwordInput, "Test@1234");
      
      // Focus on password input and press Enter
      passwordInput.focus();
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });
  });
});