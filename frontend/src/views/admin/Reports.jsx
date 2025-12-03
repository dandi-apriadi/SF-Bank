import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Reports() {
  useEffect(() => {
    AOS.init({ once: true, duration: 600 });
  }, []);
  // recreate the same dummy data used in Dashboard and Deposits so charts match
  // Increased to 50 members as requested
  const [members] = useState(() => {
    const arr = [];
    for (let i = 1; i <= 50; i++) {
      arr.push({
        id: i,
        name: `Member ${i}`,
        food: 10000000 + i * 150000,
        wood: 8000000 + i * 120000,
        stone: 2000000 + i * 80000,
        gold: 500000 + i * 50000,
        weeksPaid: Math.min(100, (i * 3) % 101),
      });
    }
    return arr;
  });

  const [deposits] = useState(() => {
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

  const formatToMillions = (n) => {
    if (n === null || n === undefined) return "-";
    const num = Number(n) || 0;
    return num.toLocaleString("id-ID");
  };

  // Short formatter for millions/billions (1.2M, 2.5B)
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

  // Weeks baseline (same as Dashboard)
  const TOTAL_WEEKS = 100;

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  // Filters for reports (week range + member search)
  const [weekFromInput, setWeekFromInput] = useState(1);
  const [weekToInput, setWeekToInput] = useState(12);
  const [appliedWeekFrom, setAppliedWeekFrom] = useState(1);
  const [appliedWeekTo, setAppliedWeekTo] = useState(12);
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const applyFilters = () => {
    setAppliedWeekFrom(Number(weekFromInput) || 1);
    setAppliedWeekTo(Number(weekToInput) || 12);
    setAppliedSearch((searchInput || "").trim());
    setTopPage(1);
  };

  const resetFilters = () => {
    setWeekFromInput(1);
    setWeekToInput(12);
    setSearchInput("");
    setAppliedWeekFrom(1);
    setAppliedWeekTo(12);
    setAppliedSearch("");
    setTopPage(1);
  };

  // apply filters to deposits so charts & top-members reflect selection
  const filteredDeposits = deposits.filter((d) => {
    const inWeek = d.week >= appliedWeekFrom && d.week <= appliedWeekTo;
    const matchSearch = appliedSearch ? d.member.toLowerCase().includes(appliedSearch.toLowerCase()) : true;
    return inWeek && matchSearch;
  });

  // aggregate totals from filtered deposits
  const depositTotals = filteredDeposits.reduce(
    (acc, d) => {
      acc.food += d.food || 0;
      acc.wood += d.wood || 0;
      acc.stone += d.stone || 0;
      acc.gold += d.gold || 0;
      return acc;
    },
    { food: 0, wood: 0, stone: 0, gold: 0 }
  );

  const totalCollected = depositTotals.food + depositTotals.wood + depositTotals.stone + depositTotals.gold;
  const avgPerMember = Math.round(totalCollected / Math.max(1, members.length));

  // compute weeks based on members list and applied search (so Reports filter/search affects members shown)
  const filteredMembersBySearch = appliedSearch
    ? members.filter((m) => m.name.toLowerCase().includes(appliedSearch.toLowerCase()))
    : members;
  const totalWeeksAcross = filteredMembersBySearch.reduce((acc, m) => acc + (m.weeksPaid || 0), 0);
  const avgWeeks = filteredMembersBySearch.length ? Math.round(totalWeeksAcross / filteredMembersBySearch.length) : 0;
  const weeksProgress = Math.min(100, Math.round((avgWeeks / TOTAL_WEEKS) * 100));

  // compute totals per member from filtered deposits
  const memberMap = {};
  filteredDeposits.forEach((d) => {
    if (!memberMap[d.member]) memberMap[d.member] = { name: d.member, food: 0, wood: 0, stone: 0, gold: 0, total: 0 };
    memberMap[d.member].food += d.food || 0;
    memberMap[d.member].wood += d.wood || 0;
    memberMap[d.member].stone += d.stone || 0;
    memberMap[d.member].gold += d.gold || 0;
    memberMap[d.member].total += (d.food || 0) + (d.wood || 0) + (d.stone || 0) + (d.gold || 0);
  });
  const memberTotals = Object.values(memberMap);
  // top 20 for table, top 8 for the compact chart
  const topMembersFull = [...memberTotals].sort((a, b) => b.total - a.total).slice(0, 20);
  const topMembersChartItems = topMembersFull.slice(0, 8);
  // pagination for top members table
  const [topPage, setTopPage] = useState(1);
  const TOP_PAGE_SIZE = 10;
  const topTotalPages = Math.max(1, Math.ceil(topMembersFull.length / TOP_PAGE_SIZE));
  const pagedTopMembers = topMembersFull.slice((topPage - 1) * TOP_PAGE_SIZE, topPage * TOP_PAGE_SIZE);
  useEffect(() => {
    setTopPage(1);
  }, [topMembersFull.length]);

  // Simple SVG bar chart for resources
  const ResourceBarChart = ({ data }) => {
    const items = [
      { key: "food", label: "Food", value: data.food, color: "bg-amber-400", textColor: "text-amber-600" },
      { key: "wood", label: "Wood", value: data.wood, color: "bg-yellow-300", textColor: "text-yellow-600" },
      { key: "stone", label: "Stone", value: data.stone, color: "bg-slate-400", textColor: "text-slate-700" },
      { key: "gold", label: "Gold", value: data.gold, color: "bg-amber-200", textColor: "text-amber-700" },
    ];
    const max = Math.max(...items.map((i) => i.value), 1);
    return (
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-md font-semibold mb-3">Resource Breakdown (Deposits)</h3>
        <div className="space-y-3">
          {items.map((it) => {
            const pct = Math.round((it.value / max) * 100);
            return (
              <div key={it.key} className="flex items-center gap-3">
                <div className="w-24 text-xs text-gray-600">{it.label}</div>
                <div className="flex-1 bg-gray-100 rounded h-6 overflow-hidden">
                  <div className={`${it.color} h-6`} style={{ width: `${pct}%` }} />
                </div>
                <div className={`w-32 text-right text-sm ${it.textColor}`}>{formatShort(it.value)}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Horizontal bar chart for top members
  const TopMembersChart = ({ items }) => {
    const max = Math.max(...items.map((i) => i.total), 1);
    return (
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-md font-semibold mb-3">Top Members by Contribution</h3>
        <div className="space-y-3">
          {items.map((it, i) => {
            const pct = Math.round((it.total / max) * 100);
            const rankColor = i === 0 ? "bg-amber-400 text-amber-800" : i === 1 ? "bg-gray-200 text-gray-800" : i === 2 ? "bg-amber-200 text-amber-800" : "bg-indigo-50 text-indigo-700";
            return (
              <div key={it.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold ${rankColor}`}>{i + 1}</div>
                <div className="flex items-center gap-3 w-48">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-bold">{getInitials(it.name)}</div>
                  <div className="text-sm font-medium text-gray-800 truncate">{it.name}</div>
                </div>
                <div className="flex-1">
                  <div className="relative h-3 bg-gray-100 rounded overflow-hidden">
                    <div className="absolute left-0 top-0 h-3 rounded" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)' }} />
                  </div>
                </div>
                <div className="w-36 text-right">
                  <div className="text-sm font-semibold text-gray-900">{formatShort(it.total)}</div>
                  <div className="text-xs text-gray-500">{formatToMillions(it.total)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Reports</h1>
            <p className="text-sm text-gray-500 mt-1">Executive summary and downloadable data — updated with 50 members</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-white border px-4 py-2 rounded text-gray-700">Preview</button>
          </div>
        </div>
      </header>

      {/* Summary cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs text-gray-500">Total Members</div>
          <div className="text-2xl font-bold mt-1">{members.length}</div>
          <div className="text-sm text-gray-500 mt-2">Active members in dataset</div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs text-gray-500">Total Collected</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{formatShort(totalCollected)}</div>
          <div className="text-sm text-gray-500 mt-2">Sum of all resources</div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs text-gray-500">Avg / Member</div>
          <div className="text-2xl font-bold mt-1">{formatShort(avgPerMember)}</div>
          <div className="text-sm text-gray-500 mt-2">Average contribution per member</div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs text-gray-500">Reporting Range</div>
          <div className="text-2xl font-bold mt-1">Nov 2025</div>
          <div className="text-sm text-gray-500 mt-2">Static demo range</div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4">
          <div className="text-xs text-gray-500">Weeks (avg per member)</div>
          <div className="text-2xl font-bold text-gray-800 mt-1">{avgWeeks}/{TOTAL_WEEKS}</div>
          <div className="text-sm text-gray-600 mt-2">{weeksProgress}%</div>
          <div className="mt-3 bg-gray-100 rounded-full h-2 overflow-hidden">
            <div className="bg-amber-400 h-2" style={{ width: `${weeksProgress}%` }} />
          </div>
          <div className="text-xs text-gray-500 mt-2">Total weeks across members: <span className="text-amber-600 font-medium">{totalWeeksAcross}</span></div>
        </div>
      </section>

      {/* Filters + charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-1 bg-white rounded-2xl shadow p-4">
          <h3 className="text-md font-semibold mb-3">Filters</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Week From</label>
              <input
                type="number"
                min="1"
                max="100"
                value={weekFromInput}
                onChange={(e) => setWeekFromInput(Number(e.target.value))}
                className="w-full mt-1 p-2 border rounded"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Week To</label>
              <input
                type="number"
                min="1"
                max="100"
                value={weekToInput}
                onChange={(e) => setWeekToInput(Number(e.target.value))}
                className="w-full mt-1 p-2 border rounded"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Search member</label>
              <input
                type="text"
                placeholder="Member name"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full mt-1 p-2 border rounded"
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={applyFilters} className="bg-indigo-600 text-white px-4 py-2 rounded">Apply</button>
              <button onClick={resetFilters} className="bg-white border px-4 py-2 rounded">Reset</button>
            </div>
          </div>
        </div>

        <div className="col-span-2 grid grid-cols-1 gap-4">
          <ResourceBarChart data={depositTotals} />
          <TopMembersChart items={topMembersChartItems} />
        </div>
      </div>

      {/* Top members table */}
      <div className="mt-6 bg-white rounded-2xl shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Top Members</h3>
          <div className="text-sm text-gray-500">Top 20 by contribution</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-sm">
            <thead className="bg-gray-100">
                <tr className="text-xs text-gray-600">
                  <th className="px-2 py-3 w-12 text-center">No</th>
                  <th className="px-4 py-3 text-left">Member</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Food</th>
                  <th className="px-4 py-3">Wood</th>
                  <th className="px-4 py-3">Stone</th>
                  <th className="px-4 py-3">Gold</th>
                </tr>
            </thead>
            <tbody className="divide-y bg-white">
                {pagedTopMembers.map((m, idx) => {
                  // find member resources
                  const mem = members.find((mm) => mm.name === m.name) || {};
                  const globalIndex = (topPage - 1) * TOP_PAGE_SIZE + idx + 1;
                  return (
                    <tr key={m.name} className="hover:bg-gray-50 even:bg-gray-50">
                      <td className="px-2 py-3 text-gray-700 w-12 text-center">{globalIndex}</td>
                      <td className="px-4 py-3 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-bold">{getInitials(m.name)}</div>
                        <div className="font-medium text-gray-800">{m.name}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-amber-600">
                        <div className="text-sm font-semibold">{formatShort(m.total)}</div>
                        <div className="text-xs text-gray-500">{formatToMillions(m.total)}</div>
                      </td>
                      <td className="px-4 py-3 text-center">{formatShort(mem.food)}</td>
                      <td className="px-4 py-3 text-center">{formatShort(mem.wood)}</td>
                      <td className="px-4 py-3 text-center">{formatShort(mem.stone)}</td>
                      <td className="px-4 py-3 text-center">{formatShort(mem.gold)}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
        {/* Pagination for Top Members table */}
        <div className="flex items-center justify-between mt-3">
          <div className="text-sm text-gray-600">
            {topMembersFull.length === 0 ? (
              "No members"
            ) : (
              `Showing ${(topPage - 1) * TOP_PAGE_SIZE + 1}–${Math.min(topPage * TOP_PAGE_SIZE, topMembersFull.length)} of ${topMembersFull.length}`
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setTopPage((p) => Math.max(1, p - 1))} disabled={topPage === 1} className="px-3 py-1 rounded border bg-white disabled:opacity-50">Prev</button>
            {Array.from({ length: topTotalPages }).map((_, i) => (
              <button key={i} onClick={() => setTopPage(i + 1)} className={`px-3 py-1 rounded border ${topPage === i + 1 ? 'bg-indigo-600 text-white' : 'bg-white'}`}>{i + 1}</button>
            ))}
            <button onClick={() => setTopPage((p) => Math.min(topTotalPages, p + 1))} disabled={topPage === topTotalPages} className="px-3 py-1 rounded border bg-white disabled:opacity-50">Next</button>
          </div>
        </div>
    </div>
  );
}
