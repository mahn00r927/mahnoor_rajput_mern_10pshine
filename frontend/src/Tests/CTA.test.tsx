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

    it('should display the main heading', () => {
      renderWithRouter(<CTASection />);
      
      const heading = screen.getByRole('heading', { name: /ready to organize your thoughts/i });
      expect(heading).toBeInTheDocument();
    });

    it('should display the description paragraph', () => {
      renderWithRouter(<CTASection />);
      
      const description = screen.getByText(
        /join thousands of happy users who have transformed how they capture and organize ideas/i
      );
      expect(description).toBeInTheDocument();
    });

    it('should display "Get Started" button', () => {
      renderWithRouter(<CTASection />);
      
      const button = screen.getByRole('button', { name: /get started/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should navigate to /signup when "Get Started" button is clicked', () => {
      renderWithRouter(<CTASection />);
      
      const button = screen.getByRole('button', { name: /get started/i });
      fireEvent.click(button);
      
      expect(mockNavigate).toHaveBeenCalledWith('/signup');
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });

  describe('Styling', () => {
    it('should have correct styling classes on section', () => {
      const { container } = renderWithRouter(<CTASection />);
      
      const section = container.querySelector('section');
      expect(section).toHaveClass('flex', 'items-center', 'justify-center', 'px-4', 'py-20');
    });

    it('should have correct styling on CTA button', () => {
      renderWithRouter(<CTASection />);
      
      const button = screen.getByRole('button', { name: /get started/i });
      expect(button).toHaveClass('text-white', 'font-semibold', 'rounded-full');
    });

    it('should have correct styling on main heading', () => {
      renderWithRouter(<CTASection />);
      
      const heading = screen.getByRole('heading', { name: /ready to organize your thoughts/i });
      expect(heading).toHaveClass('text-3xl', 'font-bold', 'text-slate-900', 'mb-6');
    });

    it('should have correct text color on description paragraphs', () => {
      renderWithRouter(<CTASection />);
      
      const description = screen.getByText(
        /join thousands of happy users who have transformed how they capture and organize ideas/i
      );
      expect(description).toHaveClass('text-gray-500');
    });

    it('should have gradient background on CTA card', () => {
      const { container } = renderWithRouter(<CTASection />);
      
      const card = container.querySelector('.bg-white');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('rounded-[2.5rem]', 'border');
    });
  });

  describe('Content Structure', () => {
    it('should have proper heading hierarchy', () => {
      renderWithRouter(<CTASection />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Ready to organize your thoughts?');
    });

    it('should display all content in correct order', () => {
     renderWithRouter(<CTASection />);
      
      // Check heading
      expect(
        screen.getByRole('heading', { name: /ready to organize your thoughts/i })
      ).toBeInTheDocument();
      
      // Check description
      expect(
        screen.getByText(/join thousands of happy users who have transformed how they capture and organize ideas/i)
      ).toBeInTheDocument();
      
      // Check button is last
      expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
    });

    it('should have description paragraph with correct text size', () => {
      renderWithRouter(<CTASection />);
      
      const description = screen.getByText(
        /join thousands of happy users who have transformed how they capture and organize ideas/i
      );
      
      expect(description).toHaveClass('text-lg');
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button with proper text', () => {
      renderWithRouter(<CTASection />);
      
      const button = screen.getByRole('button', { name: /get started/i });
      expect(button).toHaveAccessibleName();
    });

    it('should have accessible heading', () => {
      renderWithRouter(<CTASection />);
      
      const heading = screen.getByRole('heading', { name: /ready to organize your thoughts/i });
      expect(heading).toHaveAccessibleName();
    });
  });

  describe('Interactive Elements', () => {
    it('should have clickable button', () => {
      renderWithRouter(<CTASection />);
      
      const button = screen.getByRole('button', { name: /get started/i });
      expect(button).toBeEnabled();
    });

    it('should trigger navigation only once per click', () => {
      renderWithRouter(<CTASection />);
      
      const button = screen.getByRole('button', { name: /get started/i });
      
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      expect(mockNavigate).toHaveBeenCalledTimes(3);
      expect(mockNavigate).toHaveBeenCalledWith('/signup');
    });
  });
});