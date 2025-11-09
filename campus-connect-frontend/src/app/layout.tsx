import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import Header from '@/components/Header';

export const metadata = {
  title: "Campus Connect - Lost & Found",
  description: "Campus Lost and Found Hub",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-grow container mx-auto p-4">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
