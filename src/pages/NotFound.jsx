import { Link } from "react-router-dom";
import Container from "../components/Container.jsx";

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center pt-28">
      <Container>
        <p className="font-mono text-sm text-ash">404</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-bone sm:text-5xl">Page not found</h1>
        <p className="mt-4 max-w-md text-ash">That page doesn't exist. Head back to the portfolio home page.</p>
        <div className="mt-8">
          <Link to="/" className="inline-flex min-h-11 items-center rounded-full bg-bone px-5 font-medium text-ink">
            Back to Home
          </Link>
        </div>
      </Container>
    </section>
  );
}

