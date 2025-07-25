// src/lib/documents/us/gaming-agreement/questions.ts
import type { FormQuestion } from '@/types/documents';

export const gamingAgreementQuestions: FormQuestion[] = [
  {
    id: 'organizationName',
    type: 'text',
    label: 'Organization/Team Name',
    placeholder: 'Enter organization or team name',
    required: true,
    group: 'organization',
  },
  {
    id: 'organizationAddress',
    type: 'text',
    label: 'Organization Address',
    placeholder: 'Enter organization address',
    required: false,
    group: 'organization',
  },
  {
    id: 'organizationEmail',
    type: 'email',
    label: 'Organization Email',
    placeholder: 'Enter organization email',
    required: false,
    group: 'organization',
  },
  {
    id: 'teamName',
    type: 'text',
    label: 'Team Name',
    placeholder: 'Enter team name (if applicable)',
    required: false,
    group: 'organization',
  },
  {
    id: 'playerName',
    type: 'text',
    label: 'Player Name',
    placeholder: 'Enter player full name',
    required: true,
    group: 'player',
  },
  {
    id: 'playerGamertag',
    type: 'text',
    label: 'Player Gamertag/Username',
    placeholder: 'Enter player gamertag or username',
    required: false,
    group: 'player',
  },
  {
    id: 'playerEmail',
    type: 'email',
    label: 'Player Email',
    placeholder: 'Enter player email address',
    required: false,
    group: 'player',
  },
  {
    id: 'playerAge',
    type: 'text',
    label: 'Player Age',
    placeholder: 'Enter player age',
    required: false,
    group: 'player',
  },
  {
    id: 'isMinor',
    type: 'boolean',
    label: 'Is the player a minor?',
    required: false,
    group: 'player',
  },
  {
    id: 'guardianName',
    type: 'text',
    label: 'Guardian Name',
    placeholder: 'Enter guardian name (if player is minor)',
    required: false,
    group: 'guardian',
    conditional: { field: 'isMinor', value: true },
  },
  {
    id: 'guardianRelationship',
    type: 'text',
    label: 'Guardian Relationship',
    placeholder: 'Enter relationship to player',
    required: false,
    group: 'guardian',
    conditional: { field: 'isMinor', value: true },
  },
  {
    id: 'gameTitle',
    type: 'text',
    label: 'Game Title',
    placeholder: 'Enter the game title',
    required: true,
    group: 'game',
  },
  {
    id: 'gameGenre',
    type: 'text',
    label: 'Game Genre',
    placeholder: 'Enter game genre (e.g., MOBA, FPS, etc.)',
    required: false,
    group: 'game',
  },
  {
    id: 'competitionLevel',
    type: 'select',
    label: 'Competition Level',
    options: [
      { value: 'amateur', label: 'Amateur' },
      { value: 'semi-professional', label: 'Semi-Professional' },
      { value: 'professional', label: 'Professional' },
    ],
    required: false,
    group: 'game',
  },
  {
    id: 'platform',
    type: 'select',
    label: 'Gaming Platform',
    options: [
      { value: 'pc', label: 'PC' },
      { value: 'console', label: 'Console' },
      { value: 'mobile', label: 'Mobile' },
      { value: 'multiple', label: 'Multiple Platforms' },
    ],
    required: false,
    group: 'game',
  },
  {
    id: 'agreementType',
    type: 'select',
    label: 'Agreement Type',
    options: [
      { value: 'player-contract', label: 'Player Contract' },
      { value: 'tournament', label: 'Tournament Agreement' },
      { value: 'sponsorship', label: 'Sponsorship Agreement' },
      { value: 'coaching', label: 'Coaching Agreement' },
      { value: 'streaming', label: 'Streaming Agreement' },
    ],
    required: false,
    group: 'terms',
  },
  {
    id: 'serviceDescription',
    type: 'textarea',
    label: 'Service Description',
    placeholder: 'Describe the services to be provided',
    required: false,
    group: 'terms',
  },
  {
    id: 'contractStartDate',
    type: 'date',
    label: 'Contract Start Date',
    required: false,
    group: 'duration',
  },
  {
    id: 'contractEndDate',
    type: 'date',
    label: 'Contract End Date',
    required: false,
    group: 'duration',
  },
  {
    id: 'contractDuration',
    type: 'text',
    label: 'Contract Duration',
    placeholder: 'Enter contract duration (e.g., 1 year)',
    required: false,
    group: 'duration',
  },
  {
    id: 'renewalOptions',
    type: 'boolean',
    label: 'Include renewal options?',
    required: false,
    group: 'duration',
  },
  {
    id: 'practiceSchedule',
    type: 'textarea',
    label: 'Practice Schedule',
    placeholder: 'Describe practice schedule requirements',
    required: false,
    group: 'training',
  },
  {
    id: 'trainingHours',
    type: 'text',
    label: 'Training Hours Per Week',
    placeholder: 'Enter required training hours',
    required: false,
    group: 'training',
  },
  {
    id: 'tournamentParticipation',
    type: 'boolean',
    label: 'Tournament participation required?',
    required: false,
    group: 'competition',
  },
  {
    id: 'competitionSchedule',
    type: 'textarea',
    label: 'Competition Schedule',
    placeholder: 'Describe competition schedule',
    required: false,
    group: 'competition',
  },
  {
    id: 'travelRequirements',
    type: 'boolean',
    label: 'Travel required for competitions?',
    required: false,
    group: 'competition',
  },
  {
    id: 'compensationType',
    type: 'select',
    label: 'Compensation Type',
    options: [
      { value: 'salary', label: 'Salary' },
      { value: 'prize-share', label: 'Prize Share' },
      { value: 'hourly', label: 'Hourly' },
      { value: 'tournament-winnings', label: 'Tournament Winnings' },
      { value: 'sponsorship', label: 'Sponsorship' },
    ],
    required: false,
    group: 'financial',
  },
  {
    id: 'baseSalary',
    type: 'text',
    label: 'Base Salary',
    placeholder: 'Enter base salary amount',
    required: false,
    group: 'financial',
  },
  {
    id: 'prizeSharePercentage',
    type: 'text',
    label: 'Prize Share Percentage',
    placeholder: 'Enter percentage (e.g., 60%)',
    required: false,
    group: 'financial',
  },
  {
    id: 'bonusStructure',
    type: 'textarea',
    label: 'Bonus Structure',
    placeholder: 'Describe bonus structure',
    required: false,
    group: 'financial',
  },
  {
    id: 'performanceIncentives',
    type: 'boolean',
    label: 'Include performance incentives?',
    required: false,
    group: 'financial',
  },
  {
    id: 'streamingRequirements',
    type: 'boolean',
    label: 'Streaming requirements?',
    required: false,
    group: 'streaming',
  },
  {
    id: 'streamingSchedule',
    type: 'textarea',
    label: 'Streaming Schedule',
    placeholder: 'Describe streaming schedule requirements',
    required: false,
    group: 'streaming',
  },
  {
    id: 'contentCreation',
    type: 'boolean',
    label: 'Content creation required?',
    required: false,
    group: 'streaming',
  },
  {
    id: 'platformExclusivity',
    type: 'boolean',
    label: 'Platform exclusivity required?',
    required: false,
    group: 'streaming',
  },
  {
    id: 'equipmentProvided',
    type: 'boolean',
    label: 'Equipment provided by organization?',
    required: false,
    group: 'equipment',
  },
  {
    id: 'equipmentList',
    type: 'textarea',
    label: 'Equipment List',
    placeholder: 'List equipment to be provided',
    required: false,
    group: 'equipment',
  },
  {
    id: 'internetRequirements',
    type: 'text',
    label: 'Internet Requirements',
    placeholder: 'Specify internet speed/quality requirements',
    required: false,
    group: 'equipment',
  },
  {
    id: 'performanceMetrics',
    type: 'textarea',
    label: 'Performance Metrics',
    placeholder: 'Describe performance standards',
    required: false,
    group: 'performance',
  },
  {
    id: 'rankRequirements',
    type: 'text',
    label: 'Rank Requirements',
    placeholder: 'Specify minimum rank requirements',
    required: false,
    group: 'performance',
  },
  {
    id: 'sponsorshipRights',
    type: 'boolean',
    label: 'Sponsorship rights included?',
    required: false,
    group: 'branding',
  },
  {
    id: 'brandingRequirements',
    type: 'textarea',
    label: 'Branding Requirements',
    placeholder: 'Describe branding obligations',
    required: false,
    group: 'branding',
  },
  {
    id: 'merchandisingRights',
    type: 'boolean',
    label: 'Merchandising rights?',
    required: false,
    group: 'branding',
  },
  {
    id: 'teamExclusivity',
    type: 'boolean',
    label: 'Team exclusivity required?',
    required: false,
    group: 'exclusivity',
  },
  {
    id: 'competitorRestrictions',
    type: 'boolean',
    label: 'Competitor restrictions?',
    required: false,
    group: 'exclusivity',
  },
  {
    id: 'nonCompeteClause',
    type: 'boolean',
    label: 'Non-compete clause?',
    required: false,
    group: 'exclusivity',
  },
  {
    id: 'exclusivityPeriod',
    type: 'text',
    label: 'Exclusivity Period',
    placeholder: 'Enter exclusivity period',
    required: false,
    group: 'exclusivity',
  },
  {
    id: 'gamingHealthGuidelines',
    type: 'textarea',
    label: 'Gaming Health Guidelines',
    placeholder: 'Describe health and safety guidelines',
    required: false,
    group: 'health',
  },
  {
    id: 'breakRequirements',
    type: 'text',
    label: 'Break Requirements',
    placeholder: 'Specify break requirements',
    required: false,
    group: 'health',
  },
  {
    id: 'mentalHealthSupport',
    type: 'boolean',
    label: 'Mental health support provided?',
    required: false,
    group: 'health',
  },
  {
    id: 'travelExpenses',
    type: 'boolean',
    label: 'Travel expenses covered?',
    required: false,
    group: 'travel',
  },
  {
    id: 'accommodationProvided',
    type: 'boolean',
    label: 'Accommodation provided?',
    required: false,
    group: 'travel',
  },
  {
    id: 'internationalTravel',
    type: 'boolean',
    label: 'International travel required?',
    required: false,
    group: 'travel',
  },
  {
    id: 'conductStandards',
    type: 'textarea',
    label: 'Code of Conduct',
    placeholder: 'Describe conduct standards',
    required: false,
    group: 'conduct',
  },
  {
    id: 'sportsmanship',
    type: 'boolean',
    label: 'Sportsmanship requirements?',
    required: false,
    group: 'conduct',
  },
  {
    id: 'antiCheatPolicy',
    type: 'boolean',
    label: 'Anti-cheat policy?',
    required: false,
    group: 'conduct',
  },
  {
    id: 'mediaObligations',
    type: 'textarea',
    label: 'Media Obligations',
    placeholder: 'Describe media obligations',
    required: false,
    group: 'media',
  },
  {
    id: 'interviewRequirements',
    type: 'boolean',
    label: 'Interview requirements?',
    required: false,
    group: 'media',
  },
  {
    id: 'socialMediaPolicy',
    type: 'textarea',
    label: 'Social Media Policy',
    placeholder: 'Describe social media guidelines',
    required: false,
    group: 'media',
  },
  {
    id: 'terminationConditions',
    type: 'textarea',
    label: 'Termination Conditions',
    placeholder: 'Describe termination conditions',
    required: false,
    group: 'termination',
  },
  {
    id: 'terminationNotice',
    type: 'text',
    label: 'Termination Notice Period',
    placeholder: 'Enter notice period (e.g., 30 days)',
    required: false,
    group: 'termination',
  },
  {
    id: 'transferRights',
    type: 'boolean',
    label: 'Transfer rights?',
    required: false,
    group: 'termination',
  },
  {
    id: 'governingLaw',
    type: 'text',
    label: 'Governing Law',
    placeholder: 'Enter governing law/jurisdiction',
    required: false,
    group: 'legal',
  },
  {
    id: 'disputeResolution',
    type: 'select',
    label: 'Dispute Resolution Method',
    options: [
      { value: 'mediation', label: 'Mediation' },
      { value: 'arbitration', label: 'Arbitration' },
      { value: 'court', label: 'Court' },
    ],
    required: false,
    group: 'legal',
  },
  {
    id: 'requireOrganizationSignature',
    type: 'boolean',
    label: 'Require organization signature?',
    required: false,
    group: 'signatures',
  },
  {
    id: 'requirePlayerSignature',
    type: 'boolean',
    label: 'Require player signature?',
    required: false,
    group: 'signatures',
  },
  {
    id: 'requireGuardianSignature',
    type: 'boolean',
    label: 'Require guardian signature?',
    required: false,
    group: 'signatures',
  },
  {
    id: 'notarizationRequired',
    type: 'boolean',
    label: 'Notarization required?',
    required: false,
    group: 'signatures',
  },
];
