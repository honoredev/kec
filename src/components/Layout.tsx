import { ReactNode } from 'react';
import KecHeader from './KecHeader';
import Footer from './Footer';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen min-h-[100svh] min-h-[-webkit-fill-available] bg-white">
      <KecHeader />
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
