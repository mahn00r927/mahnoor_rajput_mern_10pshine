import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Login } from '../PublicView/LogIn';

// Mock global fetch
global.fetch = vi.fn();

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Mock window.alert to prevent "Not implemented" errors
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ============================================
  // RENDERING TESTS
  // ============================================

  describe('Component Rendering', () => {
    it('renders login form with all elements', () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      // Check main heading
      expect(screen.getByText('Smart Notes')).toBeInTheDocument();
      expect(screen.getByText('Welcome back')).toBeInTheDocument();

      // Check form fields
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

      // Check buttons
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
      expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
      expect(screen.getByText(/sign up/i)).toBeInTheDocument();
    });

    it('renders empty input fields initially', () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const emailInput = screen.getByPlaceholderText(/you@example.com/i) as HTMLInputElement;
      const passwordInput = screen.getByPlaceholderText(/••••••••/i) as HTMLInputElement;

      expect(emailInput.value).toBe('');
      expect(passwordInput.value).toBe('');
    });

    it('password field is hidden by default', () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const passwordInput = screen.getByPlaceholderText(/••••••••/i);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  // ============================================
  // USER INTERACTION TESTS
  // ============================================

  describe('User Interactions', () => {
    it('allows user to type in email field', () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const emailInput = screen.getByPlaceholderText(/you@example.com/i) as HTMLInputElement;
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      expect(emailInput.value).toBe('test@example.com');
    });

    it('allows user to type in password field', () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const passwordInput = screen.getByPlaceholderText(/••••••••/i) as HTMLInputElement;
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      expect(passwordInput.value).toBe('password123');
    });

    it('toggles password visibility when eye icon is clicked', () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const passwordInput = screen.getByPlaceholderText(/••••••••/i);
      const toggleButton = passwordInput.nextElementSibling as HTMLButtonElement;

      // Initially hidden
      expect(passwordInput).toHaveAttribute('type', 'password');

      // Click to show
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');

      // Click to hide again
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('navigates to home when back button is clicked', () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const backButton = screen.getByRole('button', { name: /back/i });
      fireEvent.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('navigates to signup page when sign up link is clicked', () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const signUpButton = screen.getByText(/sign up/i);
      fireEvent.click(signUpButton);

      expect(mockNavigate).toHaveBeenCalledWith('/signup');
    });

    it('navigates to forgot password when link is clicked', () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const forgotPasswordButton = screen.getByText(/forgot password/i);
      fireEvent.click(forgotPasswordButton);

      expect(mockNavigate).toHaveBeenCalledWith('/forgot-password');
    });
  });

  // ============================================
  // VALIDATION TESTS
  // ============================================

  describe('Form Validation', () => {
    it('shows alert when email is empty', async () => {
      const alertMock = vi.spyOn(window, 'alert');

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const passwordInput = screen.getByPlaceholderText(/••••••••/i);
      const signInButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(signInButton);

      expect(alertMock).toHaveBeenCalledWith('Please enter email and password');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('shows alert when password is empty', async () => {
      const alertMock = vi.spyOn(window, 'alert');

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const emailInput = screen.getByPlaceholderText(/you@example.com/i);
      const signInButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(signInButton);

      expect(alertMock).toHaveBeenCalledWith('Please enter email and password');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('shows alert when both fields are empty', async () => {
      const alertMock = vi.spyOn(window, 'alert');

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const signInButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(signInButton);

      expect(alertMock).toHaveBeenCalledWith('Please enter email and password');
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // SUCCESSFUL LOGIN TESTS
  // ============================================

  describe('Successful Login', () => {
    it('successfully logs in with valid credentials', async () => {
      const mockToken = 'mock-jwt-token-12345';
      const mockResponse = {
        token: mockToken,
        user: { id: '1', email: 'test@example.com' },
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      } as Response);

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const emailInput = screen.getByPlaceholderText(/you@example.com/i);
      const passwordInput = screen.getByPlaceholderText(/••••••••/i);
      const signInButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(signInButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:5000/api/auth/login',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: 'test@example.com',
              password: 'password123',
            }),
          }
        );
      });

      await waitFor(() => {
        expect(localStorage.getItem('token')).toBe(mockToken);
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('handles enter key press on email field', async () => {
      const mockToken = 'mock-jwt-token';

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ token: mockToken }),
      } as Response);

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const emailInput = screen.getByPlaceholderText(/you@example.com/i);
      const passwordInput = screen.getByPlaceholderText(/••••••••/i);

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.keyDown(emailInput, { key: 'Enter', code: 'Enter' });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });

    it('handles enter key press on password field', async () => {
      const mockToken = 'mock-jwt-token';

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ token: mockToken }),
      } as Response);

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const emailInput = screen.getByPlaceholderText(/you@example.com/i);
      const passwordInput = screen.getByPlaceholderText(/••••••••/i);

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.keyDown(passwordInput, { key: 'Enter', code: 'Enter' });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });
  });

  // ============================================
  // FAILED LOGIN TESTS
  // ============================================

  describe('Failed Login', () => {
    it('shows error alert for invalid credentials (401)', async () => {
      const alertMock = vi.spyOn(window, 'alert');

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Invalid credentials' }),
      } as Response);

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const emailInput = screen.getByPlaceholderText(/you@example.com/i);
      const passwordInput = screen.getByPlaceholderText(/••••••••/i);
      const signInButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
      fireEvent.click(signInButton);

      await waitFor(() => {
        expect(alertMock).toHaveBeenCalledWith('Invalid credentials');
      });

      expect(localStorage.getItem('token')).toBeNull();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('shows error alert for user not found (404)', async () => {
      const alertMock = vi.spyOn(window, 'alert');

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'User not found' }),
      } as Response);

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const emailInput = screen.getByPlaceholderText(/you@example.com/i);
      const passwordInput = screen.getByPlaceholderText(/••••••••/i);
      const signInButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'notfound@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(signInButton);

      await waitFor(() => {
        expect(alertMock).toHaveBeenCalledWith('User not found');
      });
    });

    it('shows generic error when backend does not send message', async () => {
      const alertMock = vi.spyOn(window, 'alert');

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      } as Response);

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const emailInput = screen.getByPlaceholderText(/you@example.com/i);
      const passwordInput = screen.getByPlaceholderText(/••••••••/i);
      const signInButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(signInButton);

      await waitFor(() => {
        expect(alertMock).toHaveBeenCalledWith('Login failed');
      });
    });

    it('handles network error gracefully', async () => {
      const alertMock = vi.spyOn(window, 'alert');

      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'));

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const emailInput = screen.getByPlaceholderText(/you@example.com/i);
      const passwordInput = screen.getByPlaceholderText(/••••••••/i);
      const signInButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(signInButton);

      await waitFor(() => {
        expect(alertMock).toHaveBeenCalledWith('Network error');
      });
    });

    it('handles unknown error type', async () => {
      const alertMock = vi.spyOn(window, 'alert');

      vi.mocked(global.fetch).mockRejectedValueOnce('String error');

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const emailInput = screen.getByPlaceholderText(/you@example.com/i);
      const passwordInput = screen.getByPlaceholderText(/••••••••/i);
      const signInButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(signInButton);

      await waitFor(() => {
        expect(alertMock).toHaveBeenCalledWith('An unknown error occurred');
      });
    });
  });

  // ============================================
  // CONSOLE ERROR TESTS
  // ============================================

  describe('Error Logging', () => {
    it('logs error to console on failed login', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Invalid credentials' }),
      } as Response);

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const emailInput = screen.getByPlaceholderText(/you@example.com/i);
      const passwordInput = screen.getByPlaceholderText(/••••••••/i);
      const signInButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
      fireEvent.click(signInButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error signing in:',
          'Invalid credentials'
        );
      });

      consoleErrorSpy.mockRestore();
    });

    it('logs success message to console on successful login', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ token: 'mock-token', user: { id: '1' } }),
      } as Response);

      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const emailInput = screen.getByPlaceholderText(/you@example.com/i);
      const passwordInput = screen.getByPlaceholderText(/••••••••/i);
      const signInButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(signInButton);

      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith(
          'Login Success:',
          expect.objectContaining({ token: 'mock-token' })
        );
      });

      consoleLogSpy.mockRestore();
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================

  describe('Accessibility', () => {
    it('has proper labels for form inputs', () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('email input has correct type attribute', () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('buttons are keyboard accessible', () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );

      const signInButton = screen.getByRole('button', { name: /sign in/i });
      expect(signInButton).toBeInTheDocument();
      
      // Button should be focusable
      signInButton.focus();
      expect(document.activeElement).toBe(signInButton);
    });
  });
});