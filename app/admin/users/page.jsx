"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users", { credentials: "include" });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("FETCH ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id, name) => {
    if (!confirm(`Delete user "${name}"? This action cannot be undone.`)) return;
    
    try {
      const res = await fetch(`/api/users?id=${id}`, { 
        method: "DELETE",
        credentials: "include" 
      });
      
      if (res.ok) {
        toast.success(`User ${name} deleted successfully`);
        fetchUsers();
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      toast.error("Error deleting user");
    }
  };

  // ✅ Export Users as CSV
  const exportUsersCSV = () => {
    const headers = [
      "Name", 
      "Email", 
      "Phone", 
      "Role", 
      "Address", 
      "Joined Date",
      "Orders Count"
    ];
    
    const rows = filteredUsers.map(user => {
      // Count orders for this user (if available)
      const orderCount = user.orderCount || 0;
      
      return [
        user.name || "N/A",
        user.email || "N/A",
        user.phone || "N/A",
        user.role || "user",
        user.address || "N/A",
        new Date(user.createdAt).toLocaleDateString(),
        orderCount,
      ];
    });

    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Users exported successfully!");
  };

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = search === "" || 
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === "admin").length,
    customers: users.filter(u => u.role === "user").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
          <p className="mt-2 text-gray-400">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Export Button */}
        <div className="flex flex-wrap items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Users</h1>
            <p className="text-gray-400 text-sm mt-1">Manage customer accounts and administrators</p>
          </div>
          
          {/* ✅ Export Button */}
          <div className="flex gap-2 mt-2 md:mt-0">
            <button
              onClick={exportUsersCSV}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              📥 Export Users (CSV)
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 rounded-xl p-4 border-l-4 border-blue-500">
            <p className="text-sm text-gray-400">Total Users</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border-l-4 border-purple-500">
            <p className="text-sm text-gray-400">Administrators</p>
            <p className="text-2xl font-bold text-purple-400">{stats.admins}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border-l-4 border-green-500">
            <p className="text-sm text-gray-400">Customers</p>
            <p className="text-2xl font-bold text-green-400">{stats.customers}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="🔍 Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-400"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-400"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">Customer</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-750 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-yellow-400 font-bold text-sm">
                            {user.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <span className="text-white font-medium">{user.name || "Unknown"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin" 
                            ? "bg-purple-500/20 text-purple-400" 
                            : "bg-blue-500/20 text-blue-400"
                        }`}>
                          {user.role === "admin" ? "👑 Admin" : "👤 Customer"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => deleteUser(user._id, user.name)}
                          className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white px-3 py-1 rounded-lg text-sm transition"
                          disabled={user.role === "admin"}
                          title={user.role === "admin" ? "Cannot delete admin users" : "Delete user"}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-sm text-gray-400">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>
    </div>
  );
}