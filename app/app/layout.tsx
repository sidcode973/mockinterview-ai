'use client';

import Breadcrumb from '@/components/layout/breadcrumb/breadcrumbs';
import AppSidebar from '@/components/layout/sidebar/AppSidebar';
import usePageTitle from '@/hooks/usePageTitle';
import React from 'react';

const AppLayout = ({ children }: { children: React.ReactNode }) => {

    const { title, breadcrumbs } = usePageTitle();

    return (
        <div className="flex w-full min-h-screen">

            {/* Sidebar — fixed width, never shrinks */}
            <div className="w-64 shrink-0 self-stretch">
                <AppSidebar />
            </div>

            {/* Main Content — takes remaining space, min-width 0 prevents overflow */}
            <div className="flex-1 min-w-0 flex flex-col">
                <div className="px-6 pt-4">
                    <Breadcrumb title={title} breadcrumbs={breadcrumbs} />
                </div>
                <main className="flex-1 px-6 pb-6">
                    {children}
                </main>
            </div>

        </div>
    );
};

export default AppLayout;