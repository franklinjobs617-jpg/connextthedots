"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function PayPalProviderWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    // 💡 Sanitize Client ID: Remove quotes if they exist in the env var
    let clientId = "AQgGwtwMZuLeZGpzyslyWLBa_wC5VRJNkXiMs4mgK-91MoWGuBez4-lvtjJacVftQ_qD1ZdxGN4_yCb6";
    clientId = clientId.replace(/^"|"$/g, '').trim();

    const paypalOptions = {
        clientId: clientId,
        currency: "USD",
        intent: "capture",
    };

    return (
        <PayPalScriptProvider options={paypalOptions}>
            {children}
        </PayPalScriptProvider>
    );
}
