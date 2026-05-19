import React, { useEffect } from 'react';
import { LeftSidebar } from './LeftSidebar';
import { useUserStore } from '../../store/useUserStore';

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const theme = useUserStore((state) => state.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="h-screen w-full flex bg-cream dark:bg-gray-dark transition-colors duration-300 overflow-hidden">
      <LeftSidebar />
      <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar p-4 lg:p-6 lg:pl-0">
        <main className="flex-1 w-full max-w-[1200px] mx-auto h-full">
          {children}
        </main>
      </div>
    </div>
  );
};
