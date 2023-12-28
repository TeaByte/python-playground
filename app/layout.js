import { Fira_Code } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";

const font = Fira_Code({ subsets: ["latin"] });
export const metadata = {
  title: "Python Playground",
  description: "Python Playground",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js"></script>
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <body className={font.className}>{children}</body>
        </ThemeProvider>
      </body>
    </html>
  );
}
