import Link from 'next/link';
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  Share2,
  LogOut
} from 'lucide-react';

export const metadata = {
  title: 'Admin - MyPost',
  description: 'Admin dashboard for MyPost',
};

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/platforms', label: 'Platforms', icon: Share2 },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <span className="text-blue-600">My</span>Post
            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded">
              Admin
            </span>
          </Link>
        </div>
        
        <nav className="px-4 pb-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
