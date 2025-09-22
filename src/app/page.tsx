import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold mb-6 text-center">SuperMail</h1>
        <p className="text-center mb-8">A Superhuman-inspired email client</p>
        <div className="flex justify-center">
          <Link 
            href="/auth/login" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Sign in with Google
          </Link>
        </div>
      </div>
    </main>
  );
}
