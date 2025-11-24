const BASE_URL = process.env.NEXT_PUBLIC_URL as string;

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#f5f5f5",
};

export const metadata = {
  title: "Schedule Jasa Pembuatan Website Profesional",
  description:
    "Jadwalkan layanan pembuatan website profesional dengan mudah dan cepat. Solusi terbaik untuk kebutuhan website bisnis, portofolio, toko online, dan lainnya.",

  authors: [{ name: "Rizki Ramadhan" }],

  keywords: [
    "Jasa Pembuatan Website",
    "Pembuatan Website Profesional",
    "Jasa Web Developer",
    "Website Bisnis",
    "Website Portofolio",
    "Toko Online",
    "Landing Page",
    "Web Design",
    "Web Development",
    "Jadwal Konsultasi Website",
    "Rizki Ramadhan",
  ],

  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "64x64 32x32 24x24 16x16",
        type: "image/x-icon",
      },
    ],
    apple: "/favicon.ico",
    shortcut: "/favicon.ico",
    appleTouchIcon: "/favicon.ico",
  },

  tags: [
    {
      name: "Schedule Jasa Pembuatan Website Profesional",
      content: "Jasa Pembuatan Website, Konsultasi, Jadwal",
    },
  ],

  manifest: "/manifest.json",

  metadataBase: new URL(BASE_URL),
  canonical: BASE_URL,

  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "format-detection": "telephone=no",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "msapplication-TileColor": "#f5f5f5",
  },

  openGraph: {
    type: "website",
    title: "Schedule Jasa Pembuatan Website Profesional",
    description:
      "Jadwalkan layanan pembuatan website profesional dengan mudah dan cepat. Solusi terbaik untuk kebutuhan website bisnis, portofolio, toko online, dan lainnya.",
    url: BASE_URL,
    siteName: "Schedule Jasa Pembuatan Website Profesional",
    locale: "id_ID",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Schedule Jasa Pembuatan Website Profesional",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Schedule Jasa Pembuatan Website Profesional",
    description:
      "Jadwalkan layanan pembuatan website profesional dengan mudah dan cepat. Solusi terbaik untuk kebutuhan website bisnis, portofolio, toko online, dan lainnya.",
    creator: "@rizki_ramadhan",
    site: "@rizki_ramadhan",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: BASE_URL,
    languages: {
      "id-ID": BASE_URL,
    },
  },
};

export default metadata;
