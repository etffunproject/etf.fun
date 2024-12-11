"use client";

export default function Card({ children }) {
  return (
    <div className="bg-surface p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      {children}
    </div>
  )
}
