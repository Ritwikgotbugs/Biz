import { ReactNode, useState } from "react";
import SideNav from "./SideNav";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideNav isCollapsed={isNavCollapsed} onCollapse={setIsNavCollapsed} />
      <div 
        className={`flex-1 transition-all duration-500 ease-in-out transform
          ${isNavCollapsed ? 'ml-16' : 'ml-64'}`}
      >
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout; 