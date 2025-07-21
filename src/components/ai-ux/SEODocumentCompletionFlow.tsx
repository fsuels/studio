'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2,
  Download,
  Share2,
  Star,
  FileText,
  Mail,
  Printer,
  Shield,
  Clock,
  TrendingUp,
  Users,
  Search,
  Sparkles,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { SmartDocumentRecommendations } from './SmartDocumentRecommendations';

interface CompletedDocument {
  id: string;
  name: string;
  category: string;
  completedAt: string;
  downloadUrl: string;
  shareUrl: string;
  state: string;
  documentData: any;
}

interface SEODocumentCompletionFlowProps {
  document: CompletedDocument;
  onAction?: (action: string, data?: any) => void;
  className?: string;
}

export function SEODocumentCompletionFlow({
  document,
  onAction,
  className = '',
}: SEODocumentCompletionFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [showNextSteps, setShowNextSteps] = useState(false);

  const steps = [
    { id: 'completion', title: 'Document Generated', completed: true },
    { id: 'download', title: 'Download & Review', completed: false },
    { id: 'feedback', title: 'Share Feedback', completed: false },
    { id: 'next-steps', title: "What's Next?", completed: false },
  ];

  useEffect(() => {
    // Auto-advance through steps for better UX and SEO engagement
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        steps[currentStep + 1].completed = true;
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleDownload = (format: 'pdf' | 'docx') => {
    onAction?.('download', { format, documentId: document.id });

    // Track for SEO and analytics
    if (typeof window !== 'undefined') {
      // Analytics tracking would go here
      console.log(`Downloaded ${document.name} as ${format.toUpperCase()}`);
    }
  };

  const handleShare = (method: 'email' | 'link') => {
    onAction?.('share', { method, documentId: document.id });

    if (method === 'email') {
      const subject = `My ${document.name} from 123LegalDoc`;
      const body = `I've just created a ${document.name} using 123LegalDoc. Check it out: ${document.shareUrl}`;
      window.open(
        `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      );
    } else {
      navigator.clipboard.writeText(document.shareUrl);
    }
  };

  const submitReview = () => {
    if (userRating > 0) {
      onAction?.('review', {
        rating: userRating,
        text: reviewText,
        documentId: document.id,
      });
      setShowNextSteps(true);
    }
  };

  const renderStarRating = (interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-6 w-6 cursor-pointer transition-colors ${
          i < userRating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300 hover:text-yellow-300'
        }`}
        onClick={interactive ? () => setUserRating(i + 1) : undefined}
      />
    ));
  };

  const getNextStepRecommendations = () => {
    const recommendations = [];

    if (document.category === 'Business') {
      recommendations.push({
        title: 'Set up business banking',
        description:
          'Open a business bank account to separate personal and business finances',
        urgency: 'high',
        timeframe: 'Within 1 week',
      });

      recommendations.push({
        title: 'Register for business licenses',
        description: 'Check what licenses your business needs in your state',
        urgency: 'medium',
        timeframe: 'Within 30 days',
      });
    }

    if (document.category === 'Employment') {
      recommendations.push({
        title: 'Employee handbook creation',
        description: 'Develop comprehensive employee policies and procedures',
        urgency: 'medium',
        timeframe: 'Within 2 weeks',
      });
    }

    if (document.category === 'Real Estate') {
      recommendations.push({
        title: 'Property insurance review',
        description: 'Ensure adequate coverage for your property',
        urgency: 'high',
        timeframe: 'Before move-in',
      });
    }

    return recommendations;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Success Header with SEO-Rich Content */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 rounded-lg text-center">
        <CheckCircle2 className="h-16 w-16 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">
          Your {document.name} is Ready!
        </h1>
        <p className="text-green-100 text-lg">
          Legally compliant document created for {document.state} in just
          minutes
        </p>

        {/* SEO-Rich Metadata Display */}
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Generated in under 10 minutes</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            <span>Legally compliant for {document.state}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Used by 10,000+ customers</span>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Completion Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress
              value={((currentStep + 1) / steps.length) * 100}
              className="h-2"
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-3 rounded-lg border text-center ${
                    index <= currentStep
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  {index <= currentStep && (
                    <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto mb-2" />
                  )}
                  <p className="text-sm font-medium">{step.title}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Download Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Download Your Document
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Button
              size="lg"
              className="h-16 bg-red-600 hover:bg-red-700"
              onClick={() => handleDownload('pdf')}
            >
              <FileText className="h-6 w-6 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Download PDF</div>
                <div className="text-sm opacity-90">
                  Perfect for printing & sharing
                </div>
              </div>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-16"
              onClick={() => handleDownload('docx')}
            >
              <FileText className="h-6 w-6 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Download Word</div>
                <div className="text-sm text-gray-600">For further editing</div>
              </div>
            </Button>
          </div>

          <div className="flex gap-4 mt-4">
            <Button variant="outline" onClick={() => handleShare('email')}>
              <Mail className="h-4 w-4 mr-2" />
              Email Document
            </Button>
            <Button variant="outline" onClick={() => handleShare('link')}>
              <Share2 className="h-4 w-4 mr-2" />
              Share Link
            </Button>
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Review & Feedback Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Help Others Find Great Legal Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-gray-600 mb-3">
              How was your experience creating this {document.name}?
            </p>
            <div className="flex gap-1 mb-4">{renderStarRating(true)}</div>
          </div>

          <div>
            <Textarea
              placeholder="Share your experience to help other users (optional)"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <Button
            onClick={submitReview}
            disabled={userRating === 0}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Submit Review
          </Button>

          {userRating > 0 && (
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-purple-700 font-medium">
                🎉 Thank you for your {userRating}-star review!
              </p>
              <p className="text-purple-600 text-sm mt-1">
                Your feedback helps us improve and helps other users find
                reliable legal documents.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next Steps Recommendations */}
      {(showNextSteps || currentStep >= 3) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recommended Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getNextStepRecommendations().map((rec, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{rec.title}</h4>
                    <Badge
                      className={
                        rec.urgency === 'high'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {rec.urgency} priority
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    {rec.description}
                  </p>
                  <p className="text-sm text-purple-600 font-medium">
                    ⏰ Timeline: {rec.timeframe}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">
                Need Help with Next Steps?
              </h4>
              <p className="text-blue-700 text-sm mb-3">
                Our legal experts can guide you through the process and
                recommend additional documents.
              </p>
              <Button
                variant="outline"
                className="border-blue-300 text-blue-700"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Get Expert Guidance
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SEO-Optimized Related Documents */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Other Popular {document.category} Documents in {document.state}
        </h2>
        <SmartDocumentRecommendations
          currentDocument={document.id}
          userProfile={{ location: document.state }}
        />
      </div>

      {/* SEO Content Footer */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">
              Join 50,000+ Satisfied Customers
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              123LegalDoc has helped thousands create legally compliant{' '}
              {document.category.toLowerCase()} documents. Our AI-powered
              platform ensures accuracy while saving you time and money compared
              to traditional legal services.
            </p>

            <div className="flex justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Legally Compliant</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-1">
                <Search className="h-4 w-4 text-blue-600" />
                <span>SEO Optimized</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
