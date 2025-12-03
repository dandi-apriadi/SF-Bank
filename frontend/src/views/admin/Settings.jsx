import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Settings() {
  useEffect(() => {
    AOS.init({ once: true, duration: 600 });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-gray-500">Application and database configuration helpers</p>
      </header>

      <div data-aos="fade-up" className="bg-white rounded-lg shadow p-4 max-w-2xl">
        <label className="block text-sm text-gray-600">API Base URL</label>
        <input className="w-full mt-2 p-2 border rounded" defaultValue={process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"} />

        <label className="block mt-4 text-sm text-gray-600">Notification Email</label>
        <input className="w-full mt-2 p-2 border rounded" defaultValue="ops@example.com" />

        <div className="mt-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
        </div>
      </div>
    </div>
  );
}
