import React from 'react';

export const BashIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M4.5 7.5L9 12l-4.5 4.5M12 19.5h7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

export const JavaScriptIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="#F7DF1E" className={className}>
    <rect width="24" height="24" fill="#F7DF1E" rx="4"/>
    <path d="M17.5 12.5c0 1.5-1 2.5-2.5 2.5s-2.5-1-2.5-2.5V8h1.5v4.5c0 .5.5 1 1 1s1-.5 1-1V8H17.5v4.5zM11 13c-.5 0-1-.5-1-1h-1.5c0 1.5 1 2.5 2.5 2.5s2.5-1 2.5-2.5c0-1.5-1-2.5-2.5-2.5s-1.5-.5-1.5-1 .5-1 1.5-1 1.5.5 1.5 1h1.5c0-1.5-1-2.5-2.5-2.5S8.5 7 8.5 8.5c0 1.5 1 2.5 2.5 2.5s1.5.5 1.5 1-.5 1-1.5 1z" fill="#000"/>
  </svg>
);

export const TypeScriptIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="#3178C6" className={className}>
    <rect width="24" height="24" fill="#3178C6" rx="4"/>
    <path d="M12 8v1.5h3V11h-3v2h3v1.5h-4.5V8H12zM8.5 8v1.5H10V11H7.5V8H8.5z" fill="white"/>
  </svg>
);

export const PythonIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="pythonBlue" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#387EB8"/>
        <stop offset="100%" stopColor="#366994"/>
      </linearGradient>
      <linearGradient id="pythonYellow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFE052"/>
        <stop offset="100%" stopColor="#FFC331"/>
      </linearGradient>
    </defs>
    <path d="M11.5 1C8.5 1 8 2.5 8 4v3h4v.5H6c-1.5 0-3 1-3 3.5s1.5 3.5 3 3.5h2V12c0-1.5 1.5-3 3-3h4c1.5 0 3-1.5 3-3V4c0-1.5-.5-3-3.5-3h-1z" fill="url(#pythonBlue)"/>
    <path d="M12.5 23C15.5 23 16 21.5 16 20v-3h-4v-.5h6c1.5 0 3-1 3-3.5s-1.5-3.5-3-3.5h-2V12c0 1.5-1.5 3-3 3H9c-1.5 0-3 1.5-3 3v2c0 1.5.5 3 3.5 3h3z" fill="url(#pythonYellow)"/>
    <circle cx="10" cy="5" r="1" fill="white"/>
    <circle cx="14" cy="19" r="1" fill="white"/>
  </svg>
);

export const PHPIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="#777BB4" className={className}>
    <ellipse cx="12" cy="12" rx="11" ry="7" fill="#777BB4"/>
    <path d="M3 10h2c1 0 1.5.5 1.5 1.5S6 13 5 13H4v2H3v-5zm1 1v1h1c.5 0 .5-.5.5-.5s0-.5-.5-.5H4zM8 10h2c1 0 1.5.5 1.5 1.5V12c0 .5-.5 1-1 1H9v2H8v-5zm1 1v1h1c.5 0 .5-.5.5-.5V11.5c0-.5-.5-.5-.5-.5H9zM14 10h2c1 0 1.5.5 1.5 1.5S17 13 16 13h-1v2h-1v-5zm1 1v1h1c.5 0 .5-.5.5-.5s0-.5-.5-.5h-1z" fill="white"/>
  </svg>
);

export const JavaIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M8.5 18s-.5 1 1.5 1c2 0 3-.5 5.5-.5 0 0 .5.5-.5 1-2 1-7 1-8.5-1 0 0-.5-1 2-1zm1-3s-.5 1 1.5 1c2.5 0 4.5-.5 6-.5 0 0 .5.5-1 1-2.5.5-6.5.5-8-1 0 0-1-1 1.5-1zm4.5-3c1.5 1 0 2-1 2h-1.5c-2 0-2.5-1-1-1.5 1.5-.5 3.5-.5 3.5-.5zM12 7s1-1 0-2c-1.5-1.5-3.5-1-3.5 1 0 1.5 1 1.5 2 1.5S12 7 12 7z" fill="#ED8B00"/>
    <path d="M15 14c.5-1 1.5-1.5 1.5-2.5 0-1.5-1.5-2-3-1.5-.5.5-.5 1 0 1.5.5.5 1 .5 1.5 1s.5 1 0 1.5z" fill="#ED8B00"/>
  </svg>
);

export const CSharpIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="#239120" className={className}>
    <rect width="24" height="24" fill="#239120" rx="4"/>
    <path d="M9 8c-1.5 0-2.5 1-2.5 2.5v3c0 1.5 1 2.5 2.5 2.5s2.5-1 2.5-2.5v-.5H10v.5c0 .5-.5 1-1 1s-1-.5-1-1v-3c0-.5.5-1 1-1s1 .5 1 1v.5h1.5v-.5c0-1.5-1-2.5-2.5-2.5zm4.5 2v1h1v1h-1v1h1v1h1v-1h1v1h1v-1h-1v-1h1v-1h-1V9h-1v1h-1zm1 1h1v1h-1v-1z" fill="white"/>
  </svg>
);

export const RubyIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M20.16 12.594l-8.558 8.748a.5.5 0 01-.748-.062L2.806 11.35a.5.5 0 01.062-.748l8.558-8.748a.5.5 0 01.748.062l8.048 9.93a.5.5 0 01-.062.748z" fill="#CC342D"/>
    <path d="M12 12l8-8-8 8zm0 0l-8 8 8-8z" fill="#9B1B1B" opacity="0.3"/>
  </svg>
);

export const GoIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#00ADD8"/>
    <path d="M8 10h8v1H8v-1zm0 2h6v1H8v-1zm0 2h4v1H8v-1z" fill="white"/>
  </svg>
);

export const SwiftIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="#FA7343" className={className}>
    <path d="M22 12c0 5.5-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2s10 4.5 10 10z"/>
    <path d="M16 8c-1 1-3 3-5 3s-3-1-3-3c0-1 1-2 2-2 2 0 4 1 6 2zm-4 8c2-1 4-3 4-5s-1-3-2-3c-2 0-4 2-6 4s-2 3-2 4c0 2 2 3 4 2s4-1 4-1-2-1-2-1z" fill="white"/>
  </svg>
);

export const KotlinIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="kotlinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E44857"/>
        <stop offset="25%" stopColor="#C711E1"/>
        <stop offset="50%" stopColor="#7F52FF"/>
        <stop offset="75%" stopColor="#2196F3"/>
        <stop offset="100%" stopColor="#0D7377"/>
      </linearGradient>
    </defs>
    <path d="M2 2h10L2 12V2zm0 10l10 10H2V12zm10-10h10L12 12l10 10H12L2 12 12 2z" fill="url(#kotlinGradient)"/>
  </svg>
);

export const CIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="#A8B9CC" className={className}>
    <rect width="24" height="24" fill="#A8B9CC" rx="4"/>
    <path d="M12 8c-2 0-3.5 1.5-3.5 3.5v1c0 2 1.5 3.5 3.5 3.5s3.5-1.5 3.5-3.5v-.5H14v.5c0 1-.5 1.5-1.5 1.5S11 13 11 12.5v-1c0-1 .5-1.5 1.5-1.5S14 11 14 12v.5h1.5v-.5c0-2-1.5-3.5-3.5-3.5z" fill="white"/>
  </svg>
);

export const CppIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="#00599C" className={className}>
    <rect width="24" height="24" fill="#00599C" rx="4"/>
    <path d="M7 8c-1.5 0-2.5 1-2.5 2.5v3c0 1.5 1 2.5 2.5 2.5s2.5-1 2.5-2.5v-.5H8v.5c0 .5-.5 1-1 1s-1-.5-1-1v-3c0-.5.5-1 1-1s1 .5 1 1v.5h1.5v-.5c0-1.5-1-2.5-2.5-2.5zm5 2v1h1v1h-1v1h1v1h1v-1h.5v1h1v-1H16v-1h-1v-1h1v-1h-1v-1h-.5v1H14v1h-1zm1 1h.5v1H13v-1zm2.5-1v1h.5v1h-.5v1h.5v1h1v-1H18v-1h-1v-1h1v-1h-1v-1h-.5v1z" fill="white"/>
  </svg>
);

// Default icon for unknown languages
export const DefaultIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="#6B7280" className={className}>
    <rect width="24" height="24" fill="#6B7280" rx="4"/>
    <path d="M8 8h8v1H8V8zm0 3h6v1H8v-1zm0 3h4v1H8v-1z" fill="white"/>
  </svg>
);
