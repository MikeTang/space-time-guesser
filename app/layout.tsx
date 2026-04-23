import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Space Time Guesser",
  description: "A space-themed time guessing game for kids!",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Nunito:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          fontFamily: "'Nunito', sans-serif",
          background: "#030a1a",
          minHeight: "100vh",
          overflowX: "hidden",
          margin: 0,
          padding: 0,
        }}
      >
        {children}
      </body>
    </html>
  );
}
