import { ThemeToggle } from "@/components/theme-toggle";
import { env } from "@/lib/env";

// Placeholder until the landing page (Step 4): confirms Inter, theming and environment detection.
export default function Home() {
  return (
    <main className="flex min-h-svh flex-col">
      <header className="flex items-center justify-end p-6">
        <ThemeToggle />
      </header>
      <section className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-5xl font-semibold tracking-tight">Playground</h1>
        <p className="text-muted-foreground">client_application is running.</p>
        <p className="rounded-full border px-3 py-1 text-xs tracking-widest text-muted-foreground uppercase">
          {env.appEnv}
        </p>
      </section>
    </main>
  );
}
