"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mail, 
  Bell, 
  Settings, 
  Save,
  AlertCircle 
} from 'lucide-react';

interface NotificationSettingsProps {
  onSave?: (settings: NotificationPreferences) => void;
  initialSettings?: NotificationPreferences;
  isLoading?: boolean;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  schedulingNotifications: boolean;
  reminderNotifications: boolean;
  reminderTiming: 'same_day' | '1_day' | '2_days' | '3_days';
  customMessage?: string;
}

const defaultSettings: NotificationPreferences = {
  emailNotifications: true,
  schedulingNotifications: true,
  reminderNotifications: true,
  reminderTiming: '1_day',
  customMessage: ''
};

export default function NotificationSettings({
  onSave,
  initialSettings = defaultSettings,
  isLoading = false
}: NotificationSettingsProps) {
  const [settings, setSettings] = useState<NotificationPreferences>(initialSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key: keyof NotificationPreferences, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave?.(settings);
    setHasChanges(false);
  };

  const getReminderTimingLabel = (timing: string) => {
    switch (timing) {
      case 'same_day': return 'Same day';
      case '1_day': return '1 day before';
      case '2_days': return '2 days before';
      case '3_days': return '3 days before';
      default: return '1 day before';
    }
  };

  return (
    <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
      <CardHeader className="text-white p-6" style={{background: 'linear-gradient(90deg, rgba(132, 84, 124, 1) 0%, rgba(228, 164, 20, 1) 100%)'}}>
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
            <Settings className="h-5 w-5" />
          </div>
          <CardTitle className="text-xl font-semibold">Notification Settings</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Email Notifications Master Switch */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5" style={{color: '#84547c'}} />
            <div>
              <Label className="text-base font-medium">Email Notifications</Label>
              <p className="text-sm text-gray-600">Receive notifications via email</p>
            </div>
          </div>
          <Switch
            checked={settings.emailNotifications}
            onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
          />
        </div>

        {settings.emailNotifications && (
          <div className="space-y-4 ml-4 border-l-2 border-gray-200 pl-4">
            {/* Scheduling Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Scheduling Notifications</Label>
                <p className="text-xs text-gray-600">Get notified when new observations are scheduled</p>
              </div>
              <Switch
                checked={settings.schedulingNotifications}
                onCheckedChange={(checked) => handleSettingChange('schedulingNotifications', checked)}
              />
            </div>

            {/* Reminder Notifications */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Reminder Notifications</Label>
                  <p className="text-xs text-gray-600">Receive reminders before observations</p>
                </div>
                <Switch
                  checked={settings.reminderNotifications}
                  onCheckedChange={(checked) => handleSettingChange('reminderNotifications', checked)}
                />
              </div>

              {settings.reminderNotifications && (
                <div className="ml-4">
                  <Label className="text-xs font-medium text-gray-700">Reminder Timing</Label>
                  <Select
                    value={settings.reminderTiming}
                    onValueChange={(value) => handleSettingChange('reminderTiming', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="same_day">Same day</SelectItem>
                      <SelectItem value="1_day">1 day before</SelectItem>
                      <SelectItem value="2_days">2 days before</SelectItem>
                      <SelectItem value="3_days">3 days before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Custom Message */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Custom Message (Optional)</Label>
              <Textarea
                placeholder="Add a personal message that will be included in all notification emails..."
                value={settings.customMessage || ''}
                onChange={(e) => handleSettingChange('customMessage', e.target.value)}
                className="resize-none"
                rows={3}
              />
              <p className="text-xs text-gray-500">
                This message will be added to all outgoing observation notifications.
              </p>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="flex items-start gap-3 p-4 rounded-xl" style={{backgroundColor: 'rgba(132, 84, 124, 0.05)'}}>
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" style={{color: '#84547c'}} />
          <div className="space-y-1">
            <p className="text-sm font-medium" style={{color: '#84547c'}}>
              Notification Features
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Teachers automatically receive emails when observations are scheduled</li>
              <li>• Reminder emails help teachers prepare for upcoming observations</li>
              <li>• All emails include observation details and preparation tips</li>
              <li>• Custom messages appear in all outgoing notifications</li>
            </ul>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isLoading}
            className="text-white"
            style={{background: hasChanges ? 'linear-gradient(90deg, rgba(132, 84, 124, 1) 0%, rgba(228, 164, 20, 1) 100%)' : undefined}}
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
