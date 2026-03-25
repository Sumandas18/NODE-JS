'use client';
import { useRouter } from 'next/navigation';

export default function Navbar({ role }: { role: 'Admin' | 'Employee' }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 p-4 sticky top-0 z-50 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
          {role.charAt(0)}
        </div>
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">
          {role} Panel
        </h1>
      </div>
      <button 
        onClick={handleLogout}
        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-all bg-gray-50 hover:bg-red-50 rounded-lg shadow-sm border border-gray-200 hover:border-red-200"
      >
        Logout
      </button>
    </nav>
  );
}
