export default function OfflinePage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold">You're Offline</h1>
                <p className="text-muted-foreground">
                    Please check your internet connection and try again.
                </p>
            </div>
        </div>
    );
}
