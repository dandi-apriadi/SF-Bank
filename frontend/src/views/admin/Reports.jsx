import React, { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

export default function Reports() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
      subtree: false
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    AOS.init({ once: true, duration: 600 });
  }, []);
  const [members, setMembers] = useState([]);
  const [alliances, setAlliances] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatToMillions = (n) => {
    if (n === null || n === undefined) return "-";
    const num = Number(n) || 0;
    return num.toLocaleString("id-ID");
  };

  const formatPercent = (value) => {
    if (value === null || value === undefined || Number.isNaN(value)) return "-";
    return `${value.toFixed(1)}%`;
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

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_BASE_URL}/api/v1/reports/summary`, {
        withCredentials: true,
      });
      setMembers(res.data.members || []);
      setAlliances(res.data.alliances || []);
      setDeposits(res.data.deposits || []);
    } catch (err) {
      console.error('Fetch reports summary error:', err);
      setError(err.response?.data?.msg || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

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

  // Alliance level aggregates
  const allianceTotals = alliances.reduce(
    (acc, a) => {
      acc.food += a.food || 0;
      acc.wood += a.wood || 0;
      acc.stone += a.stone || 0;
      acc.gold += a.gold || 0;
      acc.members += a.membersCount || 0;
      return acc;
    },
    { food: 0, wood: 0, stone: 0, gold: 0, members: 0 }
  );
  const allianceTotalResource = allianceTotals.food + allianceTotals.wood + allianceTotals.stone + allianceTotals.gold;
  const avgAllianceMembers = alliances.length ? Math.round(allianceTotals.members / alliances.length) : 0;
  const avgAllianceResource = alliances.length ? Math.round(allianceTotalResource / alliances.length) : 0;
  const topAlliances = [...alliances]
    .map((a) => ({
      ...a,
      total: (a.food || 0) + (a.wood || 0) + (a.stone || 0) + (a.gold || 0),
      perMember: a.membersCount ? ((a.food + a.wood + a.stone + a.gold) / a.membersCount) : 0,
    }))
    .sort((a, b) => b.total - a.total);

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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <h3 className="text-md font-semibold mb-3">Top Members by Contribution</h3>
        <div className="space-y-3">
          {items.map((it, i) => {
            const pct = Math.round((it.total / max) * 100);
            const rankColor = i === 0 ? "bg-amber-400 text-amber-800" : i === 1 ? "bg-gray-200 text-gray-800" : i === 2 ? "bg-amber-200 text-amber-800" : "bg-indigo-50 text-indigo-700";
            const allianceName = members.find((m) => m.name === it.name)?.alliance || "-";
            return (
              <div key={it.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold ${rankColor}`}>{i + 1}</div>
                <div className="w-48">
                  <div className="text-sm font-medium text-gray-800 truncate">{it.name}</div>
                  <div className="text-xs text-gray-500 truncate">{allianceName}</div>
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
    <div className="w-full min-h-full flex flex-col bg-slate-50 transition-colors duration-300" style={{backgroundColor: isDarkMode ? '#111c44' : '#f8fafc'}}>
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <header className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-semibold">Reports</h1>
              <p className="text-sm text-gray-500 mt-1">Executive summary with alliance & member contribution insights</p>
            </div>
          </div>
        </header>

      {/* Summary cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="text-xs text-gray-500">Total Members</div>
          <div className="text-2xl font-bold mt-1">{members.length}</div>
          <div className="text-sm text-gray-500 mt-2">Active members in dataset</div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="text-xs text-gray-500">Total Collected</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{formatShort(totalCollected)}</div>
          <div className="text-sm text-gray-500 mt-2">Sum of all resources</div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="text-xs text-gray-500">Avg / Member</div>
          <div className="text-2xl font-bold mt-1">{formatShort(avgPerMember)}</div>
          <div className="text-sm text-gray-500 mt-2">Average contribution per member</div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="text-xs text-gray-500">Weeks (avg per member)</div>
          <div className="text-2xl font-bold text-gray-800 mt-1">{avgWeeks}/{TOTAL_WEEKS}</div>
          <div className="text-sm text-gray-600 mt-2">{weeksProgress}%</div>
          <div className="mt-3 bg-gray-100 rounded-full h-2 overflow-hidden">
            <div className="bg-amber-400 h-2" style={{ width: `${weeksProgress}%` }} />
          </div>
          <div className="text-xs text-gray-500 mt-2">Total weeks across members: <span className="text-amber-600 font-medium">{totalWeeksAcross}</span></div>
        </div>
      </section>

      {/* Alliance insights */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="text-xs text-gray-500">Alliances</div>
          <div className="text-2xl font-bold mt-1">{alliances.length}</div>
          <div className="text-sm text-gray-500 mt-2">Active alliance groups</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="text-xs text-gray-500">Avg Members / Alliance</div>
          <div className="text-2xl font-bold mt-1">{avgAllianceMembers}</div>
          <div className="text-sm text-gray-500 mt-2">Mean roster size</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="text-xs text-gray-500">Total Alliance RSS</div>
          <div className="text-2xl font-bold text-indigo-600 mt-1">{formatShort(allianceTotalResource)}</div>
          <div className="text-sm text-gray-500 mt-2">Food + Wood + Stone + Gold</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="text-xs text-gray-500">Avg RSS / Alliance</div>
          <div className="text-2xl font-bold mt-1">{formatShort(avgAllianceResource)}</div>
          <div className="text-sm text-gray-500 mt-2">Resource average per alliance</div>
        </div>
      </section>

      {/* Filters + charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
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

        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResourceBarChart data={depositTotals} />
          <TopMembersChart items={topMembersChartItems} />
        </div>
      </div>

      {/* Alliance performance */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Alliance Performance</h3>
            <span className="text-sm text-gray-500">Sorted by total resources</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[880px]">
              <thead className="bg-gray-100">
                <tr className="text-xs text-gray-600">
                  <th className="px-3 py-2 text-left">Alliance</th>
                  <th className="px-3 py-2 text-center">Members</th>
                  <th className="px-3 py-2 text-right">Total</th>
                  <th className="px-3 py-2 text-right">Food</th>
                  <th className="px-3 py-2 text-right">Wood</th>
                  <th className="px-3 py-2 text-right">Stone</th>
                  <th className="px-3 py-2 text-right">Gold</th>
                  <th className="px-3 py-2 text-right">Per Member</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {topAlliances.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <div className="font-semibold text-gray-900">{a.name}</div>
                      <div className="text-xs text-gray-500">{a.tag}</div>
                    </td>
                    <td className="px-3 py-2 text-center font-medium text-gray-800">{a.membersCount}</td>
                    <td className="px-3 py-2 text-right font-semibold text-indigo-600">{formatShort(a.total)}</td>
                    <td className="px-3 py-2 text-right">{formatShort(a.food)}</td>
                    <td className="px-3 py-2 text-right">{formatShort(a.wood)}</td>
                    <td className="px-3 py-2 text-right">{formatShort(a.stone)}</td>
                    <td className="px-3 py-2 text-right">{formatShort(a.gold)}</td>
                    <td className="px-3 py-2 text-right text-gray-700">{formatShort(a.perMember)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-md font-semibold mb-3">Alliance Snapshot</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Top Alliance Share</div>
              <div className="text-base font-semibold text-indigo-600">
                {topAlliances[0] ? formatPercent((topAlliances[0].total / Math.max(1, allianceTotalResource)) * 100) : "-"}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Top Alliance Per Member</div>
              <div className="text-base font-semibold text-gray-900">
                {topAlliances[0] ? formatShort(topAlliances[0].perMember) : "-"}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Alliance Avg per Member</div>
              <div className="text-base font-semibold text-gray-900">{formatShort(allianceTotals.members ? allianceTotalResource / allianceTotals.members : 0)}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Members Covered</div>
              <div className="text-base font-semibold text-gray-900">{allianceTotals.members}</div>
            </div>
            <div className="mt-4 bg-gray-100 rounded-xl p-3">
              <div className="text-xs text-gray-600 mb-1">Resource Mix</div>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center justify-between">
                  <span>Food</span>
                  <span>{formatShort(allianceTotals.food)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Wood</span>
                  <span>{formatShort(allianceTotals.wood)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Stone</span>
                  <span>{formatShort(allianceTotals.stone)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Gold</span>
                  <span>{formatShort(allianceTotals.gold)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-indigo-50 rounded-xl p-3 border border-indigo-100">
              <div className="text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-2">Top RSS Alliances</div>
              <div className="space-y-2">
                {topAlliances.slice(0, 3).map((a, idx) => (
                  <div key={a.id} className="flex items-center justify-between p-2 rounded-lg bg-white border border-indigo-100 shadow-sm">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">#{idx + 1} {a.name}</div>
                      <div className="text-xs text-gray-500">{a.tag} · {a.membersCount} members</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-indigo-700">{formatShort(a.total)}</div>
                      <div className="text-[11px] text-gray-500">{formatPercent((a.total / Math.max(1, allianceTotalResource)) * 100)} of total</div>
                    </div>
                  </div>
                ))}
                {topAlliances.length === 0 && (
                  <div className="text-sm text-gray-500">No alliance data</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top members table */}
      <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Top Members</h3>
          <div className="text-sm text-gray-500">Top 20 by contribution</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-sm min-w-[960px]">
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
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{m.name}</div>
                        <div className="text-xs text-gray-500">{mem.alliance || "-"}</div>
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
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {topMembersFull.length === 0 ? (
              "No members"
            ) : (
              `Showing ${(topPage - 1) * TOP_PAGE_SIZE + 1}–${Math.min(topPage * TOP_PAGE_SIZE, topMembersFull.length)} of ${topMembersFull.length}`
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setTopPage((p) => Math.max(1, p - 1))} disabled={topPage === 1} className="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Prev</button>
            {Array.from({ length: topTotalPages }).map((_, i) => (
              <button key={i} onClick={() => setTopPage(i + 1)} className={`px-3 py-2 rounded-lg border text-sm font-medium ${topPage === i + 1 ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white hover:bg-gray-50'}`}>{i + 1}</button>
            ))}
            <button onClick={() => setTopPage((p) => Math.min(topTotalPages, p + 1))} disabled={topPage === topTotalPages} className="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
