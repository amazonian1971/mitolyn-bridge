// components/GoogleButton.tsx
"use client";

import { FcGoogle } from "react-icons/fc";

export default function GoogleButton({
  onClick,
  disabled = false,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border border-gray-300 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-gray-700 font-semibold text-lg disabled:opacity-50"
    >
      <FcGoogle className="h-6 w-6" />
      Continue with Google
    </button>
  );
}