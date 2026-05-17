import { Providers } from "./Provider";
import { ToastContainer } from 'react-toastify';
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
          <ToastContainer position="top-right" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}