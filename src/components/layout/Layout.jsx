import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden animated-gradient-bg">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full mix-blend-screen filter blur-[100px] opacity-30 bg-indigo-600"
          style={{ animation: 'floatOrb1 20s infinite ease-in-out' }}
        ></div>
        <div 
          className="absolute top-[20%] -right-[10%] w-[40vw] h-[40vw] rounded-full mix-blend-screen filter blur-[100px] opacity-25 bg-purple-600"
          style={{ animation: 'floatOrb2 25s infinite ease-in-out reverse' }}
        ></div>
        <div 
          className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full mix-blend-screen filter blur-[120px] opacity-20 bg-blue-600"
          style={{ animation: 'floatOrb1 30s infinite ease-in-out 5s' }}
        ></div>
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzOXYyMWgyNHYtMjFINzZ6bTAtMzl2MjFINzZWLjEySDM2em0yNC41IDU4LjV2LTE4aC0yM3YxOGgyM3ptMC0zOXYtMThoLTIzdjE4aDIzeiIgZmlsbD0iI2QxZDVkYiIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9nPjwvc3ZnPg==')] z-0"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-[81px]">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
