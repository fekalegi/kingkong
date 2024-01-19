"use client";
import "./globals.css";
import "./data-tables-css.css";
import "./satoshi.css";
import { useState, useEffect } from "react";
import Loader from "@/components/common/Loader";
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState(0);

  const [loading, setLoading] = useState<boolean>(true);
  const pathname = usePathname();
  const router = useRouter();
  
  const token = localStorage.getItem('token');
  const verifyToken = async () => {
    try {
      if (!token) {
        // Redirect to login page if no token found
        router.push('/auth/signin');
        return;
      }

      // Make a request to verify token validity (e.g., send token to server for verification)
      const response = await fetch('http://localhost:7000/api/v1/auth/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const body = await response.json();
      setRole(body.data.role);
      if (!response.ok) {
        // Handle 401 Unauthorized error (e.g., token expired)
        localStorage.removeItem('token'); // Remove token from localStorage
        router.push('/auth/signin');
      }
    } catch (error) {
      // Handle errors (e.g., network errors)
      console.error('Error verifying token:', error);
    }
  };

  verifyToken();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          {loading ? (
            <Loader />
          ) : (
            <div className="flex h-screen overflow-hidden">
              {!pathname.includes("auth") &&
              <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                role={role}
              />}
              <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                {/* <!-- ===== Header Start ===== --> */}
                {!pathname.includes("auth") &&
                  <Header
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
                }
                {/* <!-- ===== Header End ===== --> */}

                {/* <!-- ===== Main Content Start ===== --> */}
                <main>
                <ToastContainer />
                  <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                    {children}
                  </div>
                </main>
                {/* <!-- ===== Main Content End ===== --> */}
              </div>
              {/* <!-- ===== Content Area End ===== --> */}
            </div>
          )}
        </div>
      </body>
    </html>
  );
}
