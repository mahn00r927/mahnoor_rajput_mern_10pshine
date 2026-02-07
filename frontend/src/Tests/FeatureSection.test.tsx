import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeaturesSection } from "../PublicView/FeatureSection";

describe("FeaturesSection Component", () => {
  it("renders section and header content", () => {
    const { container } = render(<FeaturesSection />);

    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: /everything you need/i, level: 2 })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /powerful features to organize your life, wrapped in a simple interface/i
      )
    ).toBeInTheDocument();
  });

  it("renders all three feature cards", () => {
    render(<FeaturesSection />);

    const featureHeadings = screen.getAllByRole("heading", { level: 3 });
    expect(featureHeadings).toHaveLength(3);

    expect(featureHeadings[0]).toHaveTextContent("Rich Note Editor");
    expect(featureHeadings[1]).toHaveTextContent("Organized");
    expect(featureHeadings[2]).toHaveTextContent("Private");
  });

  it("renders matching feature descriptions", () => {
    render(<FeaturesSection />);

    expect(
      screen.getByText(
        /write beautiful notes with our powerful intuitive editor\. format text, add code snippets, and more\./i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/folders that work together seamlessly\./i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/your notes are belong only to you\./i)
    ).toBeInTheDocument();
  });

  it("includes a grid layout and icons", () => {
    const { container } = render(<FeaturesSection />);

    const grid = container.querySelector(".grid");
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass("grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-3");

    const svgIcons = container.querySelectorAll("svg");
    expect(svgIcons.length).toBeGreaterThanOrEqual(3);
  });

  it("applies expected classes for headings and descriptions", () => {
    render(<FeaturesSection />);

    const mainHeading = screen.getByRole("heading", {
      name: /everything you need/i,
    });
    expect(mainHeading).toHaveClass("text-4xl", "sm:text-5xl", "font-bold");

    const featureHeading = screen.getByRole("heading", {
      name: /rich note editor/i,
    });
    expect(featureHeading).toHaveClass("text-xl", "sm:text-2xl", "font-bold");

    const description = screen.getByText(/folders that work together seamlessly\./i);
    expect(description).toHaveClass("text-gray-600", "text-base");
  });
});
