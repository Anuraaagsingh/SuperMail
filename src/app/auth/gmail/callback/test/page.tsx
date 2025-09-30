'use client';

export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Gmail Callback Route Test</h1>
        <p className="text-muted-foreground mb-4">
          If you can see this page, the Gmail callback route is working!
        </p>
        <p className="text-sm text-muted-foreground">
          Current URL: {typeof window !== 'undefined' ? window.location.href : 'Loading...'}
        </p>
      </div>
    </div>
  );
}
