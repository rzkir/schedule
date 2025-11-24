"use client";

import React from "react";

import { Toaster } from 'sonner'

const Pathname = ({ children }: { children: React.ReactNode }) => {
    return (
        <main>
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#333',
                        color: '#fff',
                    },
                }}
            />
            {children}
        </main>
    );
};

export default Pathname;