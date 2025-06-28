import React from "react";

export default function DeleteSVG(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <line x1="4.5" y1="4.5" x2="11.5" y2="11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="11.5" y1="4.5" x2="4.5" y2="11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}