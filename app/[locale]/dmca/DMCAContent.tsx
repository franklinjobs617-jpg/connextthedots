export default function DMCAContent() {
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-[clamp(1.8rem,4vw,3rem)] font-bold mb-8">
                    DMCA Policy
                </h1>
                <p className="text-gray-600 mb-6">Last updated: April 15, 2026</p>

                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-dark">Overview</h2>
                        <p className="text-gray-600">
                            ConnectTheDotsPrintable.online respects intellectual property rights and
                            complies with the U.S. Digital Millennium Copyright Act (DMCA), 17 U.S.C.
                            512. If you believe material on our website infringes your copyright,
                            please send a formal notice using the process below.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-dark">How to Submit a DMCA Notice</h2>
                        <p className="text-gray-600 mb-4">
                            Your notice must include all information required by 17 U.S.C. 512(c)(3):
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                            <li>A physical or electronic signature of the copyright owner or authorized agent</li>
                            <li>Identification of the copyrighted work claimed to be infringed</li>
                            <li>
                                Identification of the allegedly infringing material, including exact URL(s)
                                so we can locate it
                            </li>
                            <li>Your name, mailing address, telephone number, and email address</li>
                            <li>
                                A statement that you have a good-faith belief the disputed use is not
                                authorized by the copyright owner, its agent, or the law
                            </li>
                            <li>
                                A statement that the information in the notice is accurate and, under
                                penalty of perjury, that you are authorized to act on behalf of the owner
                            </li>
                        </ul>
                        <p className="text-gray-600">
                            Send notices to: <span className="font-medium">support@connectthedotsprintable.online</span>
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-dark">Our Response Process</h2>
                        <p className="text-gray-600 mb-4">
                            After receiving a valid DMCA notice, we may remove or disable access to the
                            reported content and notify the affected user where appropriate. We may request
                            additional information if the notice is incomplete.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-dark">Counter-Notification Process</h2>
                        <p className="text-gray-600 mb-4">
                            If you believe your content was removed by mistake or misidentification, you may
                            submit a counter-notification under 17 U.S.C. 512(g)(3) that includes:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                            <li>Your physical or electronic signature</li>
                            <li>Identification of the removed material and its prior location (URL)</li>
                            <li>
                                A statement under penalty of perjury that you have a good-faith belief the
                                material was removed due to mistake or misidentification
                            </li>
                            <li>
                                Your name, address, and phone number, and a statement consenting to the
                                jurisdiction of the Federal District Court for your district (or your service
                                address if outside the U.S.), and that you will accept service of process from
                                the original complainant or their agent
                            </li>
                        </ul>
                        <p className="text-gray-600">
                            Send counter-notices to: <span className="font-medium">support@connectthedotsprintable.online</span>
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-dark">Repeat Infringer Policy</h2>
                        <p className="text-gray-600">
                            We may suspend or terminate accounts, uploads, or access for users who are
                            determined to be repeat infringers.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-dark">Misrepresentation Warning</h2>
                        <p className="text-gray-600">
                            Please be aware that knowingly misrepresenting that material is infringing (or
                            was removed by mistake) may result in legal liability under applicable law.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-dark">Contact</h2>
                        <p className="text-gray-600">
                            For copyright and DMCA matters, contact us at:
                        </p>
                        <p className="text-gray-600 font-medium mt-2">
                            support@connectthedotsprintable.online
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
