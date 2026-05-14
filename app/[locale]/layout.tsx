import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Header from "@/components/Header";
import type { Metadata } from "next";
import "../globals.css";
import Script from "next/script";
import Footer from "@/components/Footer";
import FeedbackWidget from "@/components/FeedbackWidget";
import { AuthProvider } from "@/lib/auth-context";
import PayPalProviderWrapper from "@/components/PayPalProviderWrapper";
import { GoogleAnalytics } from '@next/third-parties/google'
import { getTranslations } from "next-intl/server";


type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "metadata" });

    return {
        title: t("homeTitle"),
        description: t("homeDesc"),


        openGraph: {
            siteName: "ConnectTheDotsPrintable.online",
            title: t("homeTitle"),
            description: t("homeDesc"),
            images: '/images/og-image.png',
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: t("homeTitle"),
            description: t("homeDesc"),
        },
        other: {
            "google-adsense-account": "ca-pub-3383070348689557",
        },
    };
}
export default async function LocaleLayout({
    children,
    params,
}: Props) {
    const { locale } = await params;
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning  >
            <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3383070348689557"
                crossOrigin="anonymous"></Script>
            <body>
                <GoogleAnalytics gaId="G-CM76E2ZP8E" />
                <Script
                    id="microsoft-clarity"
                    strategy="lazyOnload"
                    dangerouslySetInnerHTML={{
                        __html: `
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "tf6ljm5fsf");
              `,
                    }}
                />
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <AuthProvider>
                        <PayPalProviderWrapper>
                            <Header />
                            {children}
                            <Footer />
                            <FeedbackWidget />
                        </PayPalProviderWrapper>
                    </AuthProvider>
                </NextIntlClientProvider>
            </body>
        </html >
    );
}

