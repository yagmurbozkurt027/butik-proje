import './globals.css'
import Header from './Header';
import AnimatedBackground from "./AnimatedBackground";
import { ToastContainer } from 'react-toastify';
import PwaInit from './PwaInit';
import PWAInstall from './PWAInstall';

export const metadata = {
  title: "Butik Proje",
  description: "Butik Proje Açıklama"
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className="dark">
      <body className="bg-gray-900 dark:bg-gray-900 text-white dark:text-white">
        <PwaInit />
        <AnimatedBackground />
        <div className="relative z-10">
          <Header />
        </div>
        <main className="flex-1 flex flex-col items-center justify-center w-full relative z-10">
          {children}
        </main>
        <ToastContainer 
          position="top-right" 
          autoClose={3000}
          theme="dark"
          toastStyle={{
            backgroundColor: '#1f2937',
            color: '#f9fafb'
          }}
        />
        <PWAInstall />
        <footer className="w-full text-center py-4 text-gray-400 bg-transparent relative z-10">
          © 2025 Butik Proje. Tüm hakları saklıdır.
        </footer>
      </body>
    </html>
  );
}

