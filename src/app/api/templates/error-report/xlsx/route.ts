import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

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
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // For now, return an empty report if no importId is provided
    // This prevents the API from returning simulated data when called directly
    
    // In a production app, your code would look like this:
    // const errorData = await db.importErrors.findMany({ where: { importId } });
    
    // Sample structure for the error data - this would come from your database in production
    const errorData: ImportError[] = [];
    
    // Convert to worksheet data
    const headers = ["Row", "Email", "Name", "Role", "Subject", "Grade", "Error", "Resolution Steps"];
    
    // Create a typed array for the headers
    const typedHeaders: string[] = headers;
    
    let wsData: any[][] = [typedHeaders];
    
    if (errorData.length > 0) {
      const dataRows = errorData.map(err => [
        err.row.toString(), // Convert row number to string
        err.email,
        err.name,
        err.role,
        err.subject || "",
        err.grade || "",
        err.error,
        err.error.includes("email") ? "Fix email format (must be valid email address)" : 
        err.error.includes("name") ? "Add missing name" : "Review data"
      ]);
      
      wsData = [typedHeaders, ...dataRows];
    }
    
    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Set column widths
    const columnWidths = [
      { wch: 5 },  // Row
      { wch: 25 }, // Email
      { wch: 20 }, // Name
      { wch: 15 }, // Role
      { wch: 20 }, // Subject
      { wch: 15 }, // Grade
      { wch: 30 }, // Error
      { wch: 35 }, // Resolution Steps
    ];
    ws['!cols'] = columnWidths;
    
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Import Errors");
    
    // Generate buffer
    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    
    // Create response
    const response = new NextResponse(excelBuffer, {
      status: 200,
      headers: new Headers({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="import-errors.xlsx"',
      }),
    });
    
    return response;
  } catch (error) {
    console.error('Error generating Excel error report:', error);
    return NextResponse.json(
      { error: 'Failed to generate Excel error report' },
      { status: 500 }
    );
  }
} 