import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Customers() {
  useEffect(() => {
    AOS.init({ once: true, duration: 550 });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Customers</h1>
        <p className="text-sm text-gray-500">Manage customer profiles and KYC data</p>
      </header>

      <div data-aos="fade-up" className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">ID</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Email</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Joined</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700">1</td>
              <td className="px-4 py-3 text-sm text-gray-700">John Doe</td>
              <td className="px-4 py-3 text-sm text-gray-700">john@example.com</td>
              <td className="px-4 py-3 text-sm text-gray-700">2024-06-12</td>
              <td className="px-4 py-3 text-sm text-gray-700">Edit | Disable</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700">2</td>
              <td className="px-4 py-3 text-sm text-gray-700">Jane Smith</td>
              <td className="px-4 py-3 text-sm text-gray-700">jane@example.com</td>
              <td className="px-4 py-3 text-sm text-gray-700">2025-01-10</td>
              <td className="px-4 py-3 text-sm text-gray-700">Edit | Disable</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
