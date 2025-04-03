
import React from 'react';

export const PawIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="8" cy="6" r="2" />
    <circle cx="16" cy="6" r="2" />
    <circle cx="5" cy="13" r="2" />
    <circle cx="19" cy="13" r="2" />
    <path d="M12 17a4 4 0 0 0 3.57-5.77l-.64-1.28a2 2 0 0 0-3.56-.06l-.37.83-.38-.83a2 2 0 0 0-3.56.06l-.64 1.28A4 4 0 0 0 12 17Z" />
  </svg>
);
