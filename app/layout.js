export const metadata = {
  title: "Web Cloner",
  description: "Clone and browse websites via proxy",
  robots: "noindex, nofollow"
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

