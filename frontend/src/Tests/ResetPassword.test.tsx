import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ResetPassword } from './../PublicView/ResetPassword';
import '@testing-library/jest-dom';

// mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const renderWithRouter = (token = 'test-token-123') =>
  render(
    <MemoryRouter initialEntries={[`/reset-password/${token}`]}>
      <Routes>
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </MemoryRouter>
  );

describe('ResetPassword Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  /* ---------------- RENDERING ---------------- */

  it('should render reset password form', () => {
    renderWithRouter();

    expect(screen.getByText('Reset your password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter new password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/confirm new password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument();
  });

  it('should render password requirements', () => {
    renderWithRouter();

    expect(screen.getByText('Password must contain:')).toBeInTheDocument();
    expect(screen.getByText('At least 8 characters')).toBeInTheDocument();
    expect(screen.getByText('One uppercase letter')).toBeInTheDocument();
    expect(screen.getByText('One lowercase letter')).toBeInTheDocument();
    expect(screen.getByText('One number')).toBeInTheDocument();
    expect(screen.getByText('One special character')).toBeInTheDocument();
  });

  /* ---------------- PASSWORD VALIDATION ---------------- */

  it('should show error when passwords do not match', async () => {
    renderWithRouter();

    fireEvent.change(screen.getByPlaceholderText(/enter new password/i), {
      target: { value: 'Test123!@#' },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm new password/i), {
      target: { value: 'Different123!@#' },
    });

    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
  });
  it('should show error when password does not meet requirements', async () => {
    renderWithRouter();

    fireEvent.change(screen.getByPlaceholderText(/enter new password/i), {
      target: { value: 'weak' },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm new password/i), {
      target: { value: 'weak' },
    });

    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    expect(await screen.findByText('Password does not meet requirements')).toBeInTheDocument();
  });

  /* ---------------- PASSWORD STRENGTH INDICATOR ---------------- */

  it('should show weak password strength', () => {
    renderWithRouter();

    fireEvent.change(screen.getByPlaceholderText(/enter new password/i), {
      target: { value: 'test12' },
    });

    expect(screen.getByText('Weak')).toBeInTheDocument();
  });

  it('should show medium password strength', () => {
    renderWithRouter();

    fireEvent.change(screen.getByPlaceholderText(/enter new password/i), {
      target: { value: 'Test1234' },
    });

    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('should show strong password strength', () => {
    renderWithRouter();

    fireEvent.change(screen.getByPlaceholderText(/enter new password/i), {
      target: { value: 'Test123!@#' },
    });

    expect(screen.getByText('Strong')).toBeInTheDocument();
  });

  it('should update password requirement indicators', () => {
    renderWithRouter();

    const passwordInput = screen.getByPlaceholderText(/enter new password/i);

    // Initially all requirements should show circles
    fireEvent.change(passwordInput, { target: { value: '' } });

    // Type a strong password
    fireEvent.change(passwordInput, { target: { value: 'Test123!@#' } });

    // All requirements should now show checkmarks (✓)
    const requirementsList = screen.getByText('Password must contain:').nextElementSibling;
    const listItems = requirementsList?.querySelectorAll('li');

    listItems?.forEach((item) => {
      expect(item.textContent).toContain('✓');
    });
  });

  /* ---------------- PASSWORD VISIBILITY TOGGLE ---------------- */

  it('should toggle password visibility', () => {
    const { container } = renderWithRouter();

    const newPasswordInput = screen.getByPlaceholderText(/enter new password/i);
    const toggleButtons = container.querySelectorAll('button[type="button"]');

    expect(newPasswordInput).toHaveAttribute('type', 'password');

    fireEvent.click(toggleButtons[0]);
    expect(newPasswordInput).toHaveAttribute('type', 'text');

    fireEvent.click(toggleButtons[0]);
    expect(newPasswordInput).toHaveAttribute('type', 'password');
  });

  it('should toggle confirm password visibility', () => {
    const { container } = renderWithRouter();

    const confirmPasswordInput = screen.getByPlaceholderText(/confirm new password/i);
    const toggleButtons = container.querySelectorAll('button[type="button"]');

    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    fireEvent.click(toggleButtons[1]);
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');

    fireEvent.click(toggleButtons[1]);
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });


  it('should show error message when API returns error', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid or expired token' }),
    });

    renderWithRouter();

    fireEvent.change(screen.getByPlaceholderText(/enter new password/i), {
      target: { value: 'Test123!@#' },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm new password/i), {
      target: { value: 'Test123!@#' },
    });

    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    expect(
      await screen.findByText('Invalid or expired token')
    ).toBeInTheDocument();
  });

  it('should show generic error message on network failure', async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

    renderWithRouter();

    fireEvent.change(screen.getByPlaceholderText(/enter new password/i), {
      target: { value: 'Test123!@#' },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm new password/i), {
      target: { value: 'Test123!@#' },
    });

    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    expect(
      await screen.findByText('Something went wrong. Please try again.')
    ).toBeInTheDocument();
  });

  it('should send correct data to API', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Success' }),
    });

    renderWithRouter('my-test-token');

    fireEvent.change(screen.getByPlaceholderText(/enter new password/i), {
      target: { value: 'Test123!@#' },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm new password/i), {
      target: { value: 'Test123!@#' },
    });

    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/forgot-password/reset',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: 'my-test-token',
            newPassword: 'Test123!@#',
          }),
        }
      );
    });
  });

  /* ---------------- KEYBOARD INTERACTION ---------------- */

  it('should submit form on Enter key in password field', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Success' }),
    });

    renderWithRouter();

    fireEvent.change(screen.getByPlaceholderText(/enter new password/i), {
      target: { value: 'Test123!@#' },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm new password/i), {
      target: { value: 'Test123!@#' },
    });

    fireEvent.keyDown(screen.getByPlaceholderText(/enter new password/i), {
      key: 'Enter',
      code: 'Enter',
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('should submit form on Enter key in confirm password field', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Success' }),
    });

    renderWithRouter();

    fireEvent.change(screen.getByPlaceholderText(/enter new password/i), {
      target: { value: 'Test123!@#' },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm new password/i), {
      target: { value: 'Test123!@#' },
    });

    fireEvent.keyDown(screen.getByPlaceholderText(/confirm new password/i), {
      key: 'Enter',
      code: 'Enter',
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  /* ---------------- BUTTON STATE ---------------- */

  it('should disable submit button when fields are empty', () => {
    renderWithRouter();

    const button = screen.getByRole('button', { name: /reset password/i });
    expect(button).toBeDisabled();
  });

  it('should enable submit button when both fields are filled', () => {
    renderWithRouter();

    fireEvent.change(screen.getByPlaceholderText(/enter new password/i), {
      target: { value: 'Test123!@#' },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm new password/i), {
      target: { value: 'Test123!@#' },
    });

    const button = screen.getByRole('button', { name: /reset password/i });
    expect(button).not.toBeDisabled();
  });

  // it('should disable submit button during loading', async () => {
  //   vi.useFakeTimers();

  //   global.fetch = vi.fn().mockImplementation(
  //     () =>
  //       new Promise((resolve) =>
  //         setTimeout(
  //           () =>
  //             resolve({
  //               ok: true,
  //               json: async () => ({ message: 'Success' }),
  //             }),
  //           200
  //         )
  //       )
  //   );

  //   renderWithRouter();

  //   fireEvent.change(screen.getByLabelText('New Password'), {
  //     target: { value: 'Test123!@#' },
  //   });
  //   fireEvent.change(screen.getByLabelText('Confirm Password'), {
  //     target: { value: 'Test123!@#' },
  //   });

  //   const btn = screen.getByRole('button', { name: /reset password/i });
  //   fireEvent.click(btn);

  //   await waitFor(() => {
  //     expect(btn).toBeDisabled();
  //   });

  //   vi.runAllTimers();
  // });

  // it('should show loading spinner during API call', async () => {
  //   vi.useFakeTimers();

  //   global.fetch = vi.fn().mockImplementation(
  //     () =>
  //       new Promise((resolve) =>
  //         setTimeout(
  //           () =>
  //             resolve({
  //               ok: true,
  //               json: async () => ({ message: 'Success' }),
  //             }),
  //           200
  //         )
  //       )
  //   );

  //   renderWithRouter();

  //   fireEvent.change(screen.getByLabelText('New Password'), {
  //     target: { value: 'Test123!@#' },
  //   });
  //   fireEvent.change(screen.getByLabelText('Confirm Password'), {
  //     target: { value: 'Test123!@#' },
  //   });

  //   fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

  //   await waitFor(() => {
  //     expect(screen.getByText('Resetting...')).toBeInTheDocument();
  //   });

  //   vi.runAllTimers();
  // });
});