import React from 'react';

const Skeleton = ({ className='' }) => (
  <div className={`animate-pulse rounded-md bg-gray-200 ${className}`}></div>
);

export const SkeletonText = ({ lines=3 }) => (
  <div className="space-y-2">
    {Array.from({length: lines}).map((_,i)=>(
      <Skeleton key={i} className={`h-3 ${i===lines-1?'w-1/2':'w-full'}`} />
    ))}
  </div>
);

export default Skeleton;
