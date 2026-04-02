

import { useState } from "react";
import { X, Mail } from "lucide-react";

interface AddEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddEmailModal({ isOpen, onClose }: AddEmailModalProps) {
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-[#1A1A1ACC]/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative shadow-2xl flex flex-col"
        style={{
          background: "#1c1c1e",
          border: "1px solid #2a2a2d",
          borderRadius: "16px",
          width: "450px",
          padding: "28px 28px 24px",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white text-lg font-bold">Add Email for Notifications</h2>
          <button
            onClick={onClose}
            className="text-[#6b6b6b] hover:text-white transition-colors duration-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="mb-5">
          <label className="text-[#6b6b6b] text-sm block mb-2">Email Address</label>
          <div className="flex items-center gap-2 bg-[#ffffff1a] border border-[#ffffff1a] rounded-lg py-2.5 px-3 focus-within:border-[#e8612a]/50 transition-colors duration-200">
            <Mail size={16} className="text-[#6b6b6b] shrink-0" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-[#6b6b6b] focus:outline-none"
            />
          </div>
          <p className="text-[#6b6b6b] text-xs mt-2">
            You'll receive task updates and mentions at this address.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            style={{
              height: "45px",
              padding: "0 20px",
              background: "#2a2a2d",
              border: "1px solid #3a3a3d",
              borderRadius: "8px",
            }}
            className="text-white text-sm font-medium hover:opacity-80 transition-opacity duration-200"
          >
            Cancel
          </button>
          <button
            style={{
              height: "45px",
              padding: "0 24px",
              background: email.trim()
                ? "linear-gradient(180deg, #E97334 0%, #CC4130 100%)"
                : "linear-gradient(180deg, #E97334 0%, #CC4130 100%)",
              opacity: email.trim() ? 1 : 0.6,
              borderRadius: "8px",
            }}
            className="text-white text-sm font-medium transition-opacity duration-200"
          >
            Save Email
          </button>
        </div>
      </div>
    </div>
  );
}
