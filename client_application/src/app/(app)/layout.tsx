import { AppShell } from "@/components/app-shell/app-shell";

/** Every page except the landing page at /: they all sit in the app shell. */
export default function AppLayout({ children }: LayoutProps<"/">) {
  return <AppShell>{children}</AppShell>;
}
