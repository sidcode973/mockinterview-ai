'use client';

import Breadcrumb from '@/components/layout/breadcrumb/breadcrumbs';
import AppSidebar from '@/components/layout/sidebar/AppSidebar';
import usePageTitle from '@/hooks/usePageTitle';
import { usePathname } from 'next/navigation';
import React from 'react';

const AppLayout = ({ children }: { children: React.ReactNode }) => {

    const { title, breadcrumbs } = usePageTitle();
    const pathname = usePathname();

    const noBreadcrumbPaths = ['/app/interviews/conduct', '/app/conduct'];

    const showBreadcrumb = !noBreadcrumbPaths.some((route)=> {
        return pathname.startsWith(route)
    })

    return (
        <div className="flex w-full flex-1">

            {/* Sidebar — fixed width, sticky within viewport */}
            <div className="w-64 shrink-0 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
                <AppSidebar />
            </div>

            {/* Main Content — takes remaining space, min-width 0 prevents overflow */}
            <div className="flex-1 min-w-0 flex flex-col">
                <div className="px-6 pt-4">
                    {showBreadcrumb &&  (
                    <Breadcrumb title={title} breadcrumbs={breadcrumbs} />
                    )}
                </div>
                <main className="flex-1 px-6 pb-6">
                    {children}
                </main>
            </div>

        </div>
    );
};

export default AppLayout;