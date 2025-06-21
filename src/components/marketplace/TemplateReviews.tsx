// src/components/marketplace/TemplateReviews.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown,
  Flag,
  Filter,
  MessageSquare,
  Shield,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { TemplateReview } from '@/types/marketplace';

interface TemplateReviewsProps {
  templateId: string;
}

interface ReviewItemProps {
  review: TemplateReview;
  onHelpful: (reviewId: string) => void;
  onNotHelpful: (reviewId: string) => void;
  onFlag: (reviewId: string) => void;
}

function ReviewItem({ review, onHelpful, onNotHelpful, onFlag }: ReviewItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (date: any) => {
    return new Date(date.toDate ? date.toDate() : date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleHelpful = () => {
    if (!hasVoted) {
      onHelpful(review.id);
      setHasVoted(true);
    }
  };

  const handleNotHelpful = () => {
    if (!hasVoted) {
      onNotHelpful(review.id);
      setHasVoted(true);
    }
  };

  const shouldShowExpandButton = review.comment && review.comment.length > 200;

  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        {/* Review Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {review.reviewerName?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  {review.reviewerName || 'Anonymous User'}
                </span>
                {review.verified && (
                  <Badge variant="secondary" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified Purchase
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                <div className="flex">
                  {renderStars(review.rating)}
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatDate(review.createdAt)}
                </span>
                <Badge variant="outline" className="text-xs">
                  v{review.templateVersion}
                </Badge>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFlag(review.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Flag className="h-4 w-4" />
          </Button>
        </div>

        {/* Review Title */}
        {review.title && (
          <h4 className="font-semibold mb-2">{review.title}</h4>
        )}

        {/* Review Content */}
        {review.comment && (
          <div className="mb-4">
            <p className={`text-sm ${!isExpanded && shouldShowExpandButton ? 'line-clamp-3' : ''}`}>
              {review.comment}
            </p>
            
            {shouldShowExpandButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 p-0 h-auto text-primary"
              >
                {isExpanded ? (
                  <>Show less <ChevronUp className="h-4 w-4 ml-1" /></>
                ) : (
                  <>Show more <ChevronDown className="h-4 w-4 ml-1" /></>
                )}
              </Button>
            )}
          </div>
        )}

        {/* Pros and Cons */}
        {(review.pros || review.cons) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {review.pros && review.pros.length > 0 && (
              <div>
                <h5 className="text-sm font-semibold text-green-700 mb-2">Pros:</h5>
                <ul className="text-sm space-y-1">
                  {review.pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <span className="text-green-500 mt-0.5">+</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {review.cons && review.cons.length > 0 && (
              <div>
                <h5 className="text-sm font-semibold text-red-700 mb-2">Cons:</h5>
                <ul className="text-sm space-y-1">
                  {review.cons.map((con, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <span className="text-red-500 mt-0.5">-</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Review Actions */}
        <div className="flex items-center gap-4 pt-4 border-t">
          <span className="text-sm text-muted-foreground">Was this helpful?</span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHelpful}
            disabled={hasVoted}
            className="gap-1"
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{review.helpful}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNotHelpful}
            disabled={hasVoted}
            className="gap-1"
          >
            <ThumbsDown className="h-4 w-4" />
            <span>{review.notHelpful}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function TemplateReviews({ templateId }: TemplateReviewsProps) {
  const [reviews, setReviews] = useState<TemplateReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [showWriteReview, setShowWriteReview] = useState(false);

  // New review form state
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    pros: [] as string[],
    cons: [] as string[],
  });

  useEffect(() => {
    loadReviews();
  }, [templateId, sortBy, filterRating, showVerifiedOnly]);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        sortBy,
        ...(filterRating !== 'all' && { rating: filterRating }),
        ...(showVerifiedOnly && { verified: 'true' }),
      });

      const response = await fetch(`/api/marketplace/templates/${templateId}/reviews?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.data.reviews);
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHelpful = async (reviewId: string) => {
    // TODO: Implement helpful vote
    console.log('Mark helpful:', reviewId);
  };

  const handleNotHelpful = async (reviewId: string) => {
    // TODO: Implement not helpful vote
    console.log('Mark not helpful:', reviewId);
  };

  const handleFlag = async (reviewId: string) => {
    // TODO: Implement flag review
    console.log('Flag review:', reviewId);
  };

  const handleSubmitReview = async () => {
    try {
      const response = await fetch(`/api/marketplace/templates/${templateId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReview),
      });

      const data = await response.json();
      
      if (data.success) {
        setShowWriteReview(false);
        setNewReview({
          rating: 5,
          title: '',
          comment: '',
          pros: [],
          cons: [],
        });
        loadReviews(); // Reload reviews
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const renderStars = (rating: number, onChange?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-6 w-6 cursor-pointer transition-colors ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
        }`}
        onClick={() => onChange?.(i + 1)}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Reviews</h2>
          <p className="text-muted-foreground">
            {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setShowWriteReview(true)}
            className="gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Write Review
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filter:</span>
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="rating-high">Highest Rating</SelectItem>
            <SelectItem value="rating-low">Lowest Rating</SelectItem>
            <SelectItem value="helpful">Most Helpful</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterRating} onValueChange={setFilterRating}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant={showVerifiedOnly ? "default" : "outline"}
          size="sm"
          onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
          className="gap-1"
        >
          <Shield className="h-4 w-4" />
          Verified Only
        </Button>
      </div>

      {/* Write Review Modal/Form */}
      {showWriteReview && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Rating */}
            <div>
              <label className="text-sm font-medium mb-2 block">Overall Rating</label>
              <div className="flex">
                {renderStars(newReview.rating, (rating) => 
                  setNewReview(prev => ({ ...prev, rating }))
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-sm font-medium mb-2 block">Review Title (Optional)</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Summarize your experience..."
                value={newReview.title}
                onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            {/* Comment */}
            <div>
              <label className="text-sm font-medium mb-2 block">Your Review</label>
              <Textarea
                placeholder="Share your experience with this template..."
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                rows={4}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowWriteReview(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmitReview}>
                Submit Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-muted rounded-full" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted rounded w-32" />
                      <div className="h-3 bg-muted rounded w-24" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to review this template and help others make informed decisions.
              </p>
              <Button onClick={() => setShowWriteReview(true)}>
                Write the First Review
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div>
            {reviews.map((review) => (
              <ReviewItem
                key={review.id}
                review={review}
                onHelpful={handleHelpful}
                onNotHelpful={handleNotHelpful}
                onFlag={handleFlag}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}