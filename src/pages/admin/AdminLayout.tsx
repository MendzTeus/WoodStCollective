import React from 'react';
import { 
  LayoutDashboard,
  FileEdit,
  User,
  Star,
  LogOut
} from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-background-dark text-text-primary font-sans">
      {/* Sidebar Navigation */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-surface-container border-r border-divider-subtle flex flex-col z-50 transition-all duration-300">
        <div className="px-6 py-12">
          <Link to="/">
            <h1 className="font-display text-2xl font-black mb-16 tracking-tight italic text-primary">Wood Street</h1>
          </Link>
          <nav className="space-y-4">
            <Link 
              to="/admin/pages" 
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${isActive('/admin/pages') ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-text-secondary hover:bg-white/5 hover:text-primary'}`}
            >
              <FileEdit size={20} />
              <span className="text-xs font-semibold uppercase tracking-wider">Page Editor</span>
            </Link>
            <Link 
              to="/admin/rooms" 
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${isActive('/admin/rooms') ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-text-secondary hover:bg-white/5 hover:text-primary'}`}
            >
              <User size={20} />
              <span className="text-xs font-semibold uppercase tracking-wider">Rooms</span>
            </Link>
            
            <Link 
              to="/admin/reviews" 
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${isActive('/admin/reviews') ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-text-secondary hover:bg-white/5 hover:text-primary'}`}
            >
              <Star size={20} />
              <span className="text-xs font-semibold uppercase tracking-wider">Reviews</span>
            </Link>

            <Link
              to="/admin/analytics"
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${isActive('/admin/analytics') ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-text-secondary hover:bg-white/5 hover:text-primary'}`}
            >
              <LayoutDashboard size={20} />
              <span className="text-xs font-semibold uppercase tracking-wider">Analytics</span>
            </Link>
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-divider-subtle">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <User size={18} />
              </div>
              <div className="flex flex-col truncate">
                <span className="text-sm font-bold text-primary truncate" title={user?.email || 'Admin User'}>
                  {user?.email || 'Admin User'}
                </span>
                <span className="text-xs text-text-muted">Manager</span>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="text-text-muted hover:text-primary transition-colors shrink-0 ml-2" 
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen">
        <Outlet />
      </main>

    </div>
  );
}
