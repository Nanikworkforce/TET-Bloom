"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // In a real implementation, we would handle signup with Supabase
    // For now, simulate a delay
    setTimeout(() => {
      setIsLoading(false);
      // Redirect would happen after successful signup
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-secondary/5 to-primary/5">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto py-5 px-4 sm:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">TET</span>
            <span className="text-2xl font-semibold">Bloom</span>
          </Link>
          <div>
            <Link href="/login">
              <Button variant="ghost" className="rounded-full font-semibold transition-all hover:scale-105 hover:text-primary">Log in</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10">
        <Card className="w-full max-w-md rounded-2xl border shadow-lg bg-card/95 backdrop-blur-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold text-center text-primary">Join the Adventure!</CardTitle>
            <CardDescription className="text-center text-base">
              Enter your information to create your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="font-medium text-sm">Full Name</Label>
                <Input 
                  id="fullName" 
                  placeholder="John Doe"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="rounded-xl h-11 focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium text-sm">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl h-11 focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-medium text-sm">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl h-11 focus:ring-2 focus:ring-primary/50"
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col pb-8">
              <Button 
                className="w-full rounded-xl h-11 font-semibold shadow-md transition-all hover:shadow-lg"
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign up"}
              </Button>
              <div className="mt-5 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Log in
                </Link>
              </div>
              <p className="mt-4 text-xs text-center text-muted-foreground">
                By clicking "Sign up", you agree to our{" "}
                <Link href="/terms" className="text-primary hover:underline font-medium">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline font-medium">
                  Privacy Policy
                </Link>
                .
              </p>
            </CardFooter>
          </form>
        </Card>
      </main>

      <footer className="border-t py-6 px-4 sm:px-6 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          TET Bloom © {new Date().getFullYear()} | All rights reserved
        </div>
      </footer>
    </div>
  );
} 