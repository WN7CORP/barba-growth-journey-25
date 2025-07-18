
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductSkeletonProps {
  compact?: boolean;
}

export const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ compact = false }) => {
  return (
    <Card className="card-elegant overflow-hidden">
      {/* Image Skeleton */}
      <div className={`${compact ? 'aspect-[3/4]' : 'aspect-[3/4.2]'} bg-muted animate-shimmer`}>
        <Skeleton className="w-full h-full" />
      </div>
      
      {/* Content Skeleton */}
      <CardContent className={`p-4 space-y-3 ${compact ? '' : 'space-y-4'}`}>
        {/* Title skeleton */}
        <div className="space-y-2">
          <Skeleton className={`h-4 w-full ${compact ? '' : 'h-5'}`} />
          <Skeleton className={`h-4 w-3/4 ${compact ? '' : 'h-5'}`} />
        </div>
        
        {/* Category skeleton - only for non-compact */}
        {!compact && (
          <Skeleton className="h-3 w-1/2" />
        )}
        
        {/* Price and rating row */}
        <div className="flex items-center justify-between">
          <Skeleton className={`h-6 w-20 ${compact ? '' : 'h-7'}`} />
          <Skeleton className="h-4 w-12" />
        </div>
        
        {/* Buttons skeleton */}
        <div className="space-y-2">
          <div className={`flex gap-2 ${compact ? 'flex-col' : 'flex-row'}`}>
            <Skeleton className="flex-1 h-8" />
            {!compact && <Skeleton className="flex-1 h-8" />}
          </div>
          {compact && <Skeleton className="w-full h-8" />}
        </div>
      </CardContent>
    </Card>
  );
};
