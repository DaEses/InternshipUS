import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Convert image path to WebP and optimized versions
  const getImagePaths = (imgSrc) => {
    const isLocalImage = !imgSrc.startsWith('http');
    if (!isLocalImage) return { original: imgSrc };

    const extension = imgSrc.split('.').pop().toLowerCase();
    const basePath = imgSrc.replace(new RegExp(`\.${extension}$`, 'i'), '');
    
    return {
      original: imgSrc,
      webp: `${basePath}.webp`,
      optimized: imgSrc.includes('optimized') 
        ? imgSrc 
        : imgSrc.replace(/(\/[^/]+)$/, '/optimized$1')
    };
  };

  const imagePaths = getImagePaths(src);
  const isWebPSupported = typeof window !== 'undefined' 
    ? document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0
    : true;

  useEffect(() => {
    // Skip if already loaded or not using lazy loading
    if (loading !== 'lazy' || !imgRef.current) {
      setIsIntersecting(true);
      return;
    }

    // Set up Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px', // Start loading when within 200px of viewport
        threshold: 0.01
      }
    );

    observer.observe(imgRef.current);
    observerRef.current = observer;

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  // Don't render anything if not in viewport and lazy loading
  if (!isIntersecting && loading === 'lazy') {
    return (
      <div 
        ref={imgRef}
        className={`image-placeholder ${className}`}
        style={{
          width: width || '100%',
          height: height || 'auto',
          backgroundColor: '#f0f4f8',
          ...props.style
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <picture>
      {/* WebP format for supported browsers */}
      {isWebPSupported && imagePaths.webp && (
        <source
          srcSet={imagePaths.webp}
          type="image/webp"
        />
      )}
      
      {/* Fallback to optimized/regular image */}
      <source
        srcSet={imagePaths.optimized || imagePaths.original}
        type={`image/${imagePaths.original.split('.').pop().toLowerCase()}`}
      />
      
      {/* Fallback img element */}
      <img
        ref={imgRef}
        src={imagePaths.optimized || imagePaths.original}
        alt={alt || ''}
        width={width}
        height={height}
        className={`${className} ${!isLoaded ? 'image-loading' : ''}`}
        loading={loading}
        onLoad={handleLoad}
        style={{
          transition: 'opacity 0.3s ease-in-out',
          opacity: isLoaded ? 1 : 0,
          ...props.style
        }}
        {...props}
      />
    </picture>
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  loading: PropTypes.oneOf(['lazy', 'eager']),
  style: PropTypes.object
};

export default OptimizedImage;
