'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Package, LayoutDashboard, UserPlus, Users, LogOut } from 'lucide-react';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Create Customer', path: '/dashboard/create-customer', icon: UserPlus },
    { name: 'View Customers', path: '/dashboard/view-customers', icon: Users },
  ];

  return (
    <aside className="w-64 bg-sky-800 text-white flex flex-col h-screen">
      <div className="p-6 bg-sky-900">
        <div className="flex items-center gap-3">
          <Package className="w-8 h-8" />
          <div>
            <h2 className="font-bold text-lg">Aarogya Aadhar</h2>
            <p className="text-xs text-sky-300">Review System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3 ${
                isActive ? 'bg-sky-700' : 'hover:bg-sky-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sky-700">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 px-4 py-3 rounded-lg transition flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}