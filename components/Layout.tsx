
import React from 'react';
import { User, UserRole } from '../types';

interface LayoutProps {
  user: User | null;
  onLogout: () => void;
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, children, activeTab, setActiveTab }) => {
  const isOnlyUser = user?.role === UserRole.USER;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-indigo-700 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <i className="fas fa-car-side text-2xl"></i>
            <h1 className="text-xl font-bold tracking-tight">أوتو هب للفحص</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {user && (
              <div className="text-sm text-indigo-100">
                <span className="hidden md:inline">مرحباً، </span>
                <span className="font-bold">{user.username}</span>
                <span className="bg-indigo-600 px-2 py-0.5 rounded text-[10px] mr-2 uppercase">
                  {user.role}
                </span>
              </div>
            )}
            <button 
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-lg text-sm transition-colors"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for Desktop - Hidden for simple User */}
        {!isOnlyUser && (
          <aside className="hidden md:flex flex-col w-64 bg-white border-l shadow-sm">
            <nav className="p-4 space-y-1">
              <NavItem 
                active={activeTab === 'dashboard'} 
                onClick={() => setActiveTab('dashboard')} 
                icon="chart-line" 
                label="لوحة التحكم" 
              />
              <NavItem 
                active={activeTab === 'cars'} 
                onClick={() => setActiveTab('cars')} 
                icon="search" 
                label="بحث السيارات" 
              />
              {(user?.role === UserRole.INSPECTOR || user?.role === UserRole.ADMIN || user?.role === UserRole.MODERATOR) && (
                <NavItem 
                  active={activeTab === 'add-car'} 
                  onClick={() => setActiveTab('add-car')} 
                  icon="plus-circle" 
                  label="تسجيل فحص" 
                />
              )}
              {(user?.role === UserRole.ADMIN || user?.role === UserRole.MODERATOR) && (
                <>
                  <div className="pt-4 pb-2 px-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    الإدارة
                  </div>
                  <NavItem 
                    active={activeTab === 'users'} 
                    onClick={() => setActiveTab('users')} 
                    icon="users-cog" 
                    label="إدارة الحسابات" 
                  />
                  <NavItem 
                    active={activeTab === 'requests'} 
                    onClick={() => setActiveTab('requests')} 
                    icon="clipboard-check" 
                    label="طلبات التعديل" 
                  />
                </>
              )}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50 ${isOnlyUser ? 'w-full' : ''}`}>
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation - Hidden for simple User */}
      {!isOnlyUser && (
        <div className="md:hidden bg-white border-t flex justify-around p-2 sticky bottom-0">
          <MobileNavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon="chart-line" />
          <MobileNavItem active={activeTab === 'cars'} onClick={() => setActiveTab('cars')} icon="search" />
          {(user?.role !== UserRole.USER) && (
            <MobileNavItem active={activeTab === 'add-car'} onClick={() => setActiveTab('add-car')} icon="plus-circle" />
          )}
          {(user?.role === UserRole.ADMIN || user?.role === UserRole.MODERATOR) && (
            <MobileNavItem active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon="users-cog" />
          )}
        </div>
      )}
    </div>
  );
};

const NavItem: React.FC<{ active: boolean; onClick: () => void; icon: string; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
      active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <i className={`fas fa-${icon} w-5`}></i>
    {label}
  </button>
);

const MobileNavItem: React.FC<{ active: boolean; onClick: () => void; icon: string }> = ({ active, onClick, icon }) => (
  <button 
    onClick={onClick}
    className={`p-3 rounded-xl transition-all ${
      active ? 'text-indigo-700 bg-indigo-50' : 'text-gray-400'
    }`}
  >
    <i className={`fas fa-${icon} text-xl`}></i>
  </button>
);

export default Layout;
