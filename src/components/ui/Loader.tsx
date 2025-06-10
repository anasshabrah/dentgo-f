// src/components/ui/Loader.tsx
import React from "react";

interface LoaderProps {
  /** When true, force the loader to cover the entire viewport */
  fullscreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ fullscreen = false }) => {
  // If fullscreen, use fixed positioning to center on the screen
  const containerClasses = fullscreen
    ? "fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-white bg-opacity-50 z-50"
    : "flex items-center justify-center w-full h-full";

  return (
    <div className={containerClasses}>
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default Loader;
