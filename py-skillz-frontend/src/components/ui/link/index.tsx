import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface CustomLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Link({ to, children, className, onClick }: CustomLinkProps) {
  const navigate = useNavigate();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) onClick();
    navigate(to);
  };

  return (
    <a 
      href={to} 
      className={className} 
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
