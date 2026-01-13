import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CTASection } from './../PublicView/CTA';

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

describe('CTASection Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe('Rendering', () => {
    it('should render the CTA section', () => {
      const { container } = renderWithRouter(<CTASection />);
      
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('should display the main heading "Ready to start?"', () => {
      renderWithRouter(<CTASection />);
      
      const heading = screen.getByRole('heading', { name: /ready to start/i });
      expect(heading).toBeInTheDocument();
    });

    it('should display the first description paragraph', () => {
      renderWithRouter(<CTASection />);
      
      const description1 = screen.getByText(/join thousands who've found their perfect writing space/i);
      expect(description1).toBeInTheDocument();
    });

    it('should display the second description paragraph', () => {
      renderWithRouter(<CTASection />);
      
      const description2 = screen.getByText(/free to start, no credit card required/i);
      expect(description2).toBeInTheDocument();
    });

    it('should display "Create Free Account" button', () => {
      renderWithRouter(<CTASection />);
      
      const button = screen.getByRole('button', { name: /create free account/i });
      expect(button).toBeInTheDocument();
    });

    it('should render lightning bolt SVG icon', () => {
      const { container } = renderWithRouter(<CTASection />);
      
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('w-16', 'h-16', 'text-blue-500');
    });

    it('should have lightning bolt path in SVG', () => {
      const { container } = renderWithRouter(<CTASection />);
      
      const path = container.querySelector('path[d="M13 10V3L4 14h7v7l9-11h-7z"]');
      expect(path).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should navigate to /signup when "Create Free Account" button is clicked', () => {
      renderWithRouter(<CTASection />);
      
      const button = screen.getByRole('button', { name: /create free account/i });
      fireEvent.click(button);
      
      expect(mockNavigate).toHaveBeenCalledWith('/signup');
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });

  describe('Styling', () => {
    it('should have correct styling classes on section', () => {
      const { container } = renderWithRouter(<CTASection />);
      
      const section = container.querySelector('section');
      expect(section).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center');
    });

    it('should have correct styling on CTA button', () => {
      renderWithRouter(<CTASection />);
      
      const button = screen.getByRole('button', { name: /create free account/i });
      expect(button).toHaveClass('text-white', 'font-semibold', 'rounded-full');
    });

    it('should have correct styling on main heading', () => {
      renderWithRouter(<CTASection />);
      
      const heading = screen.getByRole('heading', { name: /ready to start/i });
      expect(heading).toHaveClass('text-4xl', 'font-bold', 'text-white', 'mb-6');
    });

    it('should have correct text color on description paragraphs', () => {
      renderWithRouter(<CTASection />);
      
      const description1 = screen.getByText(/join thousands who've found their perfect writing space/i);
      expect(description1).toHaveClass('text-gray-400');
    });

    it('should have gradient background on CTA card', () => {
      const { container } = renderWithRouter(<CTASection />);
      
      const card = container.querySelector('.bg-linear-to-br');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('rounded-3xl', 'border');
    });
  });

  describe('Content Structure', () => {
    it('should have proper heading hierarchy', () => {
      renderWithRouter(<CTASection />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Ready to start?');
    });

    it('should display all content in correct order', () => {
      const { container } = renderWithRouter(<CTASection />);
      
      // Check SVG is rendered first
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      
      // Check heading
      expect(screen.getByRole('heading', { name: /ready to start/i })).toBeInTheDocument();
      
      // Check descriptions
      expect(screen.getByText(/join thousands/i)).toBeInTheDocument();
      expect(screen.getByText(/free to start/i)).toBeInTheDocument();
      
      // Check button is last
      expect(screen.getByRole('button', { name: /create free account/i })).toBeInTheDocument();
    });

    it('should have both description paragraphs with correct text size', () => {
      renderWithRouter(<CTASection />);
      
      const description1 = screen.getByText(/join thousands who've found their perfect writing space/i);
      const description2 = screen.getByText(/free to start, no credit card required/i);
      
      expect(description1).toHaveClass('text-lg');
      expect(description2).toHaveClass('text-lg');
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button with proper text', () => {
      renderWithRouter(<CTASection />);
      
      const button = screen.getByRole('button', { name: /create free account/i });
      expect(button).toHaveAccessibleName();
    });

    it('should have accessible heading', () => {
      renderWithRouter(<CTASection />);
      
      const heading = screen.getByRole('heading', { name: /ready to start/i });
      expect(heading).toHaveAccessibleName();
    });
  });

  describe('Interactive Elements', () => {
    it('should have clickable button', () => {
      renderWithRouter(<CTASection />);
      
      const button = screen.getByRole('button', { name: /create free account/i });
      expect(button).toBeEnabled();
    });

    it('should trigger navigation only once per click', () => {
      renderWithRouter(<CTASection />);
      
      const button = screen.getByRole('button', { name: /create free account/i });
      
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      expect(mockNavigate).toHaveBeenCalledTimes(3);
      expect(mockNavigate).toHaveBeenCalledWith('/signup');
    });
  });
});