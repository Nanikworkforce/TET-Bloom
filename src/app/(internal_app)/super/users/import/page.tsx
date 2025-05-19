"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import TemplateGuide from "./TemplateGuide";
import ErrorCorrection from "./ErrorCorrection";
import * as XLSX from 'xlsx';

export default function ImportUsersPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [importResults, setImportResults] = useState<{total: number, success: number, failed: number}>({ 
    total: 0, success: 0, failed: 0 
  });
  const [importId, setImportId] = useState<string>("");
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showTemplateLinks, setShowTemplateLinks] = useState(false);
  const [showTemplateGuide, setShowTemplateGuide] = useState(false);
  const [showErrorCorrection, setShowErrorCorrection] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [errorData, setErrorData] = useState<{
    row: number;
    email: string;
    name: string;
    role: string;
    subject?: string;
    grade?: string;
    error: string;
    resolution: string;
  }[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (selectedFile: File) => {
    // Reset any previous errors
    setFileError(null);
    
    // Check file type
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const fileExtension = '.' + selectedFile.name.split('.').pop()?.toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      setFileError(`Invalid file type. Please upload a file in one of these formats: ${validExtensions.join(', ')}`);
      return;
    }
    
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (selectedFile.size > maxSize) {
      setFileError(`File is too large. Maximum size is 10MB.`);
      return;
    }
    
    // Process valid file
    setFile(selectedFile);
    
    // Actually parse the file contents
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        let parsedData = [];
        
        // Parse based on file type
        if (fileExtension === '.csv') {
          // Parse CSV
          parsedData = parseCSV(data as string);
        } else {
          // Parse Excel
          if (data) {
            parsedData = parseExcel(data as ArrayBuffer);
          } else {
            throw new Error("No data to parse");
          }
        }
        
        // Validate required headers
        const requiredHeaders = ['email', 'name', 'role'];
        const headers = Object.keys(parsedData[0] || {}).map(h => h.toLowerCase());
        
        const missingHeaders = requiredHeaders.filter(
          header => !headers.includes(header.toLowerCase())
        );
        
        if (missingHeaders.length > 0) {
          setFileError(`Missing required columns: ${missingHeaders.join(', ')}. Please make sure your file contains all required columns.`);
          return;
        }
        
        // Use the first few rows as preview data (max 5)
        setPreviewData(parsedData.slice(0, 5));
      } catch (error) {
        console.error("Error parsing file:", error);
        setFileError(`Could not parse the file. Please make sure it's a valid ${fileExtension.replace('.', '')} file.`);
      }
    };
    
    reader.onerror = () => {
      setFileError("Error reading the file. Please try again.");
    };
    
    // Read the file
    if (fileExtension === '.csv') {
      reader.readAsText(selectedFile);
    } else {
      reader.readAsArrayBuffer(selectedFile);
    }
  };
  
  // Helper to parse CSV data
  const parseCSV = (csvText: string) => {
    const lines = csvText.split(/\r\n|\n/);
    const headers = lines[0].split(',').map(header => header.trim());
    
    return lines.slice(1)
      .filter(line => line.trim() !== '')
      .map(line => {
        const values = line.split(',').map(value => value.trim());
        const record: Record<string, string> = {};
        
        headers.forEach((header, index) => {
          record[header] = values[index] || '';
        });
        
        return record;
      });
  };
  
  // Helper to parse Excel data
  const parseExcel = (data: ArrayBuffer) => {
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json<Record<string, string>>(firstSheet, { header: "A" });
    
    // Extract headers from the first row
    const headers = Object.values(jsonData[0] || {});
    
    // Map data starting from second row
    return jsonData.slice(1).map(row => {
      const record: Record<string, string> = {};
      
      headers.forEach((header, index) => {
        const colLetter = String.fromCharCode(65 + index); // A, B, C, etc.
        record[header.toString()] = (row[colLetter] || '').toString();
      });
      
      return record;
    });
  };

  // Drag & drop handlers
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setFileError(null);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
      setFileError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      processFile(droppedFile);
      e.dataTransfer.clearData();
    }
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    // In a real app, this would be an API call to process the uploaded file
    // For production, error data would come from the API response
    setTimeout(() => {
      setIsUploading(false);
      setUploadComplete(true);
      
      // For production, these values would come from the API response
      // Initializing with zeros until real API integration is complete
      setImportResults({
        total: 0, 
        success: 0, 
        failed: 0
      });
      
      // Generate a unique import ID (in a real app, this would come from the backend)
      setImportId(`import_${Date.now()}`);
      
      // Clear any previous error data
      setErrorData([]);
      
      // Note: In production, error data would be populated from the API response if there were errors
    }, 2000);
  };

  const handleFixAndRetry = (fixedData: any[]) => {
    setIsUploading(true);
    
    // In a real app, this would be an API call to reprocess the fixed records
    setTimeout(() => {
      setIsUploading(false);
      
      // Update import results - in production, this would come from the API
      const successfulFixes = fixedData.filter(item => item.fixed).length;
      
      setImportResults(prev => ({
        ...prev,
        success: prev.success + successfulFixes,
        failed: prev.failed - successfulFixes
      }));
      
      // Update error data - in production, this would come from the API
      setErrorData(prev => prev.filter(item => 
        !fixedData.find(fixed => fixed.row === item.row && fixed.fixed)
      ));
      
      setShowErrorCorrection(false);
      
      // If all errors are fixed, clear any remaining error data
      if (successfulFixes === fixedData.length) {
        setErrorData([]);
      }
    }, 1500);
  };

  const fileTypes = ".csv, .xlsx, .xls";
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Bulk Import Users</h1>
          <p className="text-gray-600">Import multiple user accounts at once</p>
        </div>
        <Link href="/super/users">
          <Button variant="outline" className="rounded-full shadow-sm">
            ← Back to Users
          </Button>
        </Link>
      </div>

      {!uploadComplete ? (
        <Card className="border p-6 bg-white">
          <form onSubmit={handleImport} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fileUpload">Upload Spreadsheet</Label>
              <p className="text-sm text-gray-500 mb-2">
                Upload a spreadsheet with user data. The file should include columns for email, name, role, and other relevant information.
              </p>
              
              <div 
                className={`border-2 border-dashed ${isDragging ? 'border-primary bg-primary/5' : fileError ? 'border-red-300' : 'border-gray-300'} rounded-lg p-6 text-center transition-colors relative`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {isDragging && (
                  <div className="absolute inset-0 bg-primary/10 flex items-center justify-center rounded-lg z-10">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="font-medium text-primary">Drop file here</p>
                    </div>
                  </div>
                )}
                
                <input
                  type="file"
                  id="fileUpload"
                  onChange={handleFileChange}
                  accept={fileTypes}
                  className="hidden"
                />
                
                {!file ? (
                  <>
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Drag and drop your file here, or
                    </p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="rounded-lg" 
                      onClick={() => document.getElementById('fileUpload')?.click()}
                    >
                      Browse Files
                    </Button>
                    <p className="mt-3 text-xs text-gray-500">
                      Supported formats: {fileTypes}
                    </p>
                    
                    {fileError && (
                      <div className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded-md max-w-md mx-auto">
                        {fileError}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-2">
                    <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                      <span className="text-green-600 text-2xl">✓</span>
                    </div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">{Math.round(file.size / 1024)} KB</p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 rounded-full"
                      onClick={() => {
                        setFile(null);
                        setPreviewData([]);
                        setFileError(null);
                      }}
                    >
                      Change File
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {previewData.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Preview</h3>
                  <p className="text-xs text-gray-500">Showing first {previewData.length} of {previewData.length} records</p>
                </div>
                
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700">
                      <tr>
                        {previewData.length > 0 && Object.keys(previewData[0]).map((header, index) => (
                          <th key={index} className="px-4 py-2">{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {previewData.map((user, index) => (
                        <tr key={index} className="bg-white">
                          {Object.values(user).map((value, valueIndex) => (
                            <td key={valueIndex} className="px-4 py-2">
                              {value?.toString() || '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:justify-between pt-2">
                  <div className="text-sm">
                    <span className="font-medium">Template:</span> Need a template file?{" "}
                    <div className="relative inline-block">
                      <button 
                        className="text-primary hover:underline cursor-pointer"
                        onClick={() => setShowTemplateLinks(!showTemplateLinks)}
                      >
                        Download Template
                      </button>
                      {showTemplateLinks && (
                        <div className="absolute z-10 mt-2 w-56 bg-white border rounded-md shadow-lg p-2">
                          <div className="space-y-2">
                            <a 
                              href="/templates/user-import-template.csv" 
                              download
                              className="flex items-center w-full px-3 py-2 text-sm text-left rounded-md hover:bg-gray-100"
                              onClick={() => setShowTemplateLinks(false)}
                            >
                              <span className="text-primary mr-2">📄</span>
                              CSV Template
                            </a>
                            <a 
                              href="/templates/user-import-README.txt" 
                              download
                              className="flex items-center w-full px-3 py-2 text-sm text-left rounded-md hover:bg-gray-100"
                              onClick={() => setShowTemplateLinks(false)}
                            >
                              <span className="text-primary mr-2">📝</span>
                              Instructions (README)
                            </a>
                            <a 
                              href="/api/templates/users" 
                              className="flex items-center w-full px-3 py-2 text-sm text-left rounded-md hover:bg-gray-100"
                              onClick={() => setShowTemplateLinks(false)}
                            >
                              <span className="text-primary mr-2">📊</span>
                              Excel Template
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="rounded-full"
                      onClick={() => {
                        setFile(null);
                        setPreviewData([]);
                      }}
                    >
                      Clear
                    </Button>
                    <Button 
                      type="submit" 
                      className="rounded-full" 
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>Processing...</>
                      ) : (
                        <>Import Users</>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {!previewData.length && (
              <div className="flex flex-col items-start pt-2">
                <div className="text-sm">
                  <span className="font-medium">Template:</span> Need a template file?{" "}
                  <div className="relative inline-block">
                    <button 
                      className="text-primary hover:underline cursor-pointer"
                      onClick={() => setShowTemplateLinks(!showTemplateLinks)}
                    >
                      Download Template
                    </button>
                    {showTemplateLinks && (
                      <div className="absolute z-10 mt-2 w-56 bg-white border rounded-md shadow-lg p-2">
                        <div className="space-y-2">
                          <a 
                            href="/templates/user-import-template.csv" 
                            download
                            className="flex items-center w-full px-3 py-2 text-sm text-left rounded-md hover:bg-gray-100"
                            onClick={() => setShowTemplateLinks(false)}
                          >
                            <span className="text-primary mr-2">📄</span>
                            CSV Template
                          </a>
                          <a 
                            href="/templates/user-import-README.txt" 
                            download
                            className="flex items-center w-full px-3 py-2 text-sm text-left rounded-md hover:bg-gray-100"
                            onClick={() => setShowTemplateLinks(false)}
                          >
                            <span className="text-primary mr-2">📝</span>
                            Instructions (README)
                          </a>
                          <a 
                            href="/api/templates/users" 
                            className="flex items-center w-full px-3 py-2 text-sm text-left rounded-md hover:bg-gray-100"
                            onClick={() => setShowTemplateLinks(false)}
                          >
                            <span className="text-primary mr-2">📊</span>
                            Excel Template
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </form>
        </Card>
      ) : (
        <Card className="border p-6 bg-white">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 text-3xl">✓</span>
            </div>
            <h2 className="text-xl font-semibold">Import Complete</h2>
            <p className="text-gray-600">Your user import has been processed.</p>
            
            <div className="flex justify-center gap-6 pt-2">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-800">{importResults.total}</p>
                <p className="text-sm text-gray-600">Total Records</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{importResults.success}</p>
                <p className="text-sm text-gray-600">Successfully Imported</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">{importResults.failed}</p>
                <p className="text-sm text-gray-600">Failed</p>
              </div>
            </div>
            
            {importResults.failed > 0 && (
              <div className="mt-6 text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                  <h3 className="font-semibold text-red-800">Import Errors ({importResults.failed})</h3>
                  <div className="flex gap-2">
                    <a 
                      href={`/api/templates/error-report?importId=${importId}`} 
                      download 
                      className="inline-block"
                    >
                      <Button size="sm" variant="outline" className="rounded-full text-xs">
                        <span className="mr-1">📄</span> Download CSV
                      </Button>
                    </a>
                    <a 
                      href={`/api/templates/error-report/xlsx?importId=${importId}`} 
                      download 
                      className="inline-block"
                    >
                      <Button size="sm" variant="outline" className="rounded-full text-xs">
                        <span className="mr-1">📊</span> Download Excel
                      </Button>
                    </a>
                  </div>
                </div>
                
                <div className="border border-red-200 rounded-lg overflow-hidden mb-2">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-red-50 text-red-800">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium">Row</th>
                          <th className="px-4 py-2 text-left font-medium">
                            Email
                            {errorData.some(error => error.error.includes('email')) && (
                              <span className="ml-1 text-red-600">⚠️</span>
                            )}
                          </th>
                          <th className="px-4 py-2 text-left font-medium">
                            Name
                            {errorData.some(error => error.error.includes('name')) && (
                              <span className="ml-1 text-red-600">⚠️</span>
                            )}
                          </th>
                          <th className="px-4 py-2 text-left font-medium">Role</th>
                          <th className="px-4 py-2 text-left font-medium hidden md:table-cell">Subject/Grade</th>
                          <th className="px-4 py-2 text-left font-medium">Error</th>
                          <th className="px-4 py-2 text-left font-medium hidden md:table-cell">Resolution</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-red-100">
                        {errorData.map((error, index) => (
                          <tr key={index} className="bg-white hover:bg-red-50/50">
                            <td className="px-4 py-3 font-medium">{error.row}</td>
                            <td className={`px-4 py-3 ${error.error.includes('email') ? 'text-red-600 font-medium' : ''}`}>
                              {error.email}
                            </td>
                            <td className={`px-4 py-3 ${error.error.includes('name') ? 'text-red-600 font-medium' : ''}`}>
                              {error.name || <span className="italic text-red-400">missing</span>}
                            </td>
                            <td className="px-4 py-3">{error.role}</td>
                            <td className="px-4 py-3 hidden md:table-cell">
                              {error.subject} {error.grade ? `(${error.grade})` : ''}
                            </td>
                            <td className="px-4 py-3 text-red-700">
                              {error.error}
                            </td>
                            <td className="px-4 py-3 text-blue-700 hidden md:table-cell">
                              {error.resolution}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Mobile version of errors for small screens */}
                <div className="md:hidden space-y-3 mb-3">
                  {errorData.map((error, index) => (
                    <div key={index} className="border border-red-200 rounded-lg p-3 bg-white">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">Row {error.row}</span>
                        <span className="text-red-600 text-sm font-medium">{error.error}</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="grid grid-cols-3 gap-1">
                          <span className="text-gray-500">Email:</span>
                          <span className={`col-span-2 ${error.error.includes('email') ? 'text-red-600 font-medium' : ''}`}>
                            {error.email}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="text-gray-500">Name:</span>
                          <span className={`col-span-2 ${error.error.includes('name') ? 'text-red-600 font-medium' : ''}`}>
                            {error.name || <span className="italic text-red-400">missing</span>}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="text-gray-500">Role:</span>
                          <span className="col-span-2">{error.role}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="text-gray-500">Subject/Grade:</span>
                          <span className="col-span-2">
                            {error.subject} {error.grade ? `(${error.grade})` : ''}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <span className="text-gray-500">Resolution:</span>
                          <span className="col-span-2 text-blue-700">{error.resolution}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="rounded-lg p-3 bg-blue-50 text-sm text-blue-700 flex justify-between items-center">
                  <p className="flex items-start">
                    <span className="mr-2">💡</span>
                    <span>
                      <strong>Tip:</strong> Fix these errors in your spreadsheet and re-import only the failed records. 
                      You can download the error report for a detailed view of what needs to be corrected.
                    </span>
                  </p>
                  <Button 
                    size="sm"
                    onClick={() => setShowErrorCorrection(true)}
                    className="whitespace-nowrap rounded-full"
                  >
                    Fix Now
                  </Button>
                </div>
              </div>
            )}
            
            {/* Error Correction UI */}
            {showErrorCorrection && errorData.length > 0 && (
              <div className="mt-4">
                <ErrorCorrection 
                  errors={errorData}
                  onFixAndRetry={handleFixAndRetry}
                  onCancel={() => setShowErrorCorrection(false)}
                />
              </div>
            )}
            
            <div className="flex flex-wrap justify-center gap-3 pt-6">
              <Link href="/super/users">
                <Button className="rounded-full">
                  Go to User Management
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="rounded-full"
                onClick={() => {
                  setFile(null);
                  setPreviewData([]);
                  setUploadComplete(false);
                  setImportResults({ total: 0, success: 0, failed: 0 });
                }}
              >
                Import Another File
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      <Card className="border p-5 bg-white">
        <h3 className="font-semibold mb-3">Import Guidelines</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex gap-2">
            <span className="text-primary">✓</span>
            <span>Use the provided template for best results</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">✓</span>
            <span>Emails must be unique and properly formatted</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">✓</span>
            <span>Required fields: Email, Name, Role (Teacher, School Leader, or Super)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">✓</span>
            <span>For Teachers: Subject and Grade are recommended</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">✓</span>
            <span>Maximum 500 records per import</span>
          </li>
        </ul>
        <div className="mt-4">
          <Button 
            variant="link" 
            className="text-primary text-sm p-0"
            onClick={() => setShowTemplateGuide(!showTemplateGuide)}
          >
            {showTemplateGuide ? "Hide" : "View"} detailed template format
          </Button>
        </div>
      </Card>
      
      {showTemplateGuide && (
        <TemplateGuide />
      )}
    </div>
  );
} 