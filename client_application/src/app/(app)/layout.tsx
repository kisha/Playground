import { AppFrame } from "@/components/app-frame/app-frame";

/** Every page except the landing page at /: they all sit in the app frame. */
export default function AppLayout({ children }: LayoutProps<"/">) {
  return <AppFrame>{children}</AppFrame>;
}
