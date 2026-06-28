import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = () => {
  return (
    <div className="relative flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Subtle animated background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40 dark:opacity-60">
        <div className="animate-blob absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl dark:bg-gold-500/10" />
        <div className="animate-blob absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-brand-700/10 blur-3xl [animation-delay:4s] dark:bg-brand-700/20" />
      </div>

      <div className="relative z-10 flex h-full w-full">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;