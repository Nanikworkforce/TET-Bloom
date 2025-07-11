"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    title: "New Observation Scheduled",
    message: "You have a new observation scheduled for Math class on Friday at 10:30 AM.",
    timestamp: "2 hours ago",
    read: false,
    type: "observation"
  },
  {
    id: 2,
    title: "Feedback Available",
    message: "Administrator Johnson has provided feedback for your recent observation.",
    timestamp: "1 day ago",
    read: false,
    type: "feedback"
  },
  {
    id: 3,
    title: "Lesson Plan Approved",
    message: "Your lesson plan for the upcoming observation has been approved.",
    timestamp: "2 days ago",
    read: true,
    type: "approval"
  },
  {
    id: 4,
    title: "System Update",
    message: "The platform will be updated this weekend with new features.",
    timestamp: "3 days ago",
    read: true,
    type: "system"
  }
];

// Get icon based on notification type
const getNotificationIcon = (type: string) => {
  switch (type) {
    case "observation":
      return "👁️";
    case "feedback":
      return "💬";
    case "approval":
      return "✅";
    case "system":
      return "🔄";
    default:
      return "📌";
  }
};

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({...n, read: true})));
  };
  
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? {...n, read: true} : n
    ));
  };
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative rounded-full hover:bg-gray-100"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 px-1.5 min-w-4 h-4 flex items-center justify-center text-[10px] bg-red-500 border-0"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <DropdownMenuLabel className="text-base font-medium">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-7">
              Mark all as read
            </Button>
          )}
        </div>
        <DropdownMenuGroup className="max-h-[60vh] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem 
                key={notification.id} 
                className={`px-4 py-3 focus:bg-gray-100 cursor-default ${!notification.read ? 'bg-blue-50' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="text-lg">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${!notification.read ? 'text-black' : 'text-gray-700'}`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {notification.timestamp}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-1 flex-shrink-0"></div>
                  )}
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-4 py-8 text-center text-gray-500">
              <p>No notifications</p>
            </div>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-2 focus:bg-gray-100 cursor-default">
          <Button variant="outline" size="sm" className="w-full text-xs">View all notifications</Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 