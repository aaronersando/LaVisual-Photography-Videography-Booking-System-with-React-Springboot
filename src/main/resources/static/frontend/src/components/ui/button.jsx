/**
 * Button Component
 * 
 * This file defines a reusable, accessible, and customizable button component.
 * It leverages class-variance-authority (cva) to create a button with multiple variants
 * and sizes through a consistent API.
 * 
 * The component supports:
 * - Multiple visual styles (default, destructive, outline, secondary, ghost, link)
 * - Different sizes (default, small, large, icon)
 * - Accessibility features (focus states, disabled states)
 * - Polymorphic rendering (can be rendered as different elements using asChild)
 * - Dark mode support
 * 
 * This is a core UI component used throughout the application for consistent button styling
 * and behavior across different contexts.
 */

import * as React from "react" // Import React
import { Slot } from "@radix-ui/react-slot" // Import Slot for polymorphic components
import { cva } from "class-variance-authority"; // Import cva for creating style variants

import { cn } from "@/lib/utils" // Import utility for merging class names

// Define button variants using cva
// This creates a function that generates the appropriate class names based on provided variants
const buttonVariants = cva(
  // Base styles applied to all button variants
  // These handle layout, text styling, transitions, disabled states, and focus states
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      // Different visual styles for the button
      variant: {
        // Primary button style - colored background with contrasting text
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        // Destructive/danger button style - typically red
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        // Outlined button style - transparent with border
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        // Secondary button style - less prominent than default
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        // Ghost button style - only shows background on hover
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        // Link button style - looks like a text link
        link: "text-primary underline-offset-4 hover:underline",
      },
      // Different size options for the button
      size: {
        // Default size
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        // Small size
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        // Large size
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        // Icon-only size (square)
        icon: "size-9",
      },
    },
    // Default variant and size if none specified
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Button component definition
function Button({
  className, // Additional CSS classes to apply
  variant,   // Visual style variant
  size,      // Size variant
  asChild = false, // Whether to render children as the root element
  ...props  // All other props to pass to the button element
}) {
  // If asChild is true, use Slot (from Radix UI) which renders children as the root
  // Otherwise use a standard HTML button element
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button" // Data attribute for potential targeting with CSS
      className={cn(buttonVariants({ variant, size, className }))} // Merge all class names
      {...props} // Spread all other props (onClick, aria- attributes, etc.)
    />
  );
}

// Export the Button component and buttonVariants function
// This allows importing the component and also accessing the style variants separately
export { Button, buttonVariants }