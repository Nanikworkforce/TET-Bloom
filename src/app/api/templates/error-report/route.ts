import { NextResponse } from 'next/server';

// Define the error data type
interface ImportError {
  row: number;
  email: string;
  name: string;
  role: string;
  subject?: string;
  grade?: string;
  error: string;
}

export async function GET(request: Request) {
  try {
    // Get the searchParams from the request URL
    const { searchParams } = new URL(request.url);
    const importId = searchParams.get('importId');
    
    // In a production environment, you would fetch error data from your database
    // based on the importId parameter
    
    // For now, return an empty report if no importId is provided
    // This prevents the API from returning simulated data when called directly
    if (!importId) {
      return new NextResponse('email,name,role,error\n', {
        status: 200,
        headers: new Headers({
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="import-errors.csv"',
        }),
      });
    }
    
    // In a production app, your code would look like this:
    // const errorData = await db.importErrors.findMany({ where: { importId } });
    
    // Sample structure for the error data - this would come from your database in production
    const errorData: ImportError[] = [];
    
    // Convert to CSV
    const headers = ["Row", "Email", "Name", "Role", "Error"];
    const rows = errorData.map(err => [
      err.row.toString(), 
      err.email, 
      err.name, 
      err.role, 
      err.error
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create response with CSV content
    const response = new NextResponse(csvContent, {
      status: 200,
      headers: new Headers({
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="import-errors.csv"',
      }),
    });
    
    return response;
  } catch (error) {
    console.error('Error generating error report:', error);
    return NextResponse.json(
      { error: 'Failed to generate error report' },
      { status: 500 }
    );
  }
} 