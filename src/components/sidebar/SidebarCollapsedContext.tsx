import React, { createContext, useContext, useState } from "react";

interface SidebarCollapsedContextType {
    collapsed: boolean;
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarCollapsedContext = createContext<SidebarCollapsedContextType | undefined>(undefined);

export const SidebarCollapsedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <SidebarCollapsedContext.Provider value={{ collapsed, setCollapsed }}>
            {children}
        </SidebarCollapsedContext.Provider>
    );
};

export function useSidebarCollapsed() {
    const context = useContext(SidebarCollapsedContext);
    if (!context) {
        throw new Error("useSidebarCollapsed must be used within a SidebarCollapsedProvider");
    }
    return context;
} 