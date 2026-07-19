import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users as UsersIcon,
  ShieldCheck,
  UserCheck,
  Mail,
  Copy,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";
import { getAllUsers } from "../../services/userService";

const PAGE_SIZE = 9;

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response);
    } catch (err) {
      console.error(err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const totalUsers = users.length;
  const totalAdmins = users.filter((u) => u.role === "admin").length;
  const totalLearners = totalUsers - totalAdmins;
  const totalVerified = users.filter((u) => u.is_verified).length;

  const filteredUsers = useMemo(() => {
    let result = users.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    if (roleFilter !== "All") {
      result = result.filter((u) => u.role === roleFilter.toLowerCase());
    }

    if (statusFilter === "Verified") {
      result = result.filter((u) => u.is_verified);
    } else if (statusFilter === "Pending") {
      result = result.filter((u) => !u.is_verified);
    }

    return result;
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  useEffect(() => {
    setPage(1);
  }, [search, roleFilter, statusFilter]);

  const handleCopyEmail = (user) => {
    navigator.clipboard.writeText(user.email);
    setCopiedId(user.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center gap-3 py-24">
          <div className="w-10 h-10 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin" />
          <p className="font-mono text-sm text-amber-300/70">
            ~/admin/users $ loading...
          </p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-10 text-center">
          <h2 className="text-2xl font-bold text-red-400">{error}</h2>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Hero */}
      <section className="mb-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] font-mono text-amber-300 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          {totalUsers} TOTAL USERS
        </span>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-amber-200 to-orange-300 bg-clip-text text-transparent">
          User Management
        </h1>
      </section>

      {/* User overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl border border-blue-400/25 bg-blue-400/10 text-blue-300">
            <UsersIcon size={22} />
          </div>
          <div>
            <p className="text-slate-400 text-xs">Total Users</p>
            <h3 className="text-2xl font-bold text-white">{totalUsers}</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl border border-emerald-400/25 bg-emerald-400/10 text-emerald-300">
            <UserCheck size={22} />
          </div>
          <div>
            <p className="text-slate-400 text-xs">Learners</p>
            <h3 className="text-2xl font-bold text-white">{totalLearners}</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl border border-fuchsia-400/25 bg-fuchsia-400/10 text-fuchsia-300">
            <ShieldCheck size={22} />
          </div>
          <div>
            <p className="text-slate-400 text-xs">Admins</p>
            <h3 className="text-2xl font-bold text-white">{totalAdmins}</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl border border-sky-400/25 bg-sky-400/10 text-sky-300">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-slate-400 text-xs">Verified</p>
            <h3 className="text-2xl font-bold text-white">{totalVerified}</h3>
          </div>
        </div>
      </div>

      {/* Search + filters */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 sm:p-5 mb-8 flex flex-col lg:flex-row gap-4 lg:items-center">
        <div className="flex items-center gap-3 bg-white/[0.05] border border-white/10 focus-within:border-amber-400/40 rounded-lg px-3.5 py-2.5 flex-1 transition-all duration-200">
          <Search size={18} className="text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-sm text-slate-200 placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {["All", "Admin", "Learner"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-mono transition-colors ${
                roleFilter === role
                  ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
                  : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-amber-400/40 transition-colors"
        >
          <option value="All" className="bg-slate-900">All Statuses</option>
          <option value="Verified" className="bg-slate-900">Verified</option>
          <option value="Pending" className="bg-slate-900">Pending</option>
        </select>
      </section>

      {/* User cards */}
      {filteredUsers.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-12 text-center">
          <h3 className="text-xl font-bold text-white">No users found</h3>
          <p className="text-slate-400 mt-2">
            Try a different search or filter.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 animate-fade-in">
            {paginatedUsers.map((user) => (
              <div
                key={user.id}
                className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 transition-all duration-300 ease-[var(--ease-premium)] hover:border-amber-400/25 hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-11 h-11 rounded-full shrink-0 flex items-center justify-center text-sm font-bold ${
                      user.role === "admin"
                        ? "bg-gradient-to-br from-fuchsia-400 to-purple-600 text-black"
                        : "bg-gradient-to-br from-amber-400 to-orange-500 text-black"
                    }`}
                  >
                    {getInitials(user.name)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[11px] font-mono ${
                      user.role === "admin"
                        ? "border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-300"
                        : "border-blue-400/30 bg-blue-400/10 text-blue-300"
                    }`}
                  >
                    {user.role === "admin" ? "Admin" : "Learner"}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-mono ${
                      user.is_verified
                        ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                        : "border-amber-400/30 bg-amber-400/10 text-amber-300"
                    }`}
                  >
                    {user.is_verified ? (
                      <CheckCircle2 size={12} />
                    ) : (
                      <Clock3 size={12} />
                    )}
                    {user.is_verified ? "Verified" : "Pending"}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                  <p className="text-xs text-slate-500">
                    Joined {new Date(user.created_at).toLocaleDateString()}
                  </p>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={`mailto:${user.email}`}
                      title="Email user"
                      className="p-2 rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 hover:text-amber-300 hover:border-amber-400/30 transition-colors"
                    >
                      <Mail size={15} />
                    </a>
                    <button
                      onClick={() => handleCopyEmail(user)}
                      title="Copy email"
                      className="p-2 rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 hover:text-amber-300 hover:border-amber-400/30 transition-colors"
                    >
                      {copiedId === user.id ? (
                        <CheckCircle2 size={15} className="text-emerald-300" />
                      ) : (
                        <Copy size={15} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {filteredUsers.length > PAGE_SIZE && (
            <div className="flex items-center justify-between mt-6 text-sm">
              <p className="text-slate-500 font-mono text-xs">
                Page {page} of {totalPages} · {filteredUsers.length} users
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2 text-slate-300 hover:text-amber-300 hover:border-amber-400/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2 text-slate-300 hover:text-amber-300 hover:border-amber-400/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}

export default AdminUsers;