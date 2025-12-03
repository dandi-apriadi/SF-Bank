import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Deposits() {
  // filter inputs (local) and applied filters
  const [weekFromInput, setWeekFromInput] = useState(1);
  const [weekToInput, setWeekToInput] = useState(4);
  const [appliedWeekFrom, setAppliedWeekFrom] = useState(1);
  const [appliedWeekTo, setAppliedWeekTo] = useState(4);
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  useEffect(() => {
    AOS.init({ once: true, duration: 550 });
  }, []);

  // apply filters action
  const applyFilters = () => {
    setAppliedWeekFrom(Number(weekFromInput) || 1);
    setAppliedWeekTo(Number(weekToInput) || 100);
    setAppliedSearch((searchInput || "").trim());
    setPage(1);
  };

  // Sample deposits (50 dummy records) using the resource model from Dashboard
  const [deposits, setDeposits] = useState(() => {
    const arr = [];
    for (let i = 1; i <= 50; i++) {
      arr.push({
        id: 1000 + i,
        member: `Member ${i}`,
        week: (i % 12) + 1,
        date: `2025-11-${(i % 28) + 1}`,
        food: 10000000 + i * 50000,
        wood: 8000000 + i * 40000,
        stone: 2000000 + i * 30000,
        gold: 500000 + i * 20000,
      });
    }
    return arr;
  });

  // Add deposit modal state / form
  const [showAddModal, setShowAddModal] = useState(false);
  const [memberInput, setMemberInput] = useState("");
  // searchable dropdown state
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [memberHighlighted, setMemberHighlighted] = useState(0);
  const [weekInputModal, setWeekInputModal] = useState(1);
  const [dateInputModal, setDateInputModal] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
  const [foodInput, setFoodInput] = useState(0);
  const [woodInput, setWoodInput] = useState(0);
  const [stoneInput, setStoneInput] = useState(0);
  const [goldInput, setGoldInput] = useState(0);

  const openAddModal = () => {
    setMemberInput("");
    setWeekInputModal(1);
    setFoodInput(0);
    setWoodInput(0);
    setStoneInput(0);
    setGoldInput(0);
    setShowMemberDropdown(false);
    setMemberHighlighted(0);
    setShowAddModal(true);
  };
  const closeAddModal = () => setShowAddModal(false);

  const addDeposit = (e) => {
    e.preventDefault();
    // basic validation
    if (!memberInput || Number(weekInputModal) < 1) return alert("Please provide a member name and valid week.");
    const maxId = deposits.length ? Math.max(...deposits.map((d) => d.id)) : 1000;
    const newDeposit = {
      id: maxId + 1,
      member: memberInput,
      week: Number(weekInputModal),
      date: dateInputModal,
      food: Number(foodInput) || 0,
      wood: Number(woodInput) || 0,
      stone: Number(stoneInput) || 0,
      gold: Number(goldInput) || 0,
    };
    setDeposits((prev) => [newDeposit, ...prev]);
    // if new deposit falls within applied filters it will appear automatically
    setShowAddModal(false);
    // reset to first page so user sees the new record in table if filters match
    setPage(1);
  };

  // derive unique members from deposits for suggestions
  const uniqueMembers = Array.from(new Set(deposits.map((d) => d.member))).sort();

  const filteredMemberSuggestions = memberInput
    ? uniqueMembers.filter((m) => m.toLowerCase().includes(memberInput.toLowerCase()))
    : uniqueMembers.slice(0, 8);

  const handleMemberKeyDown = (e) => {
    if (!showMemberDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setMemberHighlighted((i) => Math.min(i + 1, filteredMemberSuggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setMemberHighlighted((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const sel = filteredMemberSuggestions[memberHighlighted];
      if (sel) {
        setMemberInput(sel);
        setShowMemberDropdown(false);
      }
    } else if (e.key === "Escape") {
      setShowMemberDropdown(false);
    }
  };

  // helpers (same style as Dashboard)
  const formatToMillions = (n) => {
    if (n === null || n === undefined) return "-";
    const num = Number(n) || 0;
    return num.toLocaleString("id-ID");
  };
  const formatShort = (n) => {
    if (n === null || n === undefined) return "-";
    const num = Number(n) || 0;
    const abs = Math.abs(num);
    const trim = (v) => {
      const s = v.toFixed(2);
      return s.replace(/\.0+$|(?<=\.[0-9]*?)0+$/g, "").replace(/\.$/, "");
    };
    if (abs >= 1e9) return `${trim(num / 1e9)}B`;
    if (abs >= 1e6) return `${trim(num / 1e6)}M`;
    return num.toLocaleString("id-ID");
  };
  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  // compute totals for indicators (filtered by applied week range + search)
  const filtered = deposits.filter((d) => {
    const inWeek = d.week >= appliedWeekFrom && d.week <= appliedWeekTo;
    const matchSearch = appliedSearch ? d.member.toLowerCase().includes(appliedSearch.toLowerCase()) : true;
    return inWeek && matchSearch;
  });
  // pagination for deposits
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const PAGE_SIZE = pageSize;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pagedDeposits = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  // reset page when applied filters or page size change
  useEffect(() => {
    setPage(1);
  }, [appliedWeekFrom, appliedWeekTo, appliedSearch, pageSize]);
  const totals = filtered.reduce(
    (acc, d) => {
      acc.membersSet.add(d.member);
      acc.food += d.food || 0;
      acc.wood += d.wood || 0;
      acc.stone += d.stone || 0;
      acc.gold += d.gold || 0;
      return acc;
    },
    { membersSet: new Set(), food: 0, wood: 0, stone: 0, gold: 0 }
  );

  return (
    <div className="container mx-auto p-6 bg-gray-50 text-gray-800 rounded-2xl">
      <header className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif tracking-tight text-gray-800">Deposits</h1>
              <p className="text-sm text-gray-600">View and manage weekly deposits (resource model)</p>
            </div>
            <div>
              <button onClick={openAddModal} className="bg-indigo-600 text-white px-4 py-2 rounded">Add Deposit</button>
            </div>
          </header>

      {/* Filter card */}
      <div data-aos="fade-up" className="bg-white rounded-2xl shadow p-4 mb-4 border flex flex-col sm:flex-row gap-3 items-center">
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Week From</label>
          <input
            type="number"
            min="1"
            max="100"
            value={weekFromInput}
            onChange={(e) => setWeekFromInput(Number(e.target.value))}
            className="w-24 p-2 border rounded"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Week To</label>
          <input
            type="number"
            min="1"
            max="100"
            value={weekToInput}
            onChange={(e) => setWeekToInput(Number(e.target.value))}
            className="w-24 p-2 border rounded"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Search</label>
          <input
            type="text"
            placeholder="Member name"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-48 p-2 border rounded"
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <label className="text-sm text-gray-600">Page size</label>
          <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="p-2 border rounded">
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <button onClick={applyFilters} className="bg-indigo-600 text-white px-4 py-2 rounded">Apply</button>
        </div>
      </div>

      {/* Indicators */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
        <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-4 border">
          <div className="w-10 h-10 rounded-lg bg-indigo-400 flex items-center justify-center text-white font-semibold">👥</div>
          <div>
            <div className="text-xs text-gray-500">Members</div>
            <div className="text-xl font-bold">{totals.membersSet.size}</div>
            <div className="text-xs text-gray-500">unique contributors</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-4 border">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700">F</div>
          <div>
            <div className="text-xs text-gray-500">Food</div>
            <div className="text-xl font-bold">{formatShort(totals.food)}</div>
            <div className="text-xs text-gray-500">total</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-4 border">
          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700">W</div>
          <div>
            <div className="text-xs text-gray-500">Wood</div>
            <div className="text-xl font-bold">{formatShort(totals.wood)}</div>
            <div className="text-xs text-gray-500">total</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-4 border">
          <div className="w-10 h-10 rounded-full bg-slate-400 flex items-center justify-center text-slate-700">S</div>
          <div>
            <div className="text-xs text-gray-500">Stone</div>
            <div className="text-xl font-bold">{formatShort(totals.stone)}</div>
            <div className="text-xs text-gray-500">total</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-4 border">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">G</div>
          <div>
            <div className="text-xs text-gray-500">Gold</div>
            <div className="text-xl font-bold text-amber-600">{formatShort(totals.gold)}</div>
            <div className="text-xs text-gray-500">total</div>
          </div>
        </div>
      </section>

      {/* Table */}
      <div data-aos="fade-up" className="bg-white rounded-2xl shadow p-4">
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full table-fixed text-sm">
            <thead className="bg-gray-100">
              <tr className="text-xs text-gray-600">
                <th className="px-2 py-3 w-12 text-center">No</th>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Member</th>
                <th className="px-4 py-3">Week</th>
                <th className="px-4 py-3">Food</th>
                <th className="px-4 py-3">Wood</th>
                <th className="px-4 py-3">Stone</th>
                <th className="px-4 py-3">Gold</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y bg-white">
              {pagedDeposits.map((d, idx) => {
                const total = (d.food || 0) + (d.wood || 0) + (d.stone || 0) + (d.gold || 0);
                const number = (page - 1) * PAGE_SIZE + idx + 1;
                return (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-2 py-3 text-gray-700 w-12 text-center">{number}</td>
                    <td className="px-4 py-3 text-gray-700">{d.id}</td>
                    <td className="px-4 py-3 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mr-3 font-semibold">{getInitials(d.member)}</div>
                      <div className="font-medium text-gray-800">{d.member}</div>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700">{d.week}</td>
                    <td className="px-4 py-3 text-center text-gray-700">{formatShort(d.food)}</td>
                    <td className="px-4 py-3 text-center text-gray-700">{formatShort(d.wood)}</td>
                    <td className="px-4 py-3 text-center text-gray-700">{formatShort(d.stone)}</td>
                    <td className="px-4 py-3 text-center text-amber-600">{formatShort(d.gold)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-amber-600">{formatShort(total)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{d.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Add Deposit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black opacity-40" onClick={closeAddModal} aria-hidden="true" />
            <div role="dialog" aria-modal="true" className="relative z-50 w-full max-w-2xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Add Deposit</h3>
                    <p className="text-sm text-gray-500">Create a new deposit record — values are in IDR</p>
                  </div>
                  <button onClick={closeAddModal} className="p-2 rounded-full hover:bg-gray-100" aria-label="Close modal">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={addDeposit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="md:col-span-2 relative">
                        <label className="block text-xs font-medium text-gray-600">Member</label>
                        <input
                          type="text"
                          value={memberInput}
                          onChange={(e) => { setMemberInput(e.target.value); setShowMemberDropdown(true); setMemberHighlighted(0); }}
                          onFocus={() => setShowMemberDropdown(true)}
                          onKeyDown={handleMemberKeyDown}
                          placeholder="Search or type member name"
                          className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                          aria-autocomplete="list"
                          aria-expanded={showMemberDropdown}
                        />

                        {showMemberDropdown && filteredMemberSuggestions.length > 0 && (
                          <ul role="listbox" className="absolute z-50 mt-1 w-full max-h-48 overflow-auto rounded-lg border bg-white shadow-lg">
                            {filteredMemberSuggestions.map((name, i) => (
                              <li
                                key={name}
                                role="option"
                                aria-selected={memberHighlighted === i}
                                onMouseDown={(ev) => { ev.preventDefault(); /* prevent input blur */ }}
                                onClick={() => { setMemberInput(name); setShowMemberDropdown(false); }}
                                className={`px-3 py-2 text-sm cursor-pointer ${memberHighlighted === i ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
                              >
                                {name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600">Week</label>
                      <input type="number" min="1" max="100" value={weekInputModal} onChange={(e) => setWeekInputModal(Number(e.target.value))} className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 p-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600">Date</label>
                    <input type="date" value={dateInputModal} onChange={(e) => setDateInputModal(e.target.value)} className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                  </div>

                  <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600">Food</label>
                      <input type="number" value={foodInput} onChange={(e) => setFoodInput(e.target.value)} className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600">Wood</label>
                      <input type="number" value={woodInput} onChange={(e) => setWoodInput(e.target.value)} className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-200" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600">Stone</label>
                      <input type="number" value={stoneInput} onChange={(e) => setStoneInput(e.target.value)} className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600">Gold</label>
                      <input type="number" value={goldInput} onChange={(e) => setGoldInput(e.target.value)} className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200" />
                    </div>
                  </div>

                  <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
                    <button type="button" onClick={closeAddModal} className="px-4 py-2 rounded-lg border bg-white text-sm hover:bg-gray-50">Cancel</button>
                    <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700">Add Deposit</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Mobile list */}
        <div className="sm:hidden space-y-3">
          {pagedDeposits.map((d, idx) => {
            const total = (d.food || 0) + (d.wood || 0) + (d.stone || 0) + (d.gold || 0);
            const number = (page - 1) * PAGE_SIZE + idx + 1;
            return (
              <div key={d.id} className="bg-gray-50 rounded-xl p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3 text-xs text-gray-500">No. {number}</div>
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3 font-semibold">{getInitials(d.member)}</div>
                    <div>
                      <div className="font-medium text-gray-800">{d.member}</div>
                      <div className="text-xs text-gray-500">Week: {d.week} • {d.date}</div>
                    </div>
                  </div>
                  <div className="text-right font-semibold text-amber-600">{formatShort(total)}</div>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2 text-xs text-gray-600">
                  <div className="text-center">
                    <div className="text-amber-600 font-semibold">{formatShort(d.food)}</div>
                    <div>Food</div>
                  </div>
                  <div className="text-center">
                    <div className="text-yellow-600 font-semibold">{formatShort(d.wood)}</div>
                    <div>Wood</div>
                  </div>
                  <div className="text-center">
                    <div className="text-slate-700 font-semibold">{formatShort(d.stone)}</div>
                    <div>Stone</div>
                  </div>
                  <div className="text-center">
                    <div className="text-amber-700 font-semibold">{formatShort(d.gold)}</div>
                    <div>Gold</div>
                  </div>
                </div>
              </div>
            );
            })}
        </div>

        {/* Pagination controls for deposits */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">Showing {pagedDeposits.length} of {filtered.length} results</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded border bg-white disabled:opacity-50">Prev</button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded border ${page === i + 1 ? 'bg-indigo-600 text-white' : 'bg-white'}`}>{i + 1}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded border bg-white disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
