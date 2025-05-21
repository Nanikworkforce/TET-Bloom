import { NextRequest, NextResponse } from "next/server";
import * as XLSX from 'xlsx';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  try {
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Sample data with headers and examples
    const data = [
      ["email", "name", "role", "subject", "grade", "notes"],
      ["john.doe@example.com", "John Doe", "Teacher", "Mathematics", "5th Grade", "Example entry"],
      ["jane.smith@example.com", "Jane Smith", "School Leader", "", "", "Admin for Elementary School"],
      ["mark.wilson@example.com", "Mark Wilson", "Teacher", "Science", "7th Grade", ""]
    ];
    
    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);
    
    // Set column widths
    const columnWidths = [
      { wch: 25 }, // email
      { wch: 20 }, // name
      { wch: 15 }, // role
      { wch: 20 }, // subject
      { wch: 15 }, // grade
      { wch: 30 }, // notes
    ];
    ws['!cols'] = columnWidths;
    
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Users Import Template");
    
    // Generate buffer
    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    
    // Create response
    const response = new NextResponse(excelBuffer, {
      status: 200,
      headers: new Headers({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="user-import-template.xlsx"',
      }),
    });
    
    return response;
  } catch (error) {
    console.error('Error generating Excel template:', error);
    return NextResponse.json(
      { error: 'Failed to generate Excel template' },
      { status: 500 }
    );
  }
} 