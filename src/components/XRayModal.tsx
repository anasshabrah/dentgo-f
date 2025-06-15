// src/components/XRayModal.tsx
import React, { useState } from "react";

interface XRayModalProps {
  setShowXRayModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const XRayModal: React.FC<XRayModalProps> = ({ setShowXRayModal }) => {
  const [patientName, setPatientName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleXRaySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!patientName || !file) {
      alert("Patient name and x-ray image are required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", patientName);
    formData.append("image", file);

    try {
      const res = await fetch("/api/xray-upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      alert("Upload successful!");
      setShowXRayModal(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while uploading.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-60 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-lg transform transition-all duration-300 ease-in-out scale-95 hover:scale-100">
        <button
          onClick={() => setShowXRayModal(false)}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label="Close x-ray modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h3 className="text-gray-800 text-2xl font-bold mb-6 text-center">
          AI xRay Reporter
        </h3>
        <p className="text-gray-500 text-lg mb-6 text-center">
          Upload dental x-rays and generate detailed AI reports instantly.
        </p>
        <form onSubmit={handleXRaySubmit} className="space-y-6">
          <div className="relative">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="xray-file">
              X-Ray Image
            </label>
            <input
              id="xray-file"
              type="file"
              accept="image/*"
              required
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <div className="relative">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="patient-name">
              Patient Name
            </label>
            <input
              id="patient-name"
              type="text"
              required
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white font-semibold text-lg py-3 rounded-md shadow-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition duration-300"
          >
            Upload and Analyze
          </button>
        </form>
      </div>
    </div>
  );
};

export default XRayModal;
