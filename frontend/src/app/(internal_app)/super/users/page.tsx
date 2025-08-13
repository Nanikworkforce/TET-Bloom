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
import { 
  Users, 
  UserPlus, 
  Upload, 
  Search, 
  Filter, 
  Edit, 
  UserCheck, 
  UserX,
  GraduationCap,
  Shield,
  Crown,
  RefreshCw,
  AlertCircle,
  Calendar,
  Mail,
  Sparkles
} from "lucide-react";

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
    <div className="space-y-8">
      {/* Modern Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 rounded-3xl shadow-2xl">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-32 -translate-x-32"></div>
        
        <div className="relative z-10 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                  <Users className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold">User Management</h1>
                  <p className="text-emerald-100 text-lg mt-1">Manage all user accounts in the system</p>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{users.length}</div>
                  <div className="text-emerald-100 text-sm">Total Users</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{users.filter(u => u.status === 'Active').length}</div>
                  <div className="text-emerald-100 text-sm">Active</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{users.filter(u => u.role === 'Teacher').length}</div>
                  <div className="text-emerald-100 text-sm">Teachers</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{users.filter(u => u.role === 'Administrator').length}</div>
                  <div className="text-emerald-100 text-sm">Admins</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Link href="/super/users/create">
                <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm rounded-2xl px-6 py-3 transition-all duration-300 hover:scale-105">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Create User
                </Button>
              </Link>
              <Link href="/super/users/import">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 transition-all duration-300 hover:scale-105">
                  <Upload className="mr-2 h-5 w-5" />
                  Import Users
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Filters and Search */}
      <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-xl">
              <Filter className="h-5 w-5 text-blue-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-800">Search & Filters</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search by name or email" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
              />
            </div>
            <div>
              <select 
                className="w-full p-3 border border-gray-200 rounded-2xl bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
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
                className="w-full p-3 border border-gray-200 rounded-2xl bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
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
                className="w-full rounded-2xl border-gray-200 hover:bg-gray-50 transition-all duration-300 hover:scale-105"
                onClick={() => {
                  setSearchTerm("");
                  setRoleFilter("All");
                  setStatusFilter("All");
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset Filters
              </Button>
            </div>
          </div>
          
          {/* Filter Results Summary */}
          <div className="mt-4 p-3 bg-blue-50 rounded-2xl">
            <p className="text-sm text-blue-700">
              Showing <span className="font-semibold">{filteredUsers.length}</span> of <span className="font-semibold">{users.length}</span> users
              {searchTerm && <span> matching "{searchTerm}"</span>}
              {roleFilter !== "All" && <span> with role "{roleFilter}"</span>}
              {statusFilter !== "All" && <span> with status "{statusFilter}"</span>}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Modern User List */}
      <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-blue-100 p-4 rounded-2xl mb-4">
              <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading Users</h3>
            <p className="text-gray-500">Please wait while we fetch the user data...</p>
          </div>
        )}
        
        {error && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-red-100 p-4 rounded-2xl mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Users</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button 
              variant="outline" 
              className="rounded-2xl"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        )}
        
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role & Details</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredUsers.map((user) => {
                  const getRoleIcon = (role: string) => {
                    switch (role) {
                      case 'Teacher': return <GraduationCap className="h-4 w-4 text-blue-600" />;
                      case 'Administrator': return <Shield className="h-4 w-4 text-green-600" />;
                      case 'Super User': return <Crown className="h-4 w-4 text-purple-600" />;
                      default: return <Users className="h-4 w-4 text-gray-600" />;
                    }
                  };

                  const getRoleBadgeColor = (role: string) => {
                    switch (role) {
                      case 'Teacher': return 'bg-blue-100 text-blue-800';
                      case 'Administrator': return 'bg-green-100 text-green-800';
                      case 'Super User': return 'bg-purple-100 text-purple-800';
                      default: return 'bg-gray-100 text-gray-800';
                    }
                  };

                  return (
                    <tr key={user.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-2 rounded-xl">
                            {getRoleIcon(user.role)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{user.name}</div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div>
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                            {getRoleIcon(user.role)}
                            {user.role}
                          </span>
                          {user.teacher?.subject && (
                            <div className="text-sm text-gray-500 mt-1">
                              Subject: {user.teacher.subject}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="h-3 w-3" />
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          user.status === "Active" 
                            ? "bg-emerald-100 text-emerald-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {user.status === "Active" ? (
                            <UserCheck className="h-3 w-3" />
                          ) : (
                            <UserX className="h-3 w-3" />
                          )}
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex space-x-2">
                          <Link href={`/super/users/edit/${user.id}`}>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-105"
                            >
                              <Edit className="mr-1 h-3 w-3" />
                              Edit
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`rounded-xl transition-all duration-200 hover:scale-105 ${
                              user.status === "Active" 
                                ? "text-red-600 hover:text-red-800 hover:bg-red-50" 
                                : "text-green-600 hover:text-green-800 hover:bg-green-50"
                            }`}
                            onClick={() => handleStatusChange(user)}
                          >
                            {user.status === "Active" ? (
                              <>
                                <UserX className="mr-1 h-3 w-3" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="mr-1 h-3 w-3" />
                                Activate
                              </>
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="bg-gray-100 p-4 rounded-2xl mb-4">
                  <Users className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Users Found</h3>
                <p className="text-gray-500">No users found matching your current filters.</p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Modern Status Change Confirmation Dialog */}
      <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <AlertDialogContent className="rounded-3xl border-0 shadow-2xl">
          <AlertDialogHeader className="text-center">
            <div className="mx-auto mb-4">
              <div className={`p-4 rounded-2xl ${
                selectedUser?.status === "Active" 
                  ? "bg-red-100" 
                  : "bg-green-100"
              }`}>
                {selectedUser?.status === "Active" ? (
                  <UserX className="h-8 w-8 text-red-600 mx-auto" />
                ) : (
                  <UserCheck className="h-8 w-8 text-green-600 mx-auto" />
                )}
              </div>
            </div>
            <AlertDialogTitle className="text-xl font-semibold">
              {selectedUser?.status === "Active" ? "Deactivate User" : "Activate User"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 mt-2">
              {selectedUser?.status === "Active" 
                ? `Are you sure you want to deactivate ${selectedUser?.name}? They will no longer be able to access the system.` 
                : `Are you sure you want to activate ${selectedUser?.name}? They will regain access to the system.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-6">
            <AlertDialogCancel className="rounded-2xl border-gray-200 hover:bg-gray-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmStatusChange}
              className={`rounded-2xl transition-all duration-300 hover:scale-105 ${
                selectedUser?.status === "Active" 
                  ? "bg-red-500 hover:bg-red-600 text-white" 
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {selectedUser?.status === "Active" ? (
                <>
                  <UserX className="mr-2 h-4 w-4" />
                  Deactivate
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Activate
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 