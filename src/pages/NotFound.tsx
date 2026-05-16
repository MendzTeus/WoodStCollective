import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="min-h-screen px-6 md:px-12 pt-48 pb-32 flex items-center">
      <section className="max-w-3xl">
        <p className="label-caps text-[10px] text-text-muted mb-6">404</p>
        <h1 className="font-display text-6xl md:text-8xl font-black italic leading-none text-primary mb-8">
          Page not found.
        </h1>
        <p className="text-text-secondary text-lg leading-relaxed mb-12 italic max-w-xl">
          The page you are looking for is no longer available or may have moved.
        </p>
        <Link
          to="/"
          className="inline-flex bg-primary text-on-primary px-10 py-5 label-caps text-xs font-bold hover:bg-white transition-colors duration-500 rounded-lg"
        >
          Back Home
        </Link>
      </section>
    </main>
  );
}
