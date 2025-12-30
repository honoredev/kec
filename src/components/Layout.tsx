import { ReactNode } from 'react';
import KecHeader from './KecHeader';
import Footer from './Footer';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-white">
      <KecHeader />
      
      <main className="flex-1 pt-16">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
