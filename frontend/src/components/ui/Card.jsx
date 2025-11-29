import React from 'react';

const base = 'bg-white rounded-xl shadow-sm border border-gray-200';

const Card = ({children, className='', padding='p-6'}) => (
  <div className={`${base} ${padding} ${className}`}>{children}</div>
);

export const CardHeader = ({title, icon, actions}) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center space-x-2">
      {icon && <span className="text-blue-600">{icon}</span>}
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
    </div>
    {actions && <div className="flex items-center space-x-2">{actions}</div>}
  </div>
);

export const CardBody = ({children, className=''}) => (
  <div className={className}>{children}</div>
);

export default Card;
