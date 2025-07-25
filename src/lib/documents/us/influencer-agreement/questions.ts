// src/lib/documents/us/influencer-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const influencerAgreementQuestions: FormQuestion[] = [
  {
    id: 'brandName',
    type: 'text',
    label: 'Brand Name',
    placeholder: 'Enter brand or company name',
    required: true,
    group: 'brand',
  },
  {
    id: 'brandCompanyName',
    type: 'text',
    label: 'Brand Company Name',
    placeholder: 'Enter legal company name if different',
    required: false,
    group: 'brand',
  },
  {
    id: 'brandAddress',
    type: 'text',
    label: 'Brand Address',
    placeholder: 'Enter complete business address',
    required: true,
    group: 'brand',
  },
  {
    id: 'brandPhone',
    type: 'text',
    label: 'Brand Phone',
    placeholder: 'Enter phone number',
    required: false,
    group: 'brand',
  },
  {
    id: 'brandEmail',
    type: 'email',
    label: 'Brand Email',
    placeholder: 'Enter email address',
    required: false,
    group: 'brand',
  },
  {
    id: 'brandWebsite',
    type: 'text',
    label: 'Brand Website',
    placeholder: 'Enter website URL',
    required: false,
    group: 'brand',
  },
  {
    id: 'brandIndustry',
    type: 'text',
    label: 'Brand Industry',
    placeholder: 'e.g., Fashion, Beauty, Technology',
    required: false,
    group: 'brand',
  },
  {
    id: 'influencerName',
    type: 'text',
    label: 'Influencer Name',
    placeholder: 'Enter influencer full name',
    required: true,
    group: 'influencer',
  },
  {
    id: 'influencerBusinessName',
    type: 'text',
    label: 'Influencer Business Name',
    placeholder: 'Enter business name if applicable',
    required: false,
    group: 'influencer',
  },
  {
    id: 'influencerAddress',
    type: 'text',
    label: 'Influencer Address',
    placeholder: 'Enter complete address',
    required: true,
    group: 'influencer',
  },
  {
    id: 'influencerPhone',
    type: 'text',
    label: 'Influencer Phone',
    placeholder: 'Enter phone number',
    required: false,
    group: 'influencer',
  },
  {
    id: 'influencerEmail',
    type: 'email',
    label: 'Influencer Email',
    placeholder: 'Enter email address',
    required: false,
    group: 'influencer',
  },
  {
    id: 'influencerWebsite',
    type: 'text',
    label: 'Influencer Website',
    placeholder: 'Enter website URL',
    required: false,
    group: 'influencer',
  },
  {
    id: 'socialMediaHandle',
    type: 'text',
    label: 'Primary Social Media Handle',
    placeholder: 'e.g., @username',
    required: false,
    group: 'influencer',
  },
  {
    id: 'campaignName',
    type: 'text',
    label: 'Campaign Name',
    placeholder: 'Enter campaign title',
    required: true,
    group: 'campaign',
  },
  {
    id: 'campaignDescription',
    type: 'textarea',
    label: 'Campaign Description',
    placeholder: 'Describe the campaign goals and requirements',
    required: true,
    group: 'campaign',
  },
  {
    id: 'campaignObjectives',
    type: 'textarea',
    label: 'Campaign Objectives',
    placeholder: 'Specific goals and expected outcomes',
    required: false,
    group: 'campaign',
  },
  {
    id: 'targetAudience',
    type: 'text',
    label: 'Target Audience',
    placeholder: 'Describe target demographic',
    required: false,
    group: 'campaign',
  },
  {
    id: 'campaignHashtags',
    type: 'text',
    label: 'Campaign Hashtags',
    placeholder: 'Required hashtags for the campaign',
    required: false,
    group: 'campaign',
  },
  {
    id: 'brandMentions',
    type: 'text',
    label: 'Brand Mentions',
    placeholder: 'Required brand mentions',
    required: false,
    group: 'campaign',
  },
  {
    id: 'platforms',
    type: 'multiselect',
    label: 'Social Media Platforms',
    options: [
      { value: 'instagram', label: 'Instagram' },
      { value: 'tiktok', label: 'TikTok' },
      { value: 'youtube', label: 'YouTube' },
      { value: 'twitter', label: 'Twitter/X' },
      { value: 'facebook', label: 'Facebook' },
      { value: 'linkedin', label: 'LinkedIn' },
      { value: 'snapchat', label: 'Snapchat' },
      { value: 'pinterest', label: 'Pinterest' },
    ],
    required: false,
    group: 'platforms',
  },
  {
    id: 'primaryPlatform',
    type: 'select',
    label: 'Primary Platform',
    options: [
      { value: 'instagram', label: 'Instagram' },
      { value: 'tiktok', label: 'TikTok' },
      { value: 'youtube', label: 'YouTube' },
      { value: 'twitter', label: 'Twitter/X' },
      { value: 'facebook', label: 'Facebook' },
    ],
    required: false,
    group: 'platforms',
  },
  {
    id: 'followerCount',
    type: 'text',
    label: 'Follower Count',
    placeholder: 'Current follower count on primary platform',
    required: false,
    group: 'platforms',
  },
  {
    id: 'engagementRate',
    type: 'text',
    label: 'Engagement Rate',
    placeholder: 'Average engagement rate percentage',
    required: false,
    group: 'platforms',
  },
  {
    id: 'audienceDemographics',
    type: 'textarea',
    label: 'Audience Demographics',
    placeholder: 'Describe audience demographics',
    required: false,
    group: 'platforms',
  },
  {
    id: 'contentType',
    type: 'multiselect',
    label: 'Content Types',
    options: [
      { value: 'posts', label: 'Feed Posts' },
      { value: 'stories', label: 'Stories' },
      { value: 'reels', label: 'Reels/Short Videos' },
      { value: 'videos', label: 'Long-form Videos' },
      { value: 'live-streams', label: 'Live Streams' },
      { value: 'blog-posts', label: 'Blog Posts' },
    ],
    required: false,
    group: 'content',
  },
  {
    id: 'numberOfPosts',
    type: 'text',
    label: 'Number of Posts',
    placeholder: 'Total number of posts required',
    required: false,
    group: 'content',
  },
  {
    id: 'postingSchedule',
    type: 'textarea',
    label: 'Posting Schedule',
    placeholder: 'When content should be posted',
    required: false,
    group: 'content',
  },
  {
    id: 'contentDeadlines',
    type: 'text',
    label: 'Content Deadlines',
    placeholder: 'Deadlines for content creation',
    required: false,
    group: 'content',
  },
  {
    id: 'contentApprovalRequired',
    type: 'checkbox',
    label: 'Content approval required before posting',
    required: false,
    group: 'content',
  },
  {
    id: 'revisionRounds',
    type: 'text',
    label: 'Revision Rounds',
    placeholder: 'Number of revision rounds included',
    required: false,
    group: 'content',
  },
  {
    id: 'imageRequirements',
    type: 'textarea',
    label: 'Image Requirements',
    placeholder: 'Specific requirements for images',
    required: false,
    group: 'content-specs',
  },
  {
    id: 'videoRequirements',
    type: 'textarea',
    label: 'Video Requirements',
    placeholder: 'Specific requirements for videos',
    required: false,
    group: 'content-specs',
  },
  {
    id: 'captionRequirements',
    type: 'textarea',
    label: 'Caption Requirements',
    placeholder: 'Guidelines for captions and copy',
    required: false,
    group: 'content-specs',
  },
  {
    id: 'hashtagRequirements',
    type: 'text',
    label: 'Hashtag Requirements',
    placeholder: 'Required hashtags and guidelines',
    required: false,
    group: 'content-specs',
  },
  {
    id: 'brandGuidelinesCompliance',
    type: 'checkbox',
    label: 'Must comply with brand guidelines',
    required: false,
    group: 'content-specs',
  },
  {
    id: 'contentQualityStandards',
    type: 'textarea',
    label: 'Content Quality Standards',
    placeholder: 'Quality standards and expectations',
    required: false,
    group: 'content-specs',
  },
  {
    id: 'instagramPosts',
    type: 'text',
    label: 'Instagram Posts',
    placeholder: 'Number of Instagram posts',
    required: false,
    group: 'deliverables',
  },
  {
    id: 'instagramStories',
    type: 'text',
    label: 'Instagram Stories',
    placeholder: 'Number of Instagram stories',
    required: false,
    group: 'deliverables',
  },
  {
    id: 'instagramReels',
    type: 'text',
    label: 'Instagram Reels',
    placeholder: 'Number of Instagram reels',
    required: false,
    group: 'deliverables',
  },
  {
    id: 'tiktokVideos',
    type: 'text',
    label: 'TikTok Videos',
    placeholder: 'Number of TikTok videos',
    required: false,
    group: 'deliverables',
  },
  {
    id: 'youtubeVideos',
    type: 'text',
    label: 'YouTube Videos',
    placeholder: 'Number of YouTube videos',
    required: false,
    group: 'deliverables',
  },
  {
    id: 'blogPosts',
    type: 'text',
    label: 'Blog Posts',
    placeholder: 'Number of blog posts',
    required: false,
    group: 'deliverables',
  },
  {
    id: 'compensationType',
    type: 'select',
    label: 'Compensation Type',
    options: [
      { value: 'flat-fee', label: 'Flat Fee' },
      { value: 'per-post', label: 'Per Post' },
      { value: 'commission', label: 'Commission Based' },
      { value: 'product-only', label: 'Product Only' },
      { value: 'hybrid', label: 'Hybrid' },
    ],
    required: true,
    group: 'compensation',
  },
  {
    id: 'totalCompensation',
    type: 'text',
    label: 'Total Compensation',
    placeholder: 'Total compensation amount',
    required: false,
    group: 'compensation',
  },
  {
    id: 'perPostRate',
    type: 'text',
    label: 'Per Post Rate',
    placeholder: 'Rate per individual post',
    required: false,
    group: 'compensation',
  },
  {
    id: 'commissionPercentage',
    type: 'text',
    label: 'Commission Percentage',
    placeholder: 'Commission percentage',
    required: false,
    group: 'compensation',
  },
  {
    id: 'bonusStructure',
    type: 'textarea',
    label: 'Bonus Structure',
    placeholder: 'Performance-based bonus structure',
    required: false,
    group: 'compensation',
  },
  {
    id: 'performanceIncentives',
    type: 'checkbox',
    label: 'Include performance incentives',
    required: false,
    group: 'compensation',
  },
  {
    id: 'paymentSchedule',
    type: 'select',
    label: 'Payment Schedule',
    options: [
      { value: 'upfront', label: 'Upfront' },
      { value: 'upon-completion', label: 'Upon Completion' },
      { value: 'milestone-based', label: 'Milestone Based' },
      { value: 'net-30', label: 'Net 30' },
    ],
    required: true,
    group: 'payment',
  },
  {
    id: 'paymentMethod',
    type: 'select',
    label: 'Payment Method',
    options: [
      { value: 'bank-transfer', label: 'Bank Transfer' },
      { value: 'paypal', label: 'PayPal' },
      { value: 'check', label: 'Check' },
      { value: 'venmo', label: 'Venmo' },
      { value: 'other', label: 'Other' },
    ],
    required: true,
    group: 'payment',
  },
  {
    id: 'paymentDeadline',
    type: 'text',
    label: 'Payment Deadline',
    placeholder: 'Payment deadline after completion',
    required: false,
    group: 'payment',
  },
  {
    id: 'latePaymentFees',
    type: 'checkbox',
    label: 'Include late payment fees',
    required: false,
    group: 'payment',
  },
  {
    id: 'expenseReimbursement',
    type: 'checkbox',
    label: 'Include expense reimbursement',
    required: false,
    group: 'payment',
  },
  {
    id: 'productProvided',
    type: 'checkbox',
    label: 'Product provided by brand',
    required: false,
    group: 'product',
  },
  {
    id: 'productValue',
    type: 'text',
    label: 'Product Value',
    placeholder: 'Estimated value of products',
    required: false,
    group: 'product',
  },
  {
    id: 'productReturnRequired',
    type: 'checkbox',
    label: 'Product return required',
    required: false,
    group: 'product',
  },
  {
    id: 'additionalProducts',
    type: 'checkbox',
    label: 'Additional products may be provided',
    required: false,
    group: 'product',
  },
  {
    id: 'productLimitations',
    type: 'textarea',
    label: 'Product Limitations',
    placeholder: 'Any limitations on product use',
    required: false,
    group: 'product',
  },
  {
    id: 'giftDisclosureRequired',
    type: 'checkbox',
    label: 'Gift disclosure required',
    required: false,
    group: 'product',
  },
  {
    id: 'contentOwnership',
    type: 'select',
    label: 'Content Ownership',
    options: [
      { value: 'influencer', label: 'Influencer Owns' },
      { value: 'brand', label: 'Brand Owns' },
      { value: 'shared', label: 'Shared Ownership' },
    ],
    required: true,
    group: 'usage-rights',
  },
  {
    id: 'usageRights',
    type: 'textarea',
    label: 'Usage Rights',
    placeholder: 'How brand can use the content',
    required: false,
    group: 'usage-rights',
  },
  {
    id: 'licenseDuration',
    type: 'text',
    label: 'License Duration',
    placeholder: 'How long brand can use content',
    required: false,
    group: 'usage-rights',
  },
  {
    id: 'repurposingRights',
    type: 'checkbox',
    label: 'Brand has repurposing rights',
    required: false,
    group: 'usage-rights',
  },
  {
    id: 'commercialUsage',
    type: 'checkbox',
    label: 'Commercial usage allowed',
    required: false,
    group: 'usage-rights',
  },
  {
    id: 'exclusiveRights',
    type: 'checkbox',
    label: 'Exclusive rights to content',
    required: false,
    group: 'usage-rights',
  },
  {
    id: 'brandVoice',
    type: 'textarea',
    label: 'Brand Voice',
    placeholder: 'Describe brand voice and tone',
    required: false,
    group: 'brand-guidelines',
  },
  {
    id: 'visualGuidelines',
    type: 'textarea',
    label: 'Visual Guidelines',
    placeholder: 'Visual style and aesthetic guidelines',
    required: false,
    group: 'brand-guidelines',
  },
  {
    id: 'messagingGuidelines',
    type: 'textarea',
    label: 'Messaging Guidelines',
    placeholder: 'Key messaging and talking points',
    required: false,
    group: 'brand-guidelines',
  },
  {
    id: 'doNotMentionList',
    type: 'textarea',
    label: 'Do Not Mention List',
    placeholder: 'Topics or brands to avoid',
    required: false,
    group: 'brand-guidelines',
  },
  {
    id: 'competitorRestrictions',
    type: 'checkbox',
    label: 'Competitor mention restrictions',
    required: false,
    group: 'brand-guidelines',
  },
  {
    id: 'approvedTerminology',
    type: 'textarea',
    label: 'Approved Terminology',
    placeholder: 'Specific terms and language to use',
    required: false,
    group: 'brand-guidelines',
  },
  {
    id: 'disclosureRequirements',
    type: 'checkbox',
    label: 'FTC disclosure requirements',
    required: false,
    group: 'ftc-compliance',
  },
  {
    id: 'sponsoredContentLabeling',
    type: 'checkbox',
    label: 'Sponsored content labeling required',
    required: false,
    group: 'ftc-compliance',
  },
  {
    id: 'ftcGuidelines',
    type: 'checkbox',
    label: 'Must follow FTC guidelines',
    required: false,
    group: 'ftc-compliance',
  },
  {
    id: 'materialConnectionDisclosure',
    type: 'checkbox',
    label: 'Material connection disclosure required',
    required: false,
    group: 'ftc-compliance',
  },
  {
    id: 'paidPartnershipLabels',
    type: 'checkbox',
    label: 'Paid partnership labels required',
    required: false,
    group: 'ftc-compliance',
  },
  {
    id: 'exclusivityScope',
    type: 'select',
    label: 'Exclusivity Scope',
    options: [
      { value: 'no-exclusivity', label: 'No Exclusivity' },
      { value: 'category-exclusive', label: 'Category Exclusive' },
      { value: 'full-exclusive', label: 'Full Exclusive' },
    ],
    required: true,
    group: 'exclusivity',
  },
  {
    id: 'exclusivityPeriod',
    type: 'text',
    label: 'Exclusivity Period',
    placeholder: 'Duration of exclusivity',
    required: false,
    group: 'exclusivity',
  },
  {
    id: 'competitorNonCompete',
    type: 'checkbox',
    label: 'Competitor non-compete clause',
    required: false,
    group: 'exclusivity',
  },
  {
    id: 'nonCompetePeriod',
    type: 'text',
    label: 'Non-Compete Period',
    placeholder: 'Duration of non-compete',
    required: false,
    group: 'exclusivity',
  },
  {
    id: 'competitorDefinition',
    type: 'textarea',
    label: 'Competitor Definition',
    placeholder: 'How competitors are defined',
    required: false,
    group: 'exclusivity',
  },
  {
    id: 'campaignStartDate',
    type: 'text',
    label: 'Campaign Start Date',
    placeholder: 'When campaign begins',
    required: false,
    group: 'timeline',
  },
  {
    id: 'campaignEndDate',
    type: 'text',
    label: 'Campaign End Date',
    placeholder: 'When campaign ends',
    required: false,
    group: 'timeline',
  },
  {
    id: 'contentCreationDeadline',
    type: 'text',
    label: 'Content Creation Deadline',
    placeholder: 'Deadline for content creation',
    required: false,
    group: 'timeline',
  },
  {
    id: 'postingDeadlines',
    type: 'textarea',
    label: 'Posting Deadlines',
    placeholder: 'Specific posting deadlines',
    required: false,
    group: 'timeline',
  },
  {
    id: 'campaignDuration',
    type: 'text',
    label: 'Campaign Duration',
    placeholder: 'Total campaign duration',
    required: false,
    group: 'timeline',
  },
  {
    id: 'disputeResolution',
    type: 'select',
    label: 'Dispute Resolution Method',
    options: [
      { value: 'negotiation', label: 'Negotiation' },
      { value: 'mediation', label: 'Mediation' },
      { value: 'arbitration', label: 'Arbitration' },
      { value: 'litigation', label: 'Court Litigation' },
    ],
    required: false,
    group: 'legal',
  },
  {
    id: 'governingLaw',
    type: 'text',
    label: 'Governing Law',
    placeholder: 'e.g., State of California',
    required: false,
    group: 'legal',
  },
  {
    id: 'jurisdiction',
    type: 'text',
    label: 'Jurisdiction',
    placeholder: 'Where disputes will be resolved',
    required: false,
    group: 'legal',
  },
  {
    id: 'attorneyFees',
    type: 'checkbox',
    label: 'Winning party recovers attorney fees',
    required: false,
    group: 'legal',
  },
  {
    id: 'requireBrandSignature',
    type: 'checkbox',
    label: 'Require brand signature',
    required: false,
    group: 'signatures',
  },
  {
    id: 'requireInfluencerSignature',
    type: 'checkbox',
    label: 'Require influencer signature',
    required: false,
    group: 'signatures',
  },
  {
    id: 'witnessRequired',
    type: 'checkbox',
    label: 'Require witness',
    required: false,
    group: 'signatures',
  },
  {
    id: 'notarizationRequired',
    type: 'checkbox',
    label: 'Require notarization',
    required: false,
    group: 'signatures',
  },
  {
    id: 'electronicSignatureAccepted',
    type: 'checkbox',
    label: 'Accept electronic signatures',
    required: false,
    group: 'signatures',
  },
];
