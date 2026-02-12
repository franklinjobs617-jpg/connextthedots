"use client";

import { useTranslations } from "next-intl";
import { Check, X, Star, Zap, Cpu } from "lucide-react";
import Link from "next/link";

export default function PricingContent() {
    // 使用 pricing 作为根命名空间
    const t = useTranslations("pricing");

    return (

        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-[clamp(1.8rem,4vw,3rem)] font-bold mb-8">Privacy Policy</h1>
                <p className="text-gray-600 mb-6">Last updated: July 15, 2023</p>

                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-dark">Introduction</h2>
                        <p className="text-gray-600 mb-4">
                            ConnectTheDotsPrintable.online ("we", "our", or "us") is committed to protecting your privacy.
                            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
                            you use our website, including our connect the dots printable generator and related services.
                        </p>
                        <p className="text-gray-600">
                            By using our website, you agree to the collection and use of information in accordance with this
                            policy.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-dark">Information We Collect</h2>
                        <h3 className="text-xl font-semibold mb-2 text-dark">Personal Information</h3>
                        <p className="text-gray-600 mb-4">
                            We do not collect personal information such as your name, email address, or contact details
                            unless you voluntarily provide it to us, for example, when contacting us through our contact
                            form.
                        </p>

                        <h3 className="text-xl font-semibold mb-2 text-dark">Non-Personal Information</h3>
                        <p className="text-gray-600 mb-4">
                            When you visit our website, we may automatically collect non-personal information about your
                            visit, including:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                            <li>The IP address of your device</li>
                            <li>Browser type and version</li>
                            <li>Operating system</li>
                            <li>Pages you visit and the time spent on each page</li>
                            <li>Referring URL</li>
                            <li>Information about how you interact with our website</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-dark">How We Use Your Information</h2>
                        <p className="text-gray-600 mb-4">
                            We use the information we collect for the following purposes:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                            <li>To improve our website and services</li>
                            <li>To understand how users interact with our website</li>
                            <li>To personalize your experience</li>
                            <li>To respond to your inquiries</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-dark">Cookies</h2>
                        <p className="text-gray-600 mb-4">
                            Our website uses cookies to enhance your experience. Cookies are small data files stored on your
                            device that help us improve our website and your experience.
                        </p>
                        <p className="text-gray-600">
                            You can disable cookies through your browser settings, but this may affect the functionality of
                            our website.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-dark">Third-Party Services</h2>
                        <p className="text-gray-600 mb-4">
                            We may use third-party services, such as Google Analytics, to help us analyze how users interact
                            with our website. These third parties may collect information about your use of our website, but
                            they are prohibited from using this information for any other purpose.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-dark">Data Security</h2>
                        <p className="text-gray-600">
                            We implement reasonable security measures to protect the information we collect. However, no
                            method of transmission over the internet or electronic storage is 100% secure, so we cannot
                            guarantee absolute security.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-dark">Changes to This Privacy Policy</h2>
                        <p className="text-gray-600">
                            We may update this Privacy Policy from time to time. We will notify you of any changes by
                            posting the new Privacy Policy on this page. You are advised to review this Privacy Policy
                            periodically for any changes.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-dark">Contact Us</h2>
                        <p className="text-gray-600">
                            If you have any questions about this Privacy Policy, please contact us at:
                        </p>
                        <p className="text-gray-600 font-medium mt-2">support@connectthedotsprintable.online</p>
                    </div>
                </div>
            </div>
        </section>
    );
}