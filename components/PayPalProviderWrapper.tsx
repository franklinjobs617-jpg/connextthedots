"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function PayPalProviderWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    // 💡 Sanitize Client ID: Remove quotes if they exist in the env var
    // let clientId = "AQgGwtwMZuLeZGpzyslyWLBa_wC5VRJNkXiMs4mgK-91MoWGuBez4-lvtjJacVftQ_qD1ZdxGN4_yCb6";
    let clientId  = "AWadfwOBXGEALRr0IyOd0oyYm-D16yyoWkPED0FoH-KPJjVVaZuE8iNq-nwG_vCPpR_DnLGiGU5Cmj9F";
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
