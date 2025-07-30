"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { observationGroupApi, ApiError } from "@/lib/api";

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
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Observation Groups</h1>
            <p className="text-gray-600">Manage teacher observation groups</p>
          </div>
        </div>
        <Card className="border bg-white">
          <CardContent className="pt-6 flex items-center justify-center py-12">
            <div className="text-gray-600">Loading observation groups...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Observation Groups</h1>
          <p className="text-gray-600">Manage teacher observation groups</p>
        </div>
        <div>
          <Link href="/super/groups/create">
            <Button className="rounded-full shadow-sm bg-primary/90 hover:bg-primary">
              <span className="mr-2">➕</span> Create Observation Group
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Filters and Search */}
      <Card className="border bg-white">
        <CardHeader className="pb-3">
          <CardTitle>Filters</CardTitle>
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
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGroups.map((group) => (
                <tr key={group.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {group.name}
                    {group.note && (
                      <div className="text-xs text-gray-400 mt-1">{group.note}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {group.created_by.name}
                    <div className="text-xs text-gray-400">{group.created_by.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {group.teachers.length} teacher{group.teachers.length !== 1 ? 's' : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(group.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      group.status === "Scheduled" ? "bg-blue-100 text-blue-800" :
                      group.status === "Completed" ? "bg-green-100 text-green-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {group.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link href={`/super/groups/${group.id}`}>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                          View
                        </Button>
                      </Link>
                      <Link href={`/super/groups/edit/${group.id}`}>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredGroups.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">
              {groups.length === 0 ? "No observation groups found." : "No observation groups found matching your filters."}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
} 