import * as React from "react";
import { useState } from "react";

import { NavUser } from "@/components/nav-user";
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
} from "@/components/ui/sidebar";

import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================================
   ===============  TYPE DEFINITIONS  =========================================
============================================================================ */

export interface MenuItem {
    title: string;
    url?: string;
    icon?: React.ElementType;
    collapsible?: boolean;
    items?: MenuItem[];
}

export interface SidebarGroupType {
    title: string;
    collapsible?: boolean;
    groupIcon?: React.ElementType;
    items: MenuItem[];
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    active?: string;
    user: {
        name: string;
        username: string;
        photo: string;
    };
    appName: string;
    navData: SidebarGroupType[];
}

/* ============================================================================
   =============  ICON RENDERER  ==============================================
============================================================================ */

function IconRenderer(IconComponent?: React.ElementType) {
    return IconComponent ? (
        <IconComponent className="w-4 h-4 text-muted-foreground" />
    ) : null;
}

/* ============================================================================
   ===============  ACTIVE CHECK HELPER  ======================================
============================================================================ */

function menuActive(url: string | undefined, currentUrl: string) {
    if (!url) return "";
    const isActive = currentUrl === url || currentUrl.startsWith(url + "/");
    
    return cn("hover:bg-primary/5 hover:text-primary", {
        "bg-primary/5 text-primary border-l-2 border-primary font-medium": isActive,
    });
}

/* ============================================================================
   ===============  RECURSIVE COLLAPSIBLE MENU  ================================
============================================================================ */

function CollapsibleMenu({
    group,
    activeUrl,
}: {
    group: SidebarGroupType | MenuItem;
    activeUrl: string;
}) {
    const hasActiveChild = group.items?.some(item => 
        item.url && (activeUrl === item.url || activeUrl.startsWith(item.url + "/"))
    );
    
    const [open, setOpen] = useState(hasActiveChild || false);
    const isParent = group.items && group.items.length > 0;

    return (
        <>
            <SidebarMenuButton
                onClick={() => setOpen(!open)}
                className="w-full justify-between font-medium"
            >
                <div className="flex items-center gap-2">
                    {IconRenderer((group as SidebarGroupType).groupIcon)}
                    {IconRenderer((group as MenuItem).icon)}
                    <span>{group.title}</span>
                </div>
                {isParent && (
                    open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                )}
            </SidebarMenuButton>

            {open && isParent && (
                <div className="ml-4 mt-1 border-l pl-3 space-y-1">
                    {group.items!.map((item) =>
                        item.collapsible ? (
                            // Recursive call wrapped in div to maintain structure
                            <div key={item.title}> 
                                <CollapsibleMenu
                                    group={item}
                                    activeUrl={activeUrl}
                                />
                            </div>
                        ) : (
                            <SidebarMenuItem key={item.title} className="list-none">
                                <SidebarMenuButton
                                    asChild
                                    className={menuActive(item.url, activeUrl)}
                                    size="sm"
                                >
                                    <a href={item.url} className="flex items-center gap-2">
                                        {IconRenderer(item.icon)}
                                        <span>{item.title}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    )}
                </div>
            )}
        </>
    );
}

/* ============================================================================
   ===============  MAIN SIDEBAR COMPONENT  ===================================
============================================================================ */

export function AppSidebar({
    active = "",
    user,
    appName,
    navData,
    ...props
}: AppSidebarProps) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <img
                                        src="/img/logo/sdi-logo-light.png"
                                        alt="Logo"
                                        className="w-6 h-6"
                                    />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">{appName}</span>
                                    <span className="text-xs text-muted-foreground">v1.0</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* REVISI: Tambahkan gap-1 disini agar jarak antar grup sama dengan jarak antar item */}
            <SidebarContent className="gap-1">
                {navData.map((group) => (
                    // REVISI: py-0 untuk menghilangkan padding bawaan grup
                    <SidebarGroup key={group.title} className="py-0">
                        
                        {/* Label hanya muncul jika grup BUKAN collapsible dan BUKAN Main (agar hemat tempat) */}
                        {!group.collapsible && !group.groupIcon && group.title !== "Main" ? (
                            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                        ) : null}

                        {group.collapsible ? (
                            // REVISI: Bungkus Collapsible dalam SidebarMenu > MenuItem agar margin konsisten
                            <SidebarMenu className="gap-1">
                                <SidebarMenuItem>
                                    <CollapsibleMenu group={group} activeUrl={active} />
                                </SidebarMenuItem>
                            </SidebarMenu>
                        ) : (
                            // REVISI: Menu biasa juga menggunakan gap-1
                            <SidebarMenu className="gap-1">
                                {group.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            className={menuActive(item.url, active)}
                                        >
                                            <a href={item.url}>
                                                {IconRenderer(item.icon)}
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        )}
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}   