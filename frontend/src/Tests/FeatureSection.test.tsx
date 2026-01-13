import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FeaturesSection } from './../PublicView/FeatureSection';

describe('FeaturesSection Component', () => {
  describe('Rendering', () => {
    it('should render the features section', () => {
      const { container } = render(<FeaturesSection />);
      
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('should display the main heading "Designed for focus"', () => {
      render(<FeaturesSection />);
      
      const heading = screen.getByRole('heading', { name: /designed for focus/i, level: 2 });
      expect(heading).toBeInTheDocument();
    });

    it('should display the subtitle', () => {
      render(<FeaturesSection />);
      
      const subtitle = screen.getByText(/every feature crafted to help you think clearly/i);
      expect(subtitle).toBeInTheDocument();
    });

    it('should render all three feature cards', () => {
      const { container } = render(<FeaturesSection />);
      
      const featureCards = container.querySelectorAll('.group.text-center');
      expect(featureCards).toHaveLength(3);
    });

    it('should render all three SVG icons', () => {
      const { container } = render(<FeaturesSection />);
      
      const svgIcons = container.querySelectorAll('svg');
      expect(svgIcons.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Feature Cards Content', () => {
    it('should display "Distraction-free" feature', () => {
      render(<FeaturesSection />);
      
      const title = screen.getByRole('heading', { name: /distraction-free/i });
      const description = screen.getByText(/a clean canvas for your thoughts/i);
      
      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();
    });

    it('should display "Organized" feature', () => {
      render(<FeaturesSection />);
      
      const title = screen.getByRole('heading', { name: /organized/i });
      const description = screen.getByText(/folders and tags that work together seamlessly/i);
      
      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();
    });

    it('should display "Private" feature', () => {
      render(<FeaturesSection />);
      
      const title = screen.getByRole('heading', { name: /private/i });
      const description = screen.getByText(/your notes are encrypted and belong only to you/i);
      
      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();
    });

    it('should render all three feature headings', () => {
      render(<FeaturesSection />);
      
      const featureHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(featureHeadings).toHaveLength(3);
      
      expect(featureHeadings[0]).toHaveTextContent('Distraction-free');
      expect(featureHeadings[1]).toHaveTextContent('Organized');
      expect(featureHeadings[2]).toHaveTextContent('Private');
    });
  });

  describe('Styling', () => {
    it('should have correct styling classes on section', () => {
      const { container } = render(<FeaturesSection />);
      
      const section = container.querySelector('section');
      expect(section).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center');
    });

    it('should have correct styling on main heading', () => {
      render(<FeaturesSection />);
      
      const heading = screen.getByRole('heading', { name: /designed for focus/i });
      expect(heading).toHaveClass('text-5xl', 'font-bold', 'text-white', 'mb-6');
    });

    it('should have correct styling on subtitle', () => {
      render(<FeaturesSection />);
      
      const subtitle = screen.getByText(/every feature crafted to help you think clearly/i);
      expect(subtitle).toHaveClass('text-gray-400', 'text-lg');
    });

    it('should have grid layout for features', () => {
      const { container } = render(<FeaturesSection />);
      
      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-3');
    });

    it('should have correct styling on feature titles', () => {
      render(<FeaturesSection />);
      
      const featureTitles = screen.getAllByRole('heading', { level: 3 });
      
      featureTitles.forEach(title => {
        expect(title).toHaveClass('text-2xl', 'font-bold', 'text-white', 'mb-4');
      });
    });

    it('should have correct styling on feature descriptions', () => {
      render(<FeaturesSection />);
      
      const description1 = screen.getByText(/a clean canvas for your thoughts/i);
      const description2 = screen.getByText(/folders and tags that work together seamlessly/i);
      const description3 = screen.getByText(/your notes are encrypted and belong only to you/i);
      
      expect(description1).toHaveClass('text-gray-400', 'text-base', 'leading-relaxed');
      expect(description2).toHaveClass('text-gray-400', 'text-base', 'leading-relaxed');
      expect(description3).toHaveClass('text-gray-400', 'text-base', 'leading-relaxed');
    });
  });

  describe('Icon Styling', () => {
    it('should have correct styling on SVG icons', () => {
      const { container } = render(<FeaturesSection />);
      
      const svgIcons = container.querySelectorAll('svg.w-7.h-7.text-white');
      expect(svgIcons.length).toBeGreaterThanOrEqual(3);
    });

    it('should have gradient background on icon containers', () => {
      const { container } = render(<FeaturesSection />);
      
      const iconContainers = container.querySelectorAll('.bg-linear-to-br');
      expect(iconContainers.length).toBeGreaterThanOrEqual(3);
    });

    it('should have hover effects on icon containers', () => {
      const { container } = render(<FeaturesSection />);
      
      const iconContainers = container.querySelectorAll('.group-hover\\:scale-110');
      expect(iconContainers.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Content Structure', () => {
    it('should have proper heading hierarchy', () => {
      render(<FeaturesSection />);
      
      const h2 = screen.getByRole('heading', { level: 2 });
      const h3s = screen.getAllByRole('heading', { level: 3 });
      
      expect(h2).toBeInTheDocument();
      expect(h3s).toHaveLength(3);
    });

    it('should display features in correct order', () => {
      render(<FeaturesSection />);
      
      const featureHeadings = screen.getAllByRole('heading', { level: 3 });
      
      expect(featureHeadings[0]).toHaveTextContent('Distraction-free');
      expect(featureHeadings[1]).toHaveTextContent('Organized');
      expect(featureHeadings[2]).toHaveTextContent('Private');
    });

    it('should have section header before feature cards', () => {
      const { container } = render(<FeaturesSection />);
      
      const sectionHeader = container.querySelector('.text-center.mb-20');
      const featureGrid = container.querySelector('.grid');
      
      expect(sectionHeader).toBeInTheDocument();
      expect(featureGrid).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible headings with proper levels', () => {
      render(<FeaturesSection />);
      
      const mainHeading = screen.getByRole('heading', { level: 2, name: /designed for focus/i });
      const featureHeadings = screen.getAllByRole('heading', { level: 3 });
      
      expect(mainHeading).toBeInTheDocument();
      expect(featureHeadings).toHaveLength(3);
    });

    it('should have descriptive text for each feature', () => {
      render(<FeaturesSection />);
      
      expect(screen.getByText(/a clean canvas for your thoughts/i)).toBeInTheDocument();
      expect(screen.getByText(/folders and tags that work together seamlessly/i)).toBeInTheDocument();
      expect(screen.getByText(/your notes are encrypted and belong only to you/i)).toBeInTheDocument();
    });
  });

  describe('Feature Array Data', () => {
    it('should render correct number of features from array', () => {
      render(<FeaturesSection />);
      
      const featureHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(featureHeadings).toHaveLength(3);
    });

    it('should have unique content for each feature', () => {
      render(<FeaturesSection />);
      
      const distractionFree = screen.getByText(/distraction-free/i);
      const organized = screen.getByText(/organized/i);
      const privateFeature = screen.getByText(/private/i);
      
      expect(distractionFree).toBeInTheDocument();
      expect(organized).toBeInTheDocument();
      expect(privateFeature).toBeInTheDocument();
    });
  });

  describe('Responsive Design Classes', () => {
    it('should have responsive text sizes on main heading', () => {
      render(<FeaturesSection />);
      
      const heading = screen.getByRole('heading', { name: /designed for focus/i });
      expect(heading).toHaveClass('text-5xl', 'md:text-6xl');
    });

    it('should have responsive text sizes on subtitle', () => {
      render(<FeaturesSection />);
      
      const subtitle = screen.getByText(/every feature crafted to help you think clearly/i);
      expect(subtitle).toHaveClass('text-lg', 'md:text-xl');
    });

    it('should have responsive grid columns', () => {
      const { container } = render(<FeaturesSection />);
      
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-3');
    });

    it('should have responsive gap between grid items', () => {
      const { container } = render(<FeaturesSection />);
      
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('gap-8', 'md:gap-12');
    });
  });
});