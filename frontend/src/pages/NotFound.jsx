import Button from "../components/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-6xl font-bold text-ink/10">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink">Page not found</h1>
      <p className="mt-2 max-w-sm text-muted">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Button to="/" variant="accent" size="lg" className="mt-8">
        Back to Home
      </Button>
    </div>
  );
}
