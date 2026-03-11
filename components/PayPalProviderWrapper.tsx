"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function PayPalProviderWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    // 💡 Sanitize Client ID: Remove quotes if they exist in the env var
    // let clientId = "AQgGwtwMZuLeZGpzyslyWLBa_wC5VRJNkXiMs4mgK-91MoWGuBez4-lvtjJacVftQ_qD1ZdxGN4_yCb6";
    let clientId  = "AUZv0pJuoq3krZSjrCrJOUXyis508Wf3R4DE52gBVIHbCrMK6kAzzNzpHvH1wKXhhsMl3DrcEjIki8gY";
    clientId = clientId.replace(/^"|"$/g, '').trim();

    const paypalOptions = {
        clientId: clientId,
        currency: "USD",
        vault: true,
    };

    return (
        <PayPalScriptProvider options={paypalOptions}>
            {children}
        </PayPalScriptProvider>
    );
}
