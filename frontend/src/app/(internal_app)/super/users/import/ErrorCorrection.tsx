import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ErrorCorrectionProps {
  errors: {
    row: number;
    column: string;
    message: string;
    value: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rowData: any; // Use a more specific type if possible
  }[];
  onFixAndRetry: (fixedData: any[]) => void;
  onCancel: () => void;
}

const ErrorCorrection: React.FC<ErrorCorrectionProps> = ({
  errors,
  onFixAndRetry,
  onCancel
}) => {
  const [correctedData, setCorrectedData] = useState(
    errors.map(error => ({
      ...error,
      fixed: false,
      correctedValue: error.message.includes('email') ? '' : error.message.includes('name') ? '' : ''
    }))
  );

  const handleValueChange = (index: number, value: string) => {
    const newData = [...correctedData];
    newData[index].correctedValue = value;
    newData[index].fixed = value.trim() !== '';
    setCorrectedData(newData);
  };

  const handleSubmit = () => {
    // Prepare the fixed data with corrected values
    const fixedData = correctedData.map(item => {
      const updatedItem = { ...item };
      
      if (item.message.includes('email') && item.fixed) {
        updatedItem.rowData.email = item.correctedValue;
      } else if (item.message.includes('name') && item.fixed) {
        updatedItem.rowData.name = item.correctedValue;
      }
      
      return updatedItem;
    });
    
    onFixAndRetry(fixedData);
  };

  const canSubmit = correctedData.some(item => item.fixed);

  return (
    <Card className="border bg-white">
      <CardHeader>
        <CardTitle className="text-lg">Fix Import Errors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-sm text-gray-600">
            You can fix the most common errors directly here and attempt to import the corrected records.
          </p>
          
          {correctedData.map((error, index) => (
            <div key={index} className="p-4 border rounded-lg bg-gray-50">
              <div className="flex flex-wrap gap-2 mb-3 text-sm text-gray-700">
                <span className="font-medium">Row {error.row}:</span>
                <span className="text-red-600">{error.message}</span>
              </div>
              
              {error.message.includes('email') && (
                <div className="space-y-2">
                  <Label htmlFor={`corrected-email-${index}`}>Corrected Email:</Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input 
                      id={`corrected-email-${index}`}
                      value={error.correctedValue}
                      onChange={(e) => handleValueChange(index, e.target.value)}
                      placeholder="Enter valid email address"
                      className="rounded-lg"
                    />
                    <div className="w-24 flex items-center">
                      {error.fixed && (
                        <span className="text-green-600 text-sm">✓ Fixed</span>
                      )}
                    </div>
                  </div>
                  <div className="flex mt-1">
                    <div className="text-sm text-gray-500">Original: <span className="text-red-600">{error.rowData.email}</span></div>
                  </div>
                </div>
              )}
              
              {error.message.includes('name') && (
                <div className="space-y-2">
                  <Label htmlFor={`corrected-name-${index}`}>Corrected Name:</Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input 
                      id={`corrected-name-${index}`}
                      value={error.correctedValue}
                      onChange={(e) => handleValueChange(index, e.target.value)}
                      placeholder="Enter full name"
                      className="rounded-lg"
                    />
                    <div className="w-24 flex items-center">
                      {error.fixed && (
                        <span className="text-green-600 text-sm">✓ Fixed</span>
                      )}
                    </div>
                  </div>
                  <div className="flex mt-1">
                    <div className="text-sm text-gray-500">Original: <span className="italic text-red-500">(empty)</span></div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="rounded-full w-full sm:w-auto"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-full w-full sm:w-auto"
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              Import Fixed Records
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorCorrection; 