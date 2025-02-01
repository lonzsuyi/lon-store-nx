import { twMerge } from 'tailwind-merge';

/**
 * Props for the Picture component.
 */
export interface PictureProps extends React.HTMLAttributes<HTMLPictureElement> {
  src: string;
  alt: string;
  /**
   * Optional srcSet for responsive images (e.g., `srcSet="image-2x.jpg 2x, image-3x.jpg 3x"`).
   */
  srcSet?: string;
  /**
   * Determines how the image should be loaded:
   * - `lazy` (default) for deferred loading
   * - `eager` for immediate loading
   */
  loading?: 'lazy' | 'eager';
  className?: string;
}

/**
 * `Picture` component for rendering images with optional `srcSet` for responsiveness.
 *
 * Uses `<picture>` for improved performance and flexibility.
 */
export const Picture: React.FC<PictureProps> = ({
  src,
  alt,
  srcSet,
  loading = 'lazy',
  className = '',
  ...props
}) => {
  return (
    <picture className={twMerge('', className)} {...props}>
      {/* If srcSet is provided, use a <source> tag for responsive images */}
      {srcSet && <source srcSet={srcSet} />}

      {/* Default <img> tag with lazy loading */}
      <img
        src={src}
        alt={alt}
        loading={loading}
        className="w-full h-auto px-12 py-4 border border-gray-500 rounded-xl"
      />
    </picture>
  );
};

export default Picture;
