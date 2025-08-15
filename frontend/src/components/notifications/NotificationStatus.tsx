"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  MailCheck, 
  Clock, 
  Send,
  AlertCircle 
} from 'lucide-react';

interface NotificationStatusProps {
  notificationSent?: boolean;
  notificationSentAt?: string;
  reminderSent?: boolean;
  reminderSentAt?: string;
  onSendReminder?: () => void;
  isLoading?: boolean;
}

export default function NotificationStatus({
  notificationSent = false,
  notificationSentAt,
  reminderSent = false,
  reminderSentAt,
  onSendReminder,
  isLoading = false
}: NotificationStatusProps) {
  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">📧 Email Notifications</h4>
      </div>
      
      <div className="space-y-2">
        {/* Initial Notification Status */}
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
          <div className="flex items-center gap-2">
            {notificationSent ? (
              <MailCheck className="h-4 w-4 text-green-600" />
            ) : (
              <Mail className="h-4 w-4 text-gray-400" />
            )}
            <span className="text-sm text-gray-700">Scheduling Notification</span>
          </div>
          <div className="flex items-center gap-2">
            {notificationSent ? (
              <>
                <Badge className="bg-green-100 text-green-800">Sent</Badge>
                {notificationSentAt && (
                  <span className="text-xs text-gray-500">
                    {formatDateTime(notificationSentAt)}
                  </span>
                )}
              </>
            ) : (
              <Badge className="bg-gray-100 text-gray-600">Pending</Badge>
            )}
          </div>
        </div>

        {/* Reminder Notification Status */}
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
          <div className="flex items-center gap-2">
            {reminderSent ? (
              <Clock className="h-4 w-4 text-blue-600" />
            ) : (
              <Clock className="h-4 w-4 text-gray-400" />
            )}
            <span className="text-sm text-gray-700">Reminder Notification</span>
          </div>
          <div className="flex items-center gap-2">
            {reminderSent ? (
              <>
                <Badge className="bg-blue-100 text-blue-800">Sent</Badge>
                {reminderSentAt && (
                  <span className="text-xs text-gray-500">
                    {formatDateTime(reminderSentAt)}
                  </span>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Badge className="bg-gray-100 text-gray-600">Not Sent</Badge>
                {onSendReminder && notificationSent && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onSendReminder}
                    disabled={isLoading}
                    className="h-6 px-2 text-xs"
                    style={{borderColor: '#84547c', color: '#84547c'}}
                  >
                    <Send className="h-3 w-3 mr-1" />
                    Send Now
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Help Text */}
        <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-700">
            <p className="font-medium">Notification Info:</p>
            <ul className="mt-1 space-y-0.5">
              <li>• Scheduling notifications are sent automatically when observations are created</li>
              <li>• Reminder notifications can be sent manually or scheduled</li>
              <li>• Teachers receive emails with observation details and preparation tips</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
