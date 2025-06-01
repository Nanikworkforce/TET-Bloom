'use client';
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

// Mock data for a specific observation group
const groupData = {
  id: "1",
  name: "Math Department - Elementary",
  observer: "Administrator Johnson",
  created: "Feb 15, 2023",
  lastActivity: "Mar 2, 2023",
  status: "active"
};

// Mock teachers assigned to this group
const assignedTeachers = [
  {
    id: "t1",
    name: "Sarah Chen",
    email: "schen@school.edu",
    subject: "Mathematics",
    grade: "5th Grade",
    experience: "3 years",
    lastObservation: "Feb 20, 2023",
    status: "Good Standing"
  },
  {
    id: "t2",
    name: "Michael Rodriguez",
    email: "mrodriguez@school.edu",
    subject: "Mathematics",
    grade: "4th Grade",
    experience: "5 years",
    lastObservation: "Feb 15, 2023",
    status: "Good Standing"
  },
  {
    id: "t3",
    name: "Emily Wilson",
    email: "ewilson@school.edu",
    subject: "Mathematics",
    grade: "3rd Grade",
    experience: "2 years",
    lastObservation: "Mar 1, 2023",
    status: "Needs Support"
  },
  {
    id: "t4",
    name: "David Johnson",
    email: "djohnson@school.edu",
    subject: "Mathematics",
    grade: "5th Grade",
    experience: "7 years",
    lastObservation: "Feb 10, 2023",
    status: "Good Standing"
  }
];

// Mock data for available teachers to add
const availableTeachers = [
  {
    id: "t5",
    name: "Jason Kim",
    email: "jkim@school.edu",
    subject: "Mathematics",
    grade: "2nd Grade",
    experience: "4 years"
  },
  {
    id: "t6",
    name: "Lisa Garcia",
    email: "lgarcia@school.edu",
    subject: "Mathematics",
    grade: "1st Grade",
    experience: "8 years"
  },
  {
    id: "t7",
    name: "Robert Smith",
    email: "rsmith@school.edu",
    subject: "Mathematics",
    grade: "5th Grade",
    experience: "1 year"
  }
];

// Mock observation data
const recentObservations = [
  {
    id: "o1",
    teacher: "Sarah Chen",
    date: "Feb 20, 2023",
    status: "Completed",
    feedback: "Approved"
  },
  {
    id: "o2",
    teacher: "Michael Rodriguez",
    date: "Feb 15, 2023",
    status: "Completed",
    feedback: "Pending Review"
  },
  {
    id: "o3",
    teacher: "Emily Wilson",
    date: "Mar 1, 2023",
    status: "Completed",
    feedback: "Approved"
  }
];

export default function ObservationGroupDetailsPage() {
  const params = useParams();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const groupId = params.id as string;
  
  const [isEditing, setIsEditing] = useState(false);
  const [showAddTeachers, setShowAddTeachers] = useState(false);
  const [groupName, setGroupName] = useState(groupData.name);
  const [selectedObserver, setSelectedObserver] = useState(groupData.observer);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  
  const handleSaveChanges = () => {
    // In a real implementation, this would save changes to the group
    setIsEditing(false);
  };
  
  const handleAddTeachers = () => {
    // In a real implementation, this would add the selected teachers to the group
    setShowAddTeachers(false);
    setSelectedTeachers([]);
  };
  
  const toggleTeacherSelection = (teacherId: string) => {
    setSelectedTeachers(prev => 
      prev.includes(teacherId) 
        ? prev.filter(id => id !== teacherId)
        : [...prev, teacherId]
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditing ? "Edit Group" : groupData.name}
          </h1>
          <p className="text-gray-600">
            {isEditing ? "Update group details" : `Managed by ${groupData.observer}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/super/groups">
            <Button variant="outline" className="rounded-full shadow-sm">
              ← Back to Groups
            </Button>
          </Link>
          {!isEditing && (
            <Button 
              className="rounded-full bg-primary/90 hover:bg-primary shadow-sm"
              onClick={() => setIsEditing(true)}
            >
              <span className="mr-2">✏️</span> Edit Group
            </Button>
          )}
        </div>
      </div>

      {/* Edit Mode */}
      {isEditing && (
        <Card className="border p-6 bg-white">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="groupName">Group Name</Label>
              <input
                id="groupName"
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter group name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="observer">Observer (Administrator)</Label>
              <select
                id="observer"
                value={selectedObserver}
                onChange={(e) => setSelectedObserver(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="Administrator Johnson">Administrator Johnson</option>
                <option value="Vice Administrator Smith">Vice Administrator Smith</option>
                <option value="Administrator Williams">Administrator Williams</option>
                <option value="Coordinator Davis">Coordinator Davis</option>
              </select>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                className="rounded-full"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button 
                className="rounded-full"
                onClick={handleSaveChanges}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Card>
      )}

      {!isEditing && (
        <>
          {/* Group Info Card */}
          <Card className="border p-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Observer</p>
                <p className="mt-1 font-medium">{groupData.observer}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Teachers</p>
                <p className="mt-1 font-medium">{assignedTeachers.length}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Created On</p>
                <p className="mt-1 font-medium">{groupData.created}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Last Activity</p>
                <p className="mt-1 font-medium">{groupData.lastActivity}</p>
              </div>
            </div>
          </Card>

          {/* Teachers Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h2 className="text-xl font-semibold">Assigned Teachers</h2>
            <Button 
              variant="outline" 
              className="rounded-full"
              onClick={() => setShowAddTeachers(true)}
            >
              <span className="mr-2">➕</span> Add Teachers
            </Button>
          </div>

          {/* Teachers List */}
          {assignedTeachers.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {assignedTeachers.map((teacher) => (
                <Card key={teacher.id} className="p-4 border hover:shadow-sm transition-shadow bg-white">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{teacher.name}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          teacher.status === "Good Standing" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {teacher.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">{teacher.email}</div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                        <div>{teacher.subject}</div>
                        <div>{teacher.grade}</div>
                        <div>{teacher.experience} Experience</div>
                        <div>Last Observation: {teacher.lastObservation}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/super/teachers/${teacher.id}`}>
                        <Button variant="outline" size="sm" className="rounded-full">
                          View Profile
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="rounded-full text-red-600 hover:bg-red-50 hover:text-red-700">
                        Remove
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center border bg-white">
              <div className="py-8">
                <div className="mb-4 mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-400 text-2xl">👩‍🏫</span>
                </div>
                <h3 className="text-lg font-medium mb-2">No Teachers Assigned</h3>
                <p className="text-gray-500 mb-4">This observation group doesn't have any teachers assigned yet.</p>
                <Button 
                  className="rounded-full"
                  onClick={() => setShowAddTeachers(true)}
                >
                  <span className="mr-2">➕</span> Add Teachers
                </Button>
              </div>
            </Card>
          )}

          {/* Recent Observations Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Recent Observations</h2>
            
            {recentObservations.length > 0 ? (
              <Card className="border overflow-hidden bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left">Teacher</th>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Feedback</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {recentObservations.map((observation) => (
                        <tr key={observation.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">{observation.teacher}</td>
                          <td className="px-4 py-3">{observation.date}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {observation.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {observation.feedback}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <Link href={`/super/observations/${observation.id}`}>
                              <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10">
                                View Details
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ) : (
              <Card className="p-6 text-center border bg-white">
                <div className="py-8">
                  <div className="mb-4 mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-gray-400 text-2xl">📋</span>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Observations Yet</h3>
                  <p className="text-gray-500">No observations have been recorded for this group yet.</p>
                </div>
              </Card>
            )}
          </div>
        </>
      )}

      {/* Add Teachers Modal */}
      {showAddTeachers && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="border max-w-2xl w-full max-h-[90vh] bg-white overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold text-lg">Add Teachers to Group</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full h-8 w-8 p-0"
                onClick={() => setShowAddTeachers(false)}
              >
                ✕
              </Button>
            </div>
            
            <div className="p-4">
              <div className="relative rounded-lg bg-gray-100 px-3 py-2 flex items-center mb-4">
                <span className="text-gray-500 mr-2">🔍</span>
                <input
                  type="text"
                  placeholder="Search teachers..."
                  className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-500"
                />
              </div>
              
              <div className="overflow-auto max-h-[50vh]">
                <div className="grid grid-cols-1 gap-2">
                  {availableTeachers.map((teacher) => (
                    <div 
                      key={teacher.id} 
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedTeachers.includes(teacher.id) 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleTeacherSelection(teacher.id)}
                    >
                      <div className="flex items-start gap-3">
                        <input 
                          type="checkbox" 
                          checked={selectedTeachers.includes(teacher.id)}
                          onChange={() => {}}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium">{teacher.name}</div>
                          <div className="text-sm text-gray-600">{teacher.email}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {teacher.subject} | {teacher.grade} | {teacher.experience} Experience
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t mt-auto bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {selectedTeachers.length} teachers selected
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="rounded-full"
                    onClick={() => setShowAddTeachers(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="rounded-full"
                    disabled={selectedTeachers.length === 0}
                    onClick={handleAddTeachers}
                  >
                    Add to Group
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
} 