"use client";

import Image from "next/image";
import { House } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { PulseDot } from "@/components/landing/pulse-dot";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { brand } from "@/content/brand";
import { SANDBOX_EXAMPLES_HEADING, sandboxExamples } from "@/content/sandbox-examples";
import { useHealthMonitor } from "@/hooks/use-health-monitor";
import { routes } from "@/lib/routes";
import { toSystemStatus } from "@/lib/system-status";

// The dot only needs to be roughly current, so it checks far less often than the landing page's tracker.
const STATUS_DOT_INTERVAL_MS = 30_000;

/** The left navigation. Collapses to icons with ⌘B or its edge; on a phone it slides over the page. */
export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  // On a phone the sidebar covers the page: close it once a link is chosen.
  const closeSidebarOnMobile = () => isMobile && setOpenMobile(false);

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="group-data-[collapsible=icon]:justify-center"
              tooltip={brand.name}
              aria-label={`${brand.name} home`}
              render={<Link href={routes.home} onClick={closeSidebarOnMobile} />}
            >
              {brand.logo ? (
                // The logo artwork has a black background, so it sits in a black badge in both themes.
                <span className="flex h-8 shrink-0 items-center rounded-md bg-black px-1.5 ring-1 ring-foreground/10 group-data-[collapsible=icon]:hidden">
                  <Image
                    src={brand.logo.src}
                    alt={brand.logo.alt}
                    width={brand.logo.width}
                    height={brand.logo.height}
                    className="h-6 w-auto max-w-none"
                    loading="eager"
                  />
                </span>
              ) : (
                <span className="font-semibold tracking-tight group-data-[collapsible=icon]:hidden">{brand.name}</span>
              )}
              {/* The logo is too wide for the collapsed sidebar, so it shows a home icon instead. */}
              <House className="hidden group-data-[collapsible=icon]:block" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{SANDBOX_EXAMPLES_HEADING}</SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {sandboxExamples.map((example) => (
              <SidebarMenuItem key={example.href}>
                <SidebarMenuButton
                  className="h-10 rounded-xl"
                  isActive={pathname === example.href}
                  tooltip={example.label}
                  render={<Link href={example.href} onClick={closeSidebarOnMobile} />}
                >
                  <example.icon />
                  <span>{example.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <ApiConnectionStatus />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

/** "All systems connected", from polling the server's /health. */
function ApiConnectionStatus() {
  const { latest } = useHealthMonitor({ intervalMs: STATUS_DOT_INTERVAL_MS, historySize: 1 });
  const systemStatus = toSystemStatus(latest);
  return (
    <div className="flex items-center gap-2.5 px-2 py-1.5 text-xs text-muted-foreground" title={systemStatus.label}>
      <PulseDot state={systemStatus.overall} className="ml-0.75" />
      <span className="truncate group-data-[collapsible=icon]:hidden">{systemStatus.label}</span>
    </div>
  );
}
