/**
 * Props for the Rate component.
 */
export interface RateProps {
  max?: number; // Maximum number of stars (default: 5).
  value?: number; // The current rating value.
  interactive?: boolean; // Whether the rating is interactive (default: `false`).
  onChange?: (value: number) => void; // Callback when the rating value changes.
  size?: number; // The size of the stars (default: 24px).
  activeColor?: string; // The color of filled stars (default: `#FABE3A` - yellow-700).
  inactiveColor?: string; // The color of empty stars (default: `#D1D5DB` - gray-200).
}
