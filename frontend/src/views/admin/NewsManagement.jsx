import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function NewsManagement() {
  useEffect(() => {
    AOS.init({ once: true, duration: 600 });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">News Management</h1>
        <p className="text-sm text-gray-500">Create and manage news items displayed in the app</p>
      </header>

      <div data-aos="fade-up" className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <input className="flex-1 p-2 border rounded" placeholder="Title" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
        </div>

        <div className="mt-4 text-sm text-gray-600">Existing posts:</div>
        <ul className="mt-2 space-y-2">
          <li className="p-2 bg-gray-50 rounded">System maintenance on 2025-12-01</li>
          <li className="p-2 bg-gray-50 rounded">New import feature deployed</li>
        </ul>
      </div>
    </div>
  );
}
