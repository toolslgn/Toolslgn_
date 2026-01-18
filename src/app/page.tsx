export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
                <h1 className="text-4xl font-bold text-center mb-4">
                    Welcome to ToolsLiguns
                </h1>
                <p className="text-center text-muted-foreground">
                    Your professional SaaS platform is ready to build.
                </p>
                <div className="mt-8 p-6 border rounded-lg bg-card text-card-foreground">
                    <h2 className="text-xl font-semibold mb-2">Next Steps:</h2>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Shadcn UI components are ready to install</li>
                        <li>Supabase integration is configured</li>
                        <li>Feature-based architecture is set up</li>
                        <li>Dark mode is enabled by default</li>
                    </ul>
                </div>
            </div>
        </main>
    );
}
