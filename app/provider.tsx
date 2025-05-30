"use client";
import { SessionProvider } from "next-auth/react";
import { Children } from "react";

export function Providers({children}: Readonly<{children: React.ReactNode}>) {
    return <SessionProvider>
        {children}
    </SessionProvider>
    
}