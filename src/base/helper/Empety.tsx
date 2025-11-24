import React from 'react'

export function EmptyDataSVG() {
    return (
        <svg
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto mb-4 text-muted-foreground"
        >
            <rect x="3" y="7" width="18" height="13" rx="2" fill="currentColor" fillOpacity="0.15" />
            <path d="M3 7l3-4h12l3 4" stroke="currentColor" strokeWidth="1.5" />
            <rect x="7" y="11" width="5" height="2" rx="1" fill="currentColor" fillOpacity="0.3" />
        </svg>
    );
}