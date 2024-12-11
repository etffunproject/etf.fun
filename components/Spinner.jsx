"use client";

export default function Spinner() {
  return (
    <div className="flex items-center justify-center w-full h-full py-8">
      <div className="w-6 h-6 border-4 border-gray-300 border-t-accent rounded-full animate-spin"></div>
    </div>
  );
}
