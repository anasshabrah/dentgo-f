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
    <div className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-lg bg-white rounded-t-3xl z-60 p-6 shadow-lg">
      <button
        onClick={() => setShowXRayModal(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
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
      <h3 className="text-gray-800 text-xl font-semibold mb-4 text-center">
        AI xRay Reporter
      </h3>
      <form onSubmit={handleXRaySubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1" htmlFor="xray-file">
            X-Ray Image
          </label>
          <input
            id="xray-file"
            type="file"
            accept="image/*"
            required
            className="w-full"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1" htmlFor="patient-name">
            Patient Name
          </label>
          <input
            id="patient-name"
            type="text"
            required
            className="w-full border rounded p-2"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white font-medium text-base rounded-md py-3 shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
        >
          Upload and Analyze
        </button>
      </form>
    </div>
  );
};

export default XRayModal;
