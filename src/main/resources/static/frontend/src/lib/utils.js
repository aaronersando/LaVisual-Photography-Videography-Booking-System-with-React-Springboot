/**
 * Utility Function for Class Name Management
 * 
 * This file provides a utility function for managing CSS class names in React components,
 * particularly when using Tailwind CSS. The exported 'cn' function handles:
 * 
 * - Combining multiple class names from different sources
 * - Conditionally applying classes based on component state or props
 * - Resolving conflicts between Tailwind CSS utility classes
 * 
 * This is important because Tailwind classes often target the same CSS properties,
 * and without proper merging, they can conflict (e.g., text-red-500 and text-blue-500).
 * The function ensures only the appropriate classes are applied in the final output.
 * 
 * This utility is used throughout the application wherever dynamic class combinations
 * are needed, making component styling more maintainable and flexible.
 */

import { clsx } from "clsx"; // Import clsx utility for conditional class name construction
import { twMerge } from "tailwind-merge" // Import twMerge to resolve Tailwind CSS class conflicts

/**
 * Combines and merges class names intelligently
 * 
 * @param {...any} inputs - Any number of class name inputs (strings, objects, arrays, etc.)
 * @returns {string} - A string of merged class names with conflicts resolved
 */
export function cn(...inputs) {
  // First use clsx to combine all inputs into a single className string
  // Then pass the result to twMerge to resolve any Tailwind utility conflicts
  return twMerge(clsx(inputs));
}