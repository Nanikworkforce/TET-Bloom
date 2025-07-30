"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { userApi, teacherApi, ApiError } from "@/lib/api";

// Interface for user data
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  teacher?: {
    subject: string;
    grade: string;
    years_of_experience: number;
  };
}

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Status change dialog state
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all users
        const usersResponse = await userApi.getAll();
        const usersData = (usersResponse.data as any[]) || [];
        
        // Fetch teacher data for teachers
        const teachersResponse = await teacherApi.getAll();
        const teachersData = (teachersResponse.data as any[]) || [];
        
        // Combine user and teacher data
        const combinedUsers = usersData.map((user: any) => {
          const teacher = teachersData.find((t: any) => t.user?.id === user.id);
          return {
            ...user,
            teacher: teacher ? {
              subject: teacher.subject,
              grade: teacher.grade,
              years_of_experience: teacher.years_of_experience
            } : undefined
          };
        });
        
        setUsers(combinedUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    const matchesStatus = statusFilter === "All" || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleStatusChange = (user: User) => {
    setSelectedUser(user);
    setStatusDialogOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedUser) return;
    
    try {
      const newStatus = selectedUser.status === "Active" ? "Inactive" : "Active";
      
      // Update user status in backend
      await userApi.update(selectedUser.id, { ...selectedUser, status: newStatus });
      
      // Update local state
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id ? { ...user, status: newStatus } : user
      );
      
      setUsers(updatedUsers);
      setStatusDialogOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Error updating user status:", err);
      setError("Failed to update user status. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600">Manage all user accounts in the system</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/super/users/create">
            <Button className="rounded-full shadow-sm bg-primary/90 hover:bg-primary">
              <span className="mr-2">➕</span> Create User
            </Button>
          </Link>
          <Link href="/super/users/import">
            <Button variant="outline" className="rounded-full shadow-sm">
              <span className="mr-2">📥</span> Import Users
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="border bg-white">
        <CardHeader className="pb-3">
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input 
                placeholder="Search by name or email" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-lg"
              />
            </div>
            <div>
              <select 
                className="w-full p-2 border rounded-lg"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="All">All Roles</option>
                <option value="Teacher">Teachers</option>
                <option value="Administrator">Administrators</option>
                <option value="Super User">Super Users</option>
              </select>
            </div>
            <div>
              <select 
                className="w-full p-2 border rounded-lg"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div>
              <Button 
                variant="outline" 
                className="w-full rounded-lg"
                onClick={() => {
                  setSearchTerm("");
                  setRoleFilter("All");
                  setStatusFilter("All");
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User List */}
      <Card className="border bg-white">
        {loading && (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading users...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        )}
        
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.teacher?.subject || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link href={`/super/users/edit/${user.id}`}>
                          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                            Edit
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`${user.status === "Active" ? "text-red-500 hover:text-red-400" : "text-green-500 hover:text-green-400"}`}
                          onClick={() => handleStatusChange(user)}
                        >
                          {user.status === "Active" ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500">No users found matching your filters.</p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Status Change Confirmation Dialog */}
      <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedUser?.status === "Active" ? "Deactivate User" : "Activate User"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser?.status === "Active" 
                ? `Are you sure you want to deactivate ${selectedUser?.name}? They will no longer be able to access the system.` 
                : `Are you sure you want to activate ${selectedUser?.name}? They will regain access to the system.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmStatusChange}
              className={selectedUser?.status === "Active" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
            >
              {selectedUser?.status === "Active" ? "Deactivate" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 