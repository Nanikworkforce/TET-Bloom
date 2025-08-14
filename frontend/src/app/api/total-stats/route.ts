import { NextRequest, NextResponse } from 'next/server';
import { baseUrl } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    // Proxy the request to the Django backend
    const response = await fetch(`${baseUrl}/total-stats/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching total stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch total stats' },
      { status: 500 }
    );
  }
}