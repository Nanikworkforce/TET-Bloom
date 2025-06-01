import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { teacherId, date, time, type, notes, observerId } = body;

    // Validate required fields
    if (!teacherId || !date || !time || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Mock teacher lookup - in a real app, this would be a database query
    const teachers = [
      { id: "1", name: "Sarah Johnson", email: "sarah.johnson@school.edu" },
      { id: "2", name: "Michael Chen", email: "michael.chen@school.edu" },
      { id: "3", name: "Emily Rodriguez", email: "emily.rodriguez@school.edu" },
      { id: "4", name: "David Wilson", email: "david.wilson@school.edu" },
      { id: "5", name: "Jessica Martinez", email: "jessica.martinez@school.edu" },
      { id: "6", name: "Robert Thompson", email: "robert.thompson@school.edu" }
    ];

    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) {
      return NextResponse.json(
        { error: 'Teacher not found' },
        { status: 404 }
      );
    }

    // Create observation record - in a real app, this would be saved to a database
    const observationRecord = {
      id: Math.random().toString(36).substring(7), // Generate random ID
      teacherId,
      teacher: teacher.name,
      date,
      time,
      type,
      notes: notes || '',
      status: 'scheduled',
      observerId: observerId || 'admin1',
      createdAt: new Date().toISOString()
    };

    // Send notification to teacher (mock implementation)
    // In a real app, this would be an email service, in-app notification, etc.
    const notificationMessage = {
      to: teacher.email,
      subject: `New ${type} observation scheduled`,
      message: `Hello ${teacher.name},

A new ${type} observation has been scheduled for you:

Date: ${date}
Time: ${time}
${notes ? `Notes: ${notes}` : ''}

Please prepare accordingly and ensure you have your lesson plans ready.

Best regards,
Your Administrator`
    };

    console.log('Notification sent:', notificationMessage);

    // In a real app, you might also add the notification to a notifications table
    const notification = {
      id: Math.random().toString(36).substring(7),
      userId: teacherId,
      title: "New Observation Scheduled",
      message: `You have a new ${type} observation scheduled for ${date} at ${time}.`,
      type: "observation",
      read: false,
      createdAt: new Date().toISOString()
    };

    console.log('In-app notification created:', notification);

    return NextResponse.json({
      success: true,
      data: {
        observation: observationRecord,
        notification: notification
      },
      message: `Observation scheduled successfully! Notification sent to ${teacher.name}.`
    });

  } catch (error) {
    console.error('Error scheduling observation:', error);
    return NextResponse.json(
      { error: 'Failed to schedule observation' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  // This could be used to fetch scheduled observations or available time slots
  return NextResponse.json({
    message: 'Use POST to schedule observations'
  });
} 