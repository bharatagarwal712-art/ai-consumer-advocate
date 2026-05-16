import "./globals.css";

export const metadata = {
  title: "AI Consumer Advocate",
  description: "AI-powered complaint drafting assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}