import { NextResponse } from 'next/server';

// Mock teachers data - in a real app, this would come from a database
const teachers = [
  {
    id: "1",
    name: "Sarah Johnson",
    subject: "Mathematics",
    grade: "5th Grade",
    email: "sarah.johnson@school.edu",
    yearsOfExperience: 8
  },
  {
    id: "2",
    name: "Michael Chen",
    subject: "Science",
    grade: "7th Grade",
    email: "michael.chen@school.edu",
    yearsOfExperience: 5
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    subject: "English Literature",
    grade: "10th Grade",
    email: "emily.rodriguez@school.edu",
    yearsOfExperience: 12
  },
  {
    id: "4",
    name: "David Wilson",
    subject: "History",
    grade: "9th Grade",
    email: "david.wilson@school.edu",
    yearsOfExperience: 15
  },
  {
    id: "5",
    name: "Jessica Martinez",
    subject: "Art",
    grade: "Multiple",
    email: "jessica.martinez@school.edu",
    yearsOfExperience: 7
  },
  {
    id: "6",
    name: "Robert Thompson",
    subject: "Physical Education",
    grade: "Multiple",
    email: "robert.thompson@school.edu",
    yearsOfExperience: 10
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let filteredTeachers = teachers;

    // Filter teachers based on search query
    if (search) {
      const searchLower = search.toLowerCase();
      filteredTeachers = teachers.filter(teacher => 
        teacher.name.toLowerCase().includes(searchLower) ||
        teacher.subject.toLowerCase().includes(searchLower) ||
        teacher.grade.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredTeachers
    });

  } catch (error) {
    console.error('Error fetching teachers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teachers' },
      { status: 500 }
    );
  }
} 