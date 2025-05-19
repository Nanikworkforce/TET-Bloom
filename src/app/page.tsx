import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary/10 border-b">
        <div className="container mx-auto py-5 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">TET</span>
            <span className="text-2xl font-semibold">Bloom</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" className="rounded-full font-semibold transition-all hover:scale-105">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button className="rounded-full font-semibold transition-all hover:scale-105">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto max-w-5xl">
            <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                  Teacher Evaluation Made Simple
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Streamline the observation, feedback, and evaluation process for teachers and school leaders.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/signup">
                    <Button size="lg" className="w-full sm:w-auto rounded-full font-semibold shadow-lg transition-all hover:scale-105 hover:shadow-xl">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full font-semibold transition-all hover:scale-105">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden border bg-card shadow-lg">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <span className="text-sm">App screenshot</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 bg-secondary/5">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Key Features</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Everything you need to manage teacher observations and feedback in one place.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Digital Observations",
                  description: "Complete observation forms digitally, with custom forms for different subjects.",
                  icon: "📝"
                },
                {
                  title: "Structured Feedback",
                  description: "Provide constructive feedback with specific 'glows' and 'grows' for each observation.",
                  icon: "✨"
                },
                {
                  title: "Teacher Involvement",
                  description: "Teachers can submit lesson plans and review feedback in a collaborative process.",
                  icon: "👩‍🏫"
                }
              ].map((feature, i) => (
                <div 
                  key={i} 
                  className="bg-card p-6 rounded-2xl border shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
                >
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-primary">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 px-4 sm:px-6 bg-primary/5">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">TET Bloom</span>
            <span className="text-sm text-muted-foreground">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
