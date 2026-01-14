'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar";
import { Axis3DIcon, DroneIcon, Fuel, FuelIcon, LogOutIcon, Plane, PlaneIcon, PlaneLandingIcon, SendHorizonal, TicketsIcon } from 'lucide-react';
import axios from 'axios';

const menuItems = [
    {
        title: "Main",
        items: [
            {
                title: "Flights",
                icon: PlaneIcon,
                url: "/home"
            },
            {
                title: "My Tickets",
                icon: TicketsIcon,
                url: "/home/tickets"
            },
        ]
    }
]

export const UserSidebar = () => {
    const router = useRouter();
    const pathname = usePathname();

    async function signOut() {
        try {
            const res = await axios.post('/api/auth/signout');
            if(res.data?.success) {
                router.push('/signin')
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <Sidebar collapsible='icon'>
            <SidebarHeader className='mt-4'>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild className='gap-x-4 h-10 px-4'>
                        <Link href={"/"} prefetch>
                            <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
                                            <Plane className="h-6 w-6 text-white" />
                                          </div>
                            <span className='font-semibold text-sm'>SkyBound</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarHeader>
            <SidebarContent>
                {menuItems.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => (
                                    <SidebarMenuItem key={item.title} >
                                        <SidebarMenuButton
                                            tooltip={item.title}
                                            isActive={
                                                item.url === "/" ? pathname === "/" : pathname.startsWith(item.url)
                                            }
                                            asChild
                                            className='gap-x-4 h-10 px-4'
                                        >
                                            <Link href={item.url} prefetch>
                                            <item.icon className='size-4' />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip={"Sign out"}
                            className='"gap-x-4 h-10 px-4'
                            onClick={signOut}
                        >
                            <LogOutIcon className='h-4 w-4'/>
                            <span>Sign out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}

