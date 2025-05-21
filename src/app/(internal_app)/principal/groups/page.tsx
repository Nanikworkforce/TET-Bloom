"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock data for observation groups
const mockGroups = [
  {
    id: "1",
    name: "Math Department",
    observer: "David Wilson",
    observerRole: "School Leader",
    teacherCount: 8,
    lastObservation: "Feb 24, 2023",
    status: "Active"
  },
  {
    id: "2",
    name: "Science Department",
    observer: "Jessica Martinez",
    observerRole: "Vice School Leader",
    teacherCount: 6,
    lastObservation: "Feb 22, 2023",
    status: "Active"
  },
  {
    id: "3",
    name: "English Department",
    observer: "David Wilson",
    observerRole: "School Leader",
    teacherCount: 7,
    lastObservation: "Feb 18, 2023",
    status: "Active"
  },
  {
    id: "4",
    name: "New Teachers",
    observer: "Jessica Martinez",
    observerRole: "Vice School Leader",
    teacherCount: 5,
    lastObservation: "Feb 15, 2023",
    status: "Active"
  },
  {
    id: "5",
    name: "Special Education",
    observer: "David Wilson",
    observerRole: "School Leader",
    teacherCount: 4,
    lastObservation: "Feb 10, 2023",
    status: "Inactive"
  },
];

export default function PrincipalObservationGroupsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [observerFilter, setObserverFilter] = useState("All");
  
  // Get unique observers for filter
  const observers = Array.from(new Set(mockGroups.map(group => group.observer)));
  
  // Filter groups based on search term and filters
  const filteredGroups = mockGroups.filter(group => {
    const matchesSearch = 
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      group.observer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || group.status === statusFilter;
    const matchesObserver = observerFilter === "All" || group.observer === observerFilter;
    
    return matchesSearch && matchesStatus && matchesObserver;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Observation Groups (Principal)</h1>
          <p className="text-gray-600">Manage teacher observation groups as Principal</p>
        </div>
        <div>
          <Link href="/principal/groups/create">
            <Button className="rounded-full shadow-sm bg-primary/90 hover:bg-primary">
              <span className="mr-2">➕</span> Create Observation Group
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Observation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGroups.map((group) => (
                <tr key={group.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{group.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {group.observer}
                    <div className="text-xs text-gray-400">{group.observerRole}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{group.teacherCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{group.lastObservation}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      group.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {group.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link href={`/principal/groups/${group.id}`}>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                          View
                        </Button>
                      </Link>
                      <Link href={`/principal/groups/edit/${group.id}`}>
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
            <p className="text-gray-500">No observation groups found matching your filters.</p>
          </div>
        )}
      </Card>
    </div>
  );
} 