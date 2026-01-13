import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from './../PublicView/Navbar';

// Mock useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Helper function to render with Router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Navbar Component', () => {
  beforeEach(() => {
    // Clear mock before each test
    mockNavigate.mockClear();
  });

  it('should render the navbar', () => {
    renderWithRouter(<Navbar />);
    
    const navbar = screen.getByRole('navigation');
    expect(navbar).toBeInTheDocument();
  });

  it('should display the SmartNotes logo text', () => {
    renderWithRouter(<Navbar />);
    
    const logoText = screen.getByText('SmartNotes');
    expect(logoText).toBeInTheDocument();
  });

  it('should display the Sign In button', () => {
    renderWithRouter(<Navbar />);
    
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    expect(signInButton).toBeInTheDocument();
  });

  it('should render the logo SVG icon', () => {
    renderWithRouter(<Navbar />);
    
    const svgIcon = screen.getByRole('navigation').querySelector('svg');
    expect(svgIcon).toBeInTheDocument();
    expect(svgIcon).toHaveClass('w-6', 'h-6', 'text-white');
  });

  it('should navigate to /login when Sign In button is clicked', () => {
    renderWithRouter(<Navbar />);
    
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('should have correct styling classes on navbar', () => {
    renderWithRouter(<Navbar />);
    
    const navbar = screen.getByRole('navigation');
    expect(navbar).toHaveClass('fixed', 'top-0', 'left-0', 'right-0', 'z-50');
  });

  it('should have correct styling on Sign In button', () => {
    renderWithRouter(<Navbar />);
    
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    expect(signInButton).toHaveClass('text-white', 'font-semibold', 'rounded-full');
  });

  it('should display logo text with correct styling', () => {
    renderWithRouter(<Navbar />);
    
    const logoText = screen.getByText('SmartNotes');
    expect(logoText).toHaveClass('text-2xl', 'font-bold', 'text-white', 'tracking-tight');
  });
});