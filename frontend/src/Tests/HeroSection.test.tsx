import { HeroSection } from './../PublicView/HeroSection';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

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

describe('HeroSection Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe('Rendering', () => {
    it('should render the hero section', () => {
      const { container } = renderWithRouter(<HeroSection />);
      
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('should display the badge with correct text', () => {
      renderWithRouter(<HeroSection />);
      
      const badgeText = screen.getByText('Beautifully simple note-taking');
      expect(badgeText).toBeInTheDocument();
    });

    it('should display the main heading "Where your"', () => {
      renderWithRouter(<HeroSection />);
      
      const heading1 = screen.getByText('Where your');
      expect(heading1).toBeInTheDocument();
    });

    it('should display the gradient heading "ideas come alive"', () => {
      renderWithRouter(<HeroSection />);
      
      const heading2 = screen.getByText('ideas come alive');
      expect(heading2).toBeInTheDocument();
    });

    it('should display the subheading text', () => {
      renderWithRouter(<HeroSection />);
      
      const subheading = screen.getByText(/A refined space for capturing thoughts/i);
      expect(subheading).toBeInTheDocument();
    });

    it('should display "Start Writing" button', () => {
      renderWithRouter(<HeroSection />);
      
      const button = screen.getByRole('button', { name: /start writing/i });
      expect(button).toBeInTheDocument();
    });

    it('should render arrow SVG icon in button', () => {
      renderWithRouter(<HeroSection />);
      
      const button = screen.getByRole('button', { name: /start writing/i });
      const svg = button.querySelector('svg');
      
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('w-4', 'h-4');
    });

    it('should render pulsing dot in badge', () => {
      renderWithRouter(<HeroSection />);
      
      const badge = screen.getByText('Beautifully simple note-taking').parentElement;
      const pulsingDot = badge?.querySelector('.animate-pulse');
      
      expect(pulsingDot).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should navigate to /login when "Start Writing" button is clicked', () => {
      renderWithRouter(<HeroSection />);
      
      const button = screen.getByRole('button', { name: /start writing/i });
      fireEvent.click(button);
      
      expect(mockNavigate).toHaveBeenCalledWith('/login');
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });

  describe('Styling', () => {
    it('should have correct styling classes on section', () => {
      renderWithRouter(<HeroSection />);
      
      const section = screen.getByLabelText('Hero section');
      expect(section).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center');
    });

    it('should have correct styling on "Start Writing" button', () => {
      renderWithRouter(<HeroSection />);
      
      const button = screen.getByRole('button', { name: /start writing/i });
      expect(button).toHaveClass('group', 'text-white', 'font-semibold', 'rounded-full');
    });

    it('should have gradient text styling on "ideas come alive"', () => {
      renderWithRouter(<HeroSection />);
      
      const gradientText = screen.getByText('ideas come alive');
      expect(gradientText).toHaveClass('text-transparent', 'bg-clip-text');
    });

    it('should have correct text color on subheading', () => {
      renderWithRouter(<HeroSection />);
      
      const subheading = screen.getByText(/A refined space for capturing thoughts/i);
      expect(subheading).toHaveClass('text-gray-700');
    });
  });

  describe('Decorative Elements', () => {
    it('should render decorative background blur elements', () => {
      const { container } = renderWithRouter(<HeroSection />);
      
      const blurElements = container.querySelectorAll('.blur-3xl');
      expect(blurElements.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Content Structure', () => {
    it('should have proper heading hierarchy', () => {
      renderWithRouter(<HeroSection />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('should display all text content in correct order', () => {
      renderWithRouter(<HeroSection />);
      
      expect(screen.getByText('Beautifully simple note-taking')).toBeInTheDocument();
      expect(screen.getByText('Where your')).toBeInTheDocument();
      expect(screen.getByText('ideas come alive')).toBeInTheDocument();
      expect(screen.getByText(/A refined space/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /start writing/i })).toBeInTheDocument();
    });
  });
});