import React from 'react';

type IconName = 'home' | 'closet' | 'mirror' | 'upload' | 'back' | 'plus' | 'trash' | 'check' | 'save' | 'shirt' | 'pants' | 'shoe' | 'diamond';

interface IconProps {
  name: IconName;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, className = 'w-6 h-6' }) => {
  // Fix: Changed JSX.Element to React.ReactNode to resolve namespace issue.
  const icons: Record<IconName, React.ReactNode> = {
    home: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    closet: <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM8 2v4m8-4v4" />,
    mirror: <path strokeLinecap="round" strokeLinejoin="round" d="M5.071 5.071a7 7 0 009.858 9.858M12 21a9 9 0 100-18 9 9 0 000 18z" />,
    upload: <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />,
    back: <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />,
    plus: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />,
    trash: <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />,
    save: <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />,
    shirt: <path strokeLinecap="round" strokeLinejoin="round" d="M13 17l6 0M21 17l-6 0M17.5 17c0 1.65-1.35 3-3 3h-5c-1.65 0-3-1.35-3-3v-10.5c0-.825.675-1.5 1.5-1.5h11c.825 0 1.5.675 1.5 1.5v10.5M17.5 17h-11M17.5 17c-1.125-3.375-3.3-6-5.5-6s-4.375 2.625-5.5 6" />,
    pants: <path strokeLinecap="round" strokeLinejoin="round" d="M6 21l2-10h8l2 10M8.5 11l-1-7h10l-1 7" />,
    shoe: <path strokeLinecap="round" strokeLinejoin="round" d="M3.465 14.535c-1.333-1.333-1.333-3.547 0-4.88l5.657-5.657c.105-.105.21-.21.315-.315C10.5 3.105 11.235 3 12 3c1.333 0 2 .5 3 1.5.5.5 1 1.5 1.5 1.5s1-.833 1.5-1.5c1-1 1.667-1.5 3-1.5.765 0 1.5.105 2.06.685.105.105.21.21.315.315l5.657 5.657c1.333 1.333 1.333 3.547 0 4.88l-5.657 5.657c-.105.105-.21.21-.315.315-.56.58-1.295.68-2.06.68-1.333 0-2-.5-3-1.5-.5-.5-1-1.5-1.5-1.5s-1 .833-1.5 1.5c-1 1-1.667 1.5-3 1.5-.765 0-1.5-.1-2.06-.68-.105-.105-.21-.21-.315-.315L3.465 14.535z" />,
    diamond: <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 15 10-15-10-5zM2 7l10 5 10-5M12 2v20" />,
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      {icons[name]}
    </svg>
  );
};

export default Icon;