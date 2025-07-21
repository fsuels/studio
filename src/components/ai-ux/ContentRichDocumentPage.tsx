'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Clock,
  Users,
  Star,
  CheckCircle2,
  AlertTriangle,
  Info,
  Download,
  Share2,
  Calculator,
  MapPin,
  Gavel,
  TrendingUp,
  Lightbulb,
  Shield,
} from 'lucide-react';
import { SmartDocumentRecommendations } from './SmartDocumentRecommendations';

interface DocumentMetadata {
  id: string;
  name: string;
  category: string;
  estimatedTime: string;
  complexity: 'low' | 'medium' | 'high';
  popularity: number;
  rating: number;
  reviewCount: number;
  requiresNotarization: boolean;
  states: string[] | 'all';
  lastUpdated: string;
  seoKeywords: string[];
  businessValue: string;
}

interface StateRequirement {
  state: string;
  specificRules: string[];
  fees: Array<{ type: string; amount: number }>;
  timeframes: string;
}

interface ContentRichDocumentPageProps {
  document: DocumentMetadata;
  userState?: string;
  className?: string;
}

export function ContentRichDocumentPage({
  document,
  userState = 'CA',
  className = '',
}: ContentRichDocumentPageProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Simulate state-specific requirements
  const stateRequirements: StateRequirement[] = [
    {
      state: 'CA',
      specificRules: [
        'Document must include California-specific clauses',
        'Comply with California state employment laws',
        'Include required worker protection statements',
      ],
      fees: [
        { type: 'Filing', amount: 25 },
        { type: 'Notarization', amount: 15 },
      ],
      timeframes: 'Effective immediately upon signing',
    },
    {
      state: 'TX',
      specificRules: [
        'Texas-specific legal language required',
        'Notarization mandatory for certain sections',
        'Comply with Texas Business Organizations Code',
      ],
      fees: [
        { type: 'Filing', amount: 30 },
        { type: 'Notarization', amount: 10 },
      ],
      timeframes: 'Effective within 10 business days',
    },
  ];

  const currentStateReq =
    stateRequirements.find((req) => req.state === userState) ||
    stateRequirements[0];


  const renderStarRating = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{document.name}</h1>
              <p className="text-purple-100 text-lg">
                Create a legally binding {document.name.toLowerCase()} in
                minutes with our AI-powered platform
              </p>
            </div>
            <Badge className="bg-white text-purple-600">
              {document.category}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{document.estimatedTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>{document.popularity}% popular</span>
            </div>
            <div className="flex items-center gap-2">
              {renderStarRating(document.rating)}
              <span>({document.reviewCount} reviews)</span>
            </div>
            {document.requiresNotarization && (
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span>Notarization Required</span>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              <FileText className="h-5 w-5 mr-2" />
              Start Document
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-purple-600"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Sample
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Document Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Document Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">

                <div className="flex justify-between">
                  <span className="text-gray-600">Valid in:</span>
                  <span>
                    {document.states === 'all'
                      ? 'All 50 states'
                      : `${document.states.length} states`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Last updated:</span>
                  <span>{document.lastUpdated}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Business value:</span>
                  <span className="text-green-600 font-medium">
                    {document.businessValue}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* What's Included */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  What's Included
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>AI-powered document generation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>State-specific legal requirements</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Instant PDF and Word downloads</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Legal compliance verification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>24/7 customer support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Key Benefits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Key Benefits & Use Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Save Time & Money</h4>
                  <p className="text-sm text-gray-600">
                    Create documents in minutes instead of hours. Save thousands
                    in legal fees.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Legal Compliance</h4>
                  <p className="text-sm text-gray-600">
                    Automatically includes all required clauses and
                    state-specific requirements.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Professional Quality</h4>
                  <p className="text-sm text-gray-600">
                    Created by legal experts and regularly updated for current
                    laws.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-6">
          {/* State-Specific Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {userState} State Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Specific Rules:</h4>
                <ul className="space-y-1">
                  {currentStateReq.specificRules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Associated Fees:</h4>
                <div className="space-y-2">
                  {currentStateReq.fees.map((fee, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded"
                    >
                      <span>{fee.type}</span>
                      <span className="font-medium">${fee.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Timeframes:</h4>
                <p className="text-sm text-gray-600">
                  {currentStateReq.timeframes}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Legal Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5" />
                Legal Compliance Checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>All required clauses included</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>State-specific language verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>Current legal standards met</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>Industry best practices followed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          {/* Pricing Calculator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Cost Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-semibold text-red-600">
                    Traditional Lawyer
                  </h4>
                  <div className="text-2xl font-bold text-red-600 mt-2">
                    $500-2000
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    + 1-2 weeks wait time
                  </p>
                </div>
                <div className="text-center p-4 border-2 border-purple-600 rounded-lg bg-purple-50">
                  <h4 className="font-semibold text-purple-600">123LegalDoc</h4>
                  <div className="text-2xl font-bold text-purple-600 mt-2">
                    $29
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Instant generation
                  </p>
                  <Badge className="mt-2 bg-purple-600">Best Value</Badge>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-semibold text-gray-600">DIY Template</h4>
                  <div className="text-2xl font-bold text-gray-600 mt-2">
                    $0-50
                  </div>
                  <p className="text-sm text-red-600 mt-1">Risk of errors</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          {/* FAQ Section */}
          {[
            {
              q: `Is this ${document.name} legally binding?`,
              a: `Yes, when properly completed and executed, this ${document.name} is legally binding in all applicable jurisdictions. Our documents are created by legal experts and regularly updated.`,
            },
            {
              q: 'Can I customize the document for my specific needs?',
              a: 'Absolutely! Our AI-powered platform allows for extensive customization while maintaining legal compliance. You can add specific clauses, modify terms, and tailor the document to your unique situation.',
            },
            {
              q: 'What if I need help completing the document?',
              a: 'We provide 24/7 customer support, detailed help text throughout the process, and access to legal resources. For complex situations, we can connect you with licensed attorneys.',
            },
            {
              q: 'How quickly can I get my completed document?',
              a: "Most documents can be completed in 10-30 minutes. Once finished, you'll instantly receive PDF and Word versions via email and can download them immediately.",
            },
          ].map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{faq.q}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          {/* Customer Reviews */}
          {[
            {
              name: 'Sarah M.',
              rating: 5,
              review:
                'Incredibly easy to use and saved me hundreds in legal fees. The document was professional and comprehensive.',
              date: '2024-01-10',
            },
            {
              name: 'Michael R.',
              rating: 5,
              review:
                'The state-specific requirements feature is amazing. Knew exactly what I needed for Texas law compliance.',
              date: '2024-01-05',
            },
            {
              name: 'Jennifer L.',
              rating: 4,
              review:
                'Great platform overall. Customer support was very helpful when I had questions about specific clauses.',
              date: '2023-12-28',
            },
          ].map((review, index) => (
            <Card key={index}>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{review.name}</h4>
                    <div className="flex gap-1">
                      {renderStarRating(review.rating)}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <p className="text-gray-600">{review.review}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Related Documents */}
      <SmartDocumentRecommendations
        currentDocument={document.id}
        className="mt-8"
      />
    </div>
  );
}
