import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Skeleton from './Skeleton';

const ImageWithLoader = ({ src, alt, className = "", skeletonHeight = "100%", ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    // Extract animate from props to merge it
    const { animate, initial, ...otherProps } = props;

    // Merge animation states
    const combinedAnimate = {
        ...(typeof animate === 'object' ? animate : {}),
        opacity: isLoaded ? 1 : 0
    };

    const combinedInitial = {
        ...(typeof initial === 'object' ? initial : {}),
        opacity: 0
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {!isLoaded && (
                <Skeleton
                    type="rect"
                    width="100%"
                    height="100%"
                    className={`absolute top-0 left-0 w-full h-full ${className}`}
                />
            )}
            <motion.img
                src={src}
                alt={alt}
                className={className}
                initial={combinedInitial}
                animate={combinedAnimate}
                onLoad={() => setIsLoaded(true)}
                {...otherProps}
            />
        </div>
    );
};

export default ImageWithLoader;
