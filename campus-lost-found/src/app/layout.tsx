import "./globals.css";
import Link from "next/link";

export const metadata = { title: "Campus Lost & Found", description: "Section A" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <div className="nav-inner">
            <div className="row" style={{gap:16}}>
              <Link href="/">Home</Link>
              <Link href="/items">Items</Link>
              <Link href="/items/new">Report</Link>
              <Link href="/lost">Lost</Link>
              <Link href="/found">Found</Link>
              <Link href="/profile">Profile</Link>
            </div>
            <form action="/api/auth/logout" method="post">
              <button className="btn btn-outline" type="submit">Sign out</button>
            </form>
          </div>
        </nav>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
