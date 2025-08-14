"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { observationGroupApi, ApiError } from "@/lib/api";
import { 
  UsersRound, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Users,
  Calendar,
  User,
  Shield,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles
} from "lucide-react";

interface Teacher {
  id: string;
  user: {
    name: string;
    email: string;
  };
  subject: string;
  grade: string;
  years_of_experience: number;
}

interface ObservationGroup {
  id: string;
  name: string;
  note: string;
  created_by: {
    name: string;
    email: string;
    role: string;
  };
  teachers: Teacher[];
  status: string;
  created_at: string;
  updated_at: string;
}

export default function ObservationGroupsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [observerFilter, setObserverFilter] = useState("All");
  const [groups, setGroups] = useState<ObservationGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch real data from backend
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const response = await observationGroupApi.getAll();
        setGroups((response.data as ObservationGroup[]) || []);
      } catch (err) {
        console.error("Error fetching observation groups:", err);
        setError("Failed to load observation groups");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);
  
  // Get unique observers for filter
  const observers = Array.from(new Set(groups.map(group => group.created_by.name)));
  
  // Filter groups based on search term and filters
  const filteredGroups = groups.filter(group => {
    const matchesSearch = 
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      group.created_by.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || group.status === statusFilter;
    const matchesObserver = observerFilter === "All" || group.created_by.name === observerFilter;
    
    return matchesSearch && matchesStatus && matchesObserver;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Loading Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600 rounded-3xl shadow-2xl">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 p-8">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <UsersRound className="h-8 w-8 text-white" />
              </div>
              <div className="text-white">
                <h1 className="text-3xl lg:text-4xl font-bold">Observation Groups</h1>
                <p className="text-white/90 text-lg mt-1">Manage teacher observation groups</p>
              </div>
            </div>
          </div>
        </div>
        
        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 rounded-2xl mb-4" style={{backgroundColor: 'rgba(132, 84, 124, 0.1)'}}>
              <RefreshCw className="h-8 w-8 animate-spin" style={{color: '#84547c'}} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading Observation Groups</h3>
            <p className="text-gray-500">Please wait while we fetch the group data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Modern Header */}
      <div className="relative overflow-hidden rounded-3xl shadow-2xl" style={{background: 'linear-gradient(90deg, rgba(132, 84, 124, 1) 0%, rgba(228, 164, 20, 1) 100%)'}}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-32 -translate-x-32"></div>
        
        <div className="relative z-10 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                  <UsersRound className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold">Observation Groups</h1>
                  <p className="text-white/90 text-lg mt-1">Manage teacher observation groups</p>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{groups.length}</div>
                  <div className="text-white/90 text-sm">Total Groups</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{groups.filter(g => g.status === 'Scheduled').length}</div>
                  <div className="text-white/90 text-sm">Scheduled</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{groups.filter(g => g.status === 'Completed').length}</div>
                  <div className="text-white/90 text-sm">Completed</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{groups.reduce((sum, g) => sum + g.teachers.length, 0)}</div>
                  <div className="text-white/90 text-sm">Total Teachers</div>
                </div>
              </div>
            </div>
            
            <div>
              <Link href="/super/groups/create">
                <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm rounded-2xl px-6 py-3 transition-all duration-300 hover:scale-105">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Group
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-r from-red-50 to-rose-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-3 rounded-2xl">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-red-800">Error Loading Groups</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modern Filters and Search */}
      <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
        <CardHeader className="border-b border-gray-100 p-6" style={{background: 'linear-gradient(90deg, rgba(132, 84, 124, 0.05) 0%, rgba(228, 164, 20, 0.05) 100%)'}}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl" style={{backgroundColor: 'rgba(132, 84, 124, 0.1)'}}>
              <Filter className="h-5 w-5" style={{color: '#84547c'}} />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-800">Search & Filters</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search by name or observer" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-2xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div>
              <select 
                className="w-full p-3 border border-gray-200 rounded-2xl bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                value={observerFilter}
                onChange={(e) => setObserverFilter(e.target.value)}
              >
                <option value="All">All Observers</option>
                {observers.map((observer, index) => (
                  <option key={index} value={observer}>{observer}</option>
                ))}
              </select>
            </div>
            <div>
              <select 
                className="w-full p-3 border border-gray-200 rounded-2xl bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <Button 
                variant="outline" 
                className="w-full rounded-2xl border-gray-200 hover:bg-gray-50 transition-all duration-300 hover:scale-105"
                onClick={() => {
                  setSearchTerm("");
                  setObserverFilter("All");
                  setStatusFilter("All");
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset Filters
              </Button>
            </div>
          </div>
          
          {/* Filter Results Summary */}
          <div className="mt-4 p-3 rounded-2xl" style={{backgroundColor: 'rgba(132, 84, 124, 0.05)'}}>
            <p className="text-sm" style={{color: '#84547c'}}>
              Showing <span className="font-semibold">{filteredGroups.length}</span> of <span className="font-semibold">{groups.length}</span> groups
              {searchTerm && <span> matching "{searchTerm}"</span>}
              {observerFilter !== "All" && <span> by "{observerFilter}"</span>}
              {statusFilter !== "All" && <span> with status "{statusFilter}"</span>}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Modern Groups List */}
      <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200" style={{background: 'linear-gradient(90deg, rgba(132, 84, 124, 0.05) 0%, rgba(228, 164, 20, 0.05) 100%)'}}>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Group Details</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Observer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Members</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredGroups.map((group) => {
                const getStatusIcon = (status: string) => {
                  switch (status) {
                    case 'Scheduled': return <Clock className="h-3 w-3" />;
                    case 'Completed': return <CheckCircle className="h-3 w-3" />;
                    case 'Cancelled': return <XCircle className="h-3 w-3" />;
                    default: return <Clock className="h-3 w-3" />;
                  }
                };

                const getStatusColor = (status: string) => {
                  switch (status) {
                    case 'Scheduled': return 'text-white';
                    case 'Completed': return 'bg-emerald-100 text-emerald-800';
                    case 'Cancelled': return 'bg-red-100 text-red-800';
                    default: return 'bg-gray-100 text-gray-800';
                  }
                };

                const getRoleIcon = (role: string) => {
                  switch (role) {
                    case 'Administrator': return <Shield className="h-3 w-3 text-green-600" />;
                    case 'Super User': return <Shield className="h-3 w-3" style={{color: '#84547c'}} />;
                    default: return <User className="h-3 w-3 text-gray-600" />;
                  }
                };

                return (
                  <tr key={group.id} className="transition-all duration-200" 
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(90deg, rgba(132, 84, 124, 0.05) 0%, rgba(228, 164, 20, 0.05) 100%)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl" style={{background: 'linear-gradient(135deg, rgba(132, 84, 124, 0.2) 0%, rgba(228, 164, 20, 0.2) 100%)'}}>
                          <UsersRound className="h-4 w-4" style={{color: '#84547c'}} />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{group.name}</div>
                          {group.note && (
                            <div className="text-sm text-gray-500 mt-1">{group.note}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg" style={{backgroundColor: 'rgba(228, 164, 20, 0.2)'}}>
                          {getRoleIcon(group.created_by.role)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{group.created_by.name}</div>
                          <div className="text-sm text-gray-500">{group.created_by.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg" style={{backgroundColor: 'rgba(132, 84, 124, 0.2)'}}>
                          <Users className="h-3 w-3" style={{color: '#84547c'}} />
                        </div>
                        <span className="font-medium text-gray-700">
                          {group.teachers.length} teacher{group.teachers.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="h-3 w-3" />
                        {formatDate(group.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span 
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(group.status)}`}
                        style={group.status === 'Scheduled' ? {backgroundColor: '#84547c'} : {}}
                      >
                        {getStatusIcon(group.status)}
                        {group.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex space-x-2">
                        <Link href={`/super/groups/${group.id}`}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="rounded-xl transition-all duration-200 hover:scale-105"
                            style={{color: '#84547c'}}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = '#84547c';
                              e.currentTarget.style.backgroundColor = 'rgba(132, 84, 124, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            View
                          </Button>
                        </Link>
                        <Link href={`/super/groups/edit/${group.id}`}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="rounded-xl transition-all duration-200 hover:scale-105"
                            style={{color: '#e4a414'}}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = '#e4a414';
                              e.currentTarget.style.backgroundColor = 'rgba(228, 164, 20, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <Edit className="mr-1 h-3 w-3" />
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredGroups.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="p-4 rounded-2xl mb-4" style={{backgroundColor: 'rgba(132, 84, 124, 0.1)'}}>
              <UsersRound className="h-8 w-8" style={{color: '#84547c'}} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {groups.length === 0 ? "No Observation Groups" : "No Groups Found"}
            </h3>
            <p className="text-gray-500">
              {groups.length === 0 
                ? "Create your first observation group to get started." 
                : "No groups found matching your current filters."}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
} 