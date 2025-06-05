import React from "react";

interface LoaderProps {
  /** When true, force the loader to cover the entire viewport */
  fullscreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ fullscreen = false }) => {
  // If fullscreen, use h-screen w-screen; otherwise h-full (relative to parent)
  const containerClasses = fullscreen
    ? "flex items-center justify-center h-screen w-screen"
    : "flex items-center justify-center h-full w-full";

  return (
    <div className={containerClasses}>
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default Loader;
