import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const TemplateGuide = () => {
  return (
    <Card className="border bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">CSV Template Format</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Your CSV file should be formatted with the following columns. 
            The first row must contain the headers exactly as shown below.
          </p>
          
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Column</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Description</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Required</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Example</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="bg-white">
                  <td className="px-4 py-3 font-medium text-primary">email</td>
                  <td className="px-4 py-3">User's email address</td>
                  <td className="px-4 py-3">Yes</td>
                  <td className="px-4 py-3 text-gray-500">john.doe@example.com</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-3 font-medium text-primary">name</td>
                  <td className="px-4 py-3">User's full name</td>
                  <td className="px-4 py-3">Yes</td>
                  <td className="px-4 py-3 text-gray-500">John Doe</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-3 font-medium text-primary">role</td>
                  <td className="px-4 py-3">User role</td>
                  <td className="px-4 py-3">Yes</td>
                  <td className="px-4 py-3 text-gray-500">Teacher, School Leader, or Super</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-3 font-medium text-primary">subject</td>
                  <td className="px-4 py-3">Subject taught (for Teachers)</td>
                  <td className="px-4 py-3">For Teachers</td>
                  <td className="px-4 py-3 text-gray-500">Mathematics</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-3 font-medium text-primary">grade</td>
                  <td className="px-4 py-3">Grade level (for Teachers)</td>
                  <td className="px-4 py-3">For Teachers</td>
                  <td className="px-4 py-3 text-gray-500">5th Grade</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-3 font-medium text-primary">notes</td>
                  <td className="px-4 py-3">Additional information</td>
                  <td className="px-4 py-3">No</td>
                  <td className="px-4 py-3 text-gray-500">New hire, Fall 2023</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <h4 className="font-medium">Sample CSV Content:</h4>
            <div className="rounded-lg bg-gray-50 p-3 font-mono text-xs text-gray-800 overflow-x-auto">
              <pre>
{`email,name,role,subject,grade,notes
john.doe@example.com,John Doe,Teacher,Mathematics,5th Grade,Example entry
jane.smith@example.com,Jane Smith,School Leader,,,Admin for Elementary School
mark.wilson@example.com,Mark Wilson,Teacher,Science,7th Grade,`}
              </pre>
            </div>
          </div>
          
          <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
            <p className="flex items-start">
              <span className="mr-2">💡</span>
              <span>
                <strong>Tip:</strong> Download our template files above for a ready-to-use format. 
                The CSV template can be opened in any spreadsheet program like Excel or Google Sheets.
              </span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateGuide; 