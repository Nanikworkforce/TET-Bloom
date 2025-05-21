"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent } from "react";
import { Suspense } from 'react';
import ScheduleObservationForm from './form';

// Form data interface
interface FormData {
  selectedTeacher: string;
  subject: string;
  grade: string;
  moduleUnit: string;
  lessonNumber: string;
  contentArea: string;
  lessonTopic: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  notes: string;
  notifyTeacher: boolean;
  addReminder: boolean;
  requestLessonPlan: boolean;
}

// Error interface
interface FormErrors {
  selectedTeacher?: string;
  subject?: string;
  grade?: string;
  contentArea?: string;
  date?: string;
  time?: string;
  location?: string;
  [key: string]: string | undefined;
}

// Define a simple loading component
function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-700">Loading page...</p>
      </div>
    </div>
  );
}

export default function ScheduleObservationPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ScheduleObservationForm />
    </Suspense>
  );
} 