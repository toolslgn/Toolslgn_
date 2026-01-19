
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CheckCircle2, LayoutDashboard } from "lucide-react";

export default async function Home() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-slate-50 relative overflow-hidden">
            {/* Background gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="z-10 w-full max-w-5xl px-4 md:px-6 flex flex-col items-center text-center space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900/50 px-3 py-1 text-sm font-medium text-slate-300 backdrop-blur-xl">
                    <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                    v1.0 Production Ready
                </div>

                {/* Hero Text */}
                <div className="space-y-4 max-w-3xl">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Manage <span className="text-blue-400">20 Websites</span> <br className="hidden sm:inline" />
                        in One Place.
                    </h1>
                    <p className="mx-auto max-w-[700px] text-slate-400 md:text-xl leading-relaxed">
                        The AI-powered social media manager for high-volume publishers.
                        Automate content recyclers, schedule posts, and grow your traffic without the headache.
                    </p>
                </div>

                {/* CTA Actions */}
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    {user ? (
                        <Button size="lg" className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20" asChild>
                            <Link href="/dashboard">
                                <LayoutDashboard className="mr-2 h-5 w-5" />
                                Open Dashboard
                            </Link>
                        </Button>
                    ) : (
                        <Button size="lg" className="h-12 px-8 text-base bg-white text-slate-950 hover:bg-slate-200 transition-all" asChild>
                            <Link href="/login">
                                Get Started
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    )}

                    <Button variant="outline" size="lg" className="h-12 px-8 text-base border-slate-800 bg-slate-950/50 hover:bg-slate-900 hover:text-white" asChild>
                        <Link href="https://github.com/toolslgn/toolslgn" target="_blank">
                            View on GitHub
                        </Link>
                    </Button>
                </div>

                {/* Feature Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 text-left w-full max-w-4xl">
                    {[
                        { title: "AI Content Magic", desc: "Generate captions and ideas instantly with Gemini AI." },
                        { title: "Smart Scheduling", desc: "Automate posts to Facebook, Instagram, and more." },
                        { title: "Content Recycling", desc: "Revive evergreen content to keep traffic flowing." },
                    ].map((feature, i) => (
                        <div key={i} className="group p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-colors">
                            <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-slate-800 p-2 group-hover:bg-slate-700 transition-colors">
                                <CheckCircle2 className="h-5 w-5 text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-200 mb-2">{feature.title}</h3>
                            <p className="text-sm text-slate-400">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
