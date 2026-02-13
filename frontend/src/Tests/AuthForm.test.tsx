import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, vi, beforeEach, expect } from "vitest";
import { AuthForm } from "./../PublicView/AuthForm";

describe("AuthForm Component", () => {
    const mockSubmit = vi.fn();
    const mockToggle = vi.fn();

    const defaultProps = {
        title: "Login",
        subtitle: "Enter your credentials",
        buttonText: "Submit",
        showPasswordHint: true,
        onSubmit: mockSubmit,
        toggleText: "Switch to Signup",
        onToggle: mockToggle,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders title and subtitle", () => {
        render(<AuthForm {...defaultProps} />);
        expect(screen.getByText("Login")).toBeInTheDocument();
        expect(screen.getByText("Enter your credentials")).toBeInTheDocument();
    });

    it("renders email and password inputs", () => {
        render(<AuthForm {...defaultProps} />);
        expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    });

    it("allows typing in email and password inputs", async () => {
        render(<AuthForm {...defaultProps} />);
        const emailInput = screen.getByPlaceholderText("you@example.com");
        const passwordInput = screen.getByPlaceholderText("••••••••");

        await userEvent.type(emailInput, "test@example.com");
        await userEvent.type(passwordInput, "password123");

        expect(emailInput).toHaveValue("test@example.com");
        expect(passwordInput).toHaveValue("password123");
    });

    it("toggles password visibility", async () => {
        render(<AuthForm {...defaultProps} />);
        const passwordInput = screen.getByPlaceholderText("••••••••") as HTMLInputElement;
        const toggleButton = screen.getByRole("button", { name: /show password/i });

        // ✅ default type should be password
        expect(passwordInput.type).toBe("password");

        // toggle to show password
        await userEvent.click(toggleButton);
        expect(passwordInput.type).toBe("text");

        // toggle back to hide password
        await userEvent.click(toggleButton);
        expect(passwordInput.type).toBe("password");
    });


    it("calls onSubmit with email and password", async () => {
        render(<AuthForm {...defaultProps} />);
        const emailInput = screen.getByPlaceholderText("you@example.com");
        const passwordInput = screen.getByPlaceholderText("••••••••");
        const submitButton = screen.getByRole("button", { name: "Submit" });

        await userEvent.type(emailInput, "test@example.com");
        await userEvent.type(passwordInput, "password123");

        await userEvent.click(submitButton);

        expect(mockSubmit).toHaveBeenCalledOnce();
        expect(mockSubmit).toHaveBeenCalledWith("test@example.com", "password123");
    });

    it("renders password hint when showPasswordHint is true", () => {
        render(<AuthForm {...defaultProps} />);
        expect(screen.getByText("Min 6 characters")).toBeInTheDocument();
    });

    it("calls onToggle when toggle text is clicked", async () => {
        render(<AuthForm {...defaultProps} />);
        const toggleText = screen.getByText("Switch to Signup");
        await userEvent.click(toggleText);
        expect(mockToggle).toHaveBeenCalledOnce();
    });
});
