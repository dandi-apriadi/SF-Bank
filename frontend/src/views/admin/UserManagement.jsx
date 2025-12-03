import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function UserManagement() {
  useEffect(() => {
    AOS.init({ once: true, duration: 550 });
  }, []);

  // dummy members (30 items)
  const [members, setMembers] = useState(() => {
    const arr = [];
    const roles = ["R1", "R2", "R3", "R4", "R5"];
    for (let i = 1; i <= 30; i++) {
      const joined = new Date(2023, i % 12, ((i * 3) % 28) + 1);
      arr.push({
        id: i,
        external_id: `MBR-${1000 + i}`,
        name: `Member ${i}`,
        role: roles[i % roles.length],
        joined_date: joined.toISOString().slice(0, 10),
        notes: i % 5 === 0 ? "Active volunteer" : "",
      });
    }
    return arr;
  });

  // pagination
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil(members.length / PAGE_SIZE));
  const pagedMembers = members.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Add Member modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [roleInput, setRoleInput] = useState("R1");
  const [joinedDateInput, setJoinedDateInput] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
  const [notesInput, setNotesInput] = useState("");

  const openAddModal = () => {
    setNameInput("");
    setRoleInput("R1");
    setNotesInput("");
    setJoinedDateInput(() => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    });
    setShowAddModal(true);
  };
  const closeAddModal = () => setShowAddModal(false);

  const addMember = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return alert("Please enter a member name.");
    const maxId = members.length ? Math.max(...members.map((m) => m.id)) : 0;
    const newMember = {
      id: maxId + 1,
      external_id: `MBR-${1000 + maxId + 1}`,
      name: nameInput.trim(),
      role: roleInput,
      joined_date: joinedDateInput,
      notes: notesInput.trim(),
    };
    setMembers((prev) => [newMember, ...prev]);
    setShowAddModal(false);
    setPage(1);
  };

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const formatDate = (d) => {
    if (!d) return "-";
    try {
      const dt = new Date(d);
      return dt.toLocaleDateString("id-ID");
    } catch {
      return d;
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 text-gray-800 rounded-2xl">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif tracking-tight text-gray-800">User Management</h1>
          <p className="text-sm text-gray-600">Manage members — add, view, and inspect member details</p>
        </div>
        <div>
          <button onClick={openAddModal} className="bg-indigo-600 text-white px-4 py-2 rounded">Add Member</button>
        </div>
      </header>

      <div data-aos="fade-up" className="bg-white rounded-2xl shadow p-4">
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full table-fixed text-sm">
            <thead className="bg-gray-100">
              <tr className="text-xs text-gray-600">
                <th className="px-2 py-3 w-12 text-center">No</th>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y bg-white">
              {pagedMembers.map((m, idx) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-2 py-3 text-gray-700 w-12 text-center">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                  <td className="px-4 py-3 text-gray-700">{m.external_id}</td>
                  <td className="px-4 py-3 flex items-center">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mr-3 font-semibold">{getInitials(m.name)}</div>
                    <div>
                      <div className="font-medium text-gray-800">{m.name}</div>
                      <div className="text-xs text-gray-500">Member since {formatDate(m.joined_date)}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-700 capitalize">{m.role}</td>
                  <td className="px-4 py-3 text-center text-gray-700">{formatDate(m.joined_date)}</td>
                  <td className="px-4 py-3 text-gray-700">{m.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile list */}
        <div className="sm:hidden space-y-3">
          {pagedMembers.map((m, idx) => (
            <div key={m.id} className="bg-gray-50 rounded-xl p-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3 text-xs text-gray-500">No. {(page - 1) * PAGE_SIZE + idx + 1}</div>
                  <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3 font-semibold">{getInitials(m.name)}</div>
                  <div>
                    <div className="font-medium text-gray-800">{m.name}</div>
                    <div className="text-xs text-gray-500">{m.role} • {formatDate(m.joined_date)}</div>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600">{m.notes || '—'}</div>
            </div>
          ))}
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">Showing {pagedMembers.length} of {members.length} members</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded border bg-white disabled:opacity-50">Prev</button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded border ${page === i + 1 ? 'bg-indigo-600 text-white' : 'bg-white'}`}>{i + 1}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded border bg-white disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black opacity-40" onClick={closeAddModal} aria-hidden="true" />
          <div role="dialog" aria-modal="true" className="relative z-50 w-full max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Add Member</h3>
                  <p className="text-sm text-gray-500">Create a new member record</p>
                </div>
                <button onClick={closeAddModal} className="p-2 rounded-full hover:bg-gray-100" aria-label="Close modal">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <form onSubmit={addMember} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-gray-600">Name</label>
                  <input type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)} className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600">Role</label>
                  <select value={roleInput} onChange={(e) => setRoleInput(e.target.value)} className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200">
                    <option value="R1">R1</option>
                    <option value="R2">R2</option>
                    <option value="R3">R3</option>
                    <option value="R4">R4</option>
                    <option value="R5">R5</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600">Joined Date</label>
                  <input type="date" value={joinedDateInput} onChange={(e) => setJoinedDateInput(e.target.value)} className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600">Notes</label>
                  <input type="text" value={notesInput} onChange={(e) => setNotesInput(e.target.value)} className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                </div>

                <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
                  <button type="button" onClick={closeAddModal} className="px-4 py-2 rounded-lg border bg-white text-sm hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700">Add Member</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
