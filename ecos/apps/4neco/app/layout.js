import localFont from "next/font/local";
import Head from "next/head";
import "./globals.css";
import ClientLayout from "./components/ClientLayout";
import URL_401_Carousel from "./components/URL_401_Carousel";
import Footer from "./components/Footer";
import Image from "next/image";
import Script from "next/script";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "4n.eco | Innovating the Future",
  metadataBase: new URL("https://4n.eco"),
  description:
    "4N ECOTech is committed to bringing transformative technology solutions for the next generation.",
  keywords: [
    "4NECO Tech",
    "technology",
    "innovation",
    "future tech",
    "transformative solutions",
  ],
  author: "4NECO Tech Team",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "4NECO Tech | Innovating the Future",
    description:
      "4NECO Tech is committed to bringing transformative technology solutions for the next generation.",
    images: "/4NECOtechLOGO.png",
    url: "https://4n.eco",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "4N ECOTech | Innovating the Future",
    description:
      "4NECO Tech is committed to bringing transformative technology solutions for the next generation.",
    images: "/4NECOtechLOGO.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Karla:ital,wght@0,200..800;1,200..800&family=Montserrat:wght@100;200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>

      <body>
        <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
          `}
        </Script>
        <div className="app-container">
          <div className="seperator">
            <div className="logo-container">
              <Image
                src="/4NECOtechLOGO.png"
                alt="4N Logo"
                className="logo"
                width={200}
                height={100}
              />
            </div>
            <URL_401_Carousel />

            <div className="main-content">
              <ClientLayout>{children}</ClientLayout>
            </div>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
