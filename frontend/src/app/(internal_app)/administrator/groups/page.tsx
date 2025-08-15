"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { observationGroupApi, ApiError } from "@/lib/api";
import { 
  UsersRound, 
  Plus, 
  Eye, 
  Edit, 
  Users, 
  Search, 
  Filter,
  Calendar,
  Shield,
  GraduationCap,
  TrendingUp,
  AlertCircle,
  RefreshCw
} from "lucide-react";

// Interface for observation group data from backend
interface ObservationGroup {
  id: string;
  name: string;
  note?: string;
  created_by: {
    id: string;
    name: string;
    email: string;
  };
  teachers: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
    subject: string;
    grade: string;
    years_of_experience: number;
  }[];
  status: string;
  created_at: string;
  updated_at: string;
}

export default function AdministratorObservationGroupsPage() {
  const { user, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [observerFilter, setObserverFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"assigned" | "all">("assigned");
  const [groups, setGroups] = useState<ObservationGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get current user name from auth context
  const currentUserName = user?.fullName || user?.email || "";
  
  // Fetch observation groups from backend
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await observationGroupApi.getAll();
        setGroups((response.data as ObservationGroup[]) || []);
      } catch (err) {
        console.error("Error fetching observation groups:", err);
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Failed to load observation groups. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);
  
  // Show loading state while auth is loading to prevent UI jumping
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Loading groups...</p>
        </div>
      </div>
    );
  }
  
  // Get unique observers for filter
  const observers = Array.from(new Set(groups.map(group => group.created_by.name)));
  
  // Filter groups based on view mode, search term, and filters
  const filteredGroups = groups.filter(group => {
    // Filter by view mode (assigned vs all groups)
    const matchesViewMode = viewMode === "all" || group.created_by.name === currentUserName || group.created_by.email === user?.email;
    
    const matchesSearch = 
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      group.created_by.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || group.status === statusFilter;
    const matchesObserver = observerFilter === "All" || group.created_by.name === observerFilter;
    
    return matchesViewMode && matchesSearch && matchesStatus && matchesObserver;
  });

  // Count groups for the current user
  const assignedGroupsCount = groups.filter(group => group.created_by.name === currentUserName || group.created_by.email === user?.email).length;
  const totalGroupsCount = groups.length;

  // Show loading state for data fetching
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Loading observation groups...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="bg-red-100 p-4 rounded-2xl mb-4 inline-block">
            <AlertCircle className="h-8 w-8 text-red-600 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Groups</h3>
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Observation Groups (Administrator)</h1>
          <p className="text-gray-600">
            {viewMode === "assigned" 
              ? `Viewing your assigned groups (${assignedGroupsCount} of ${totalGroupsCount} total)` 
              : "Viewing all observation groups"}
          </p>
        </div>
        <div>
          <Link href="/administrator/groups/create">
            <Button className="rounded-full shadow-sm text-white" style={{background: 'linear-gradient(90deg, rgba(132, 84, 124, 1) 0%, rgba(228, 164, 20, 1) 100%)'}}>
              <span className="mr-2">➕</span> Create Observation Group
            </Button>
          </Link>
        </div>
      </div>

      {/* View Mode Toggle */}
      <Card className="border bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span>View Options</span>
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("assigned")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "assigned"
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                My Groups ({assignedGroupsCount})
              </button>
              <button
                onClick={() => setViewMode("all")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "all"
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                All Groups ({totalGroupsCount})
              </button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input 
                placeholder="Search by name or observer" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-lg"
              />
            </div>
            <div>
              <select 
                className="w-full p-2 border rounded-lg"
                value={observerFilter}
                onChange={(e) => setObserverFilter(e.target.value)}
                disabled={viewMode === "assigned"} // Disable when viewing only assigned groups
              >
                <option value="All">All Observers</option>
                {observers.map((observer, index) => (
                  <option key={index} value={observer}>{observer}</option>
                ))}
              </select>
            </div>
            <div>
              <select 
                className="w-full p-2 border rounded-lg"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Scheduled</option>
                <option value="Inactive">Completed</option>
                <option value="Inactive">Canceled</option>
              </select>
            </div>
            <div>
              <Button 
                variant="outline" 
                className="w-full rounded-lg"
                onClick={() => {
                  setSearchTerm("");
                  setObserverFilter("All");
                  setStatusFilter("All");
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Groups List */}
      <Card className="border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teachers</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGroups.map((group) => {
                const isAssignedToUser = group.created_by.name === currentUserName || group.created_by.email === user?.email;
                const formattedDate = new Date(group.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                });
                
                return (
                  <tr key={group.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        {group.name}
                        {isAssignedToUser && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{backgroundColor: '#84547c'}}>
                            Assigned to me
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {group.created_by.name}
                      <div className="text-xs text-gray-400">Administrator</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{group.teachers?.length || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formattedDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        group.status === "Active" 
                          ? "text-white" 
                          : "bg-red-100 text-red-800"
                      }"
                      style={group.status === "Active" ? {backgroundColor: '#e4a414'} : {}}
                      }`}>
                        {group.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link href={`/administrator/groups/${group.id}`}>
                          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                            View
                          </Button>
                        </Link>
                        {isAssignedToUser ? (
                          <Link href={`/administrator/groups/edit/${group.id}`}>
                            <Button variant="ghost" size="sm" style={{color: '#84547c'}}>
                              Edit
                            </Button>
                          </Link>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-gray-400 cursor-not-allowed" 
                            disabled
                            title="You can only edit groups assigned to you"
                          >
                            Edit
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredGroups.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">
              {viewMode === "assigned" 
                ? "No assigned observation groups found matching your filters." 
                : "No observation groups found matching your filters."}
            </p>
            {viewMode === "assigned" && assignedGroupsCount === 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-400 mb-3">You don't have any assigned observation groups yet.</p>
                <Button 
                  variant="outline" 
                  onClick={() => setViewMode("all")}
                  className="rounded-full"
                >
                  View All Groups
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
} 