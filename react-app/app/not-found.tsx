import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-foreground mb-4 text-6xl font-bold">404</h1>
        <h2 className="text-foreground mb-6 text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
