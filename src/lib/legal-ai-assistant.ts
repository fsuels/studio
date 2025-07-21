// Legal AI Assistant Chatbot System
// Intelligent legal guidance and document assistance

interface ChatSession {
  id: string;
  userId: string;
  startedAt: string;
  lastActivity: string;
  status: 'active' | 'completed' | 'escalated' | 'abandoned';
  language: string;
  context: {
    documentType?: string;
    jurisdiction?: string;
    businessType?: string;
    userExperience: 'beginner' | 'intermediate' | 'advanced';
  };
  messages: ChatMessage[];
  metadata: {
    totalMessages: number;
    averageResponseTime: number;
    satisfactionRating?: number;
    resolvedIssues: string[];
    escalationReason?: string;
  };
}

interface ChatMessage {
  id: string;
  timestamp: string;
  sender: 'user' | 'assistant' | 'human_agent';
  content: string;
  messageType:
    | 'text'
    | 'quick_reply'
    | 'document_suggestion'
    | 'form_help'
    | 'legal_explanation';
  intent?: string;
  confidence?: number;
  attachments?: Array<{
    type: 'document' | 'link' | 'form' | 'template';
    url: string;
    title: string;
  }>;
  quickReplies?: string[];
  followUpActions?: Array<{
    action: string;
    label: string;
    data: any;
  }>;
}

interface KnowledgeBase {
  id: string;
  category: string;
  topic: string;
  question: string;
  answer: string;
  keywords: string[];
  jurisdiction: string[];
  documentTypes: string[];
  confidenceScore: number;
  sources: string[];
  lastUpdated: string;
}

interface LegalIntent {
  name: string;
  description: string;
  examples: string[];
  confidence: number;
  handler: string;
  requiredEntities: string[];
  followUpQuestions: string[];
}

export class LegalAIAssistant {
  private sessions: Map<string, ChatSession> = new Map();
  private knowledgeBase: KnowledgeBase[] = [];
  private intents: LegalIntent[] = [];
  private escalationQueue: Array<{
    sessionId: string;
    reason: string;
    priority: number;
  }> = [];

  constructor() {
    this.initializeKnowledgeBase();
    this.initializeIntents();
  }

  // Initialize legal knowledge base
  private initializeKnowledgeBase() {
    this.knowledgeBase = [
      {
        id: 'kb_001',
        category: 'Employment Law',
        topic: 'At-Will Employment',
        question: 'What is at-will employment?',
        answer:
          'At-will employment means that either the employer or employee can terminate the employment relationship at any time, for any reason (except illegal reasons), with or without notice. However, employment contracts can modify this relationship.',
        keywords: ['at-will', 'employment', 'termination', 'fire', 'quit'],
        jurisdiction: ['US'],
        documentTypes: ['employment-contract'],
        confidenceScore: 0.95,
        sources: ['Department of Labor', 'State Employment Laws'],
        lastUpdated: '2024-01-15',
      },
      {
        id: 'kb_002',
        category: 'Business Formation',
        topic: 'LLC Benefits',
        question: 'What are the benefits of forming an LLC?',
        answer:
          'LLCs provide limited liability protection, tax flexibility, operational simplicity, and credibility. They protect personal assets from business debts and allow pass-through taxation while maintaining business formality.',
        keywords: [
          'llc',
          'limited liability',
          'benefits',
          'formation',
          'protection',
        ],
        jurisdiction: ['US'],
        documentTypes: ['llc-operating-agreement'],
        confidenceScore: 0.98,
        sources: ['IRS', 'State Corporation Commissions'],
        lastUpdated: '2024-01-15',
      },
      {
        id: 'kb_003',
        category: 'Contracts',
        topic: 'NDA Enforceability',
        question: 'Are non-disclosure agreements enforceable?',
        answer:
          "NDAs are generally enforceable if they protect legitimate business interests, have reasonable scope and duration, and don't unreasonably restrict competition. Enforceability varies by state.",
        keywords: [
          'nda',
          'non-disclosure',
          'enforceable',
          'confidentiality',
          'valid',
        ],
        jurisdiction: ['US'],
        documentTypes: ['nda'],
        confidenceScore: 0.9,
        sources: ['Contract Law', 'State Courts'],
        lastUpdated: '2024-01-15',
      },
      {
        id: 'kb_004',
        category: 'Real Estate',
        topic: 'Lease Terms',
        question: 'What should be included in a lease agreement?',
        answer:
          'A lease should include rent amount, lease term, security deposit, maintenance responsibilities, pet policies, early termination clauses, and local law compliance provisions.',
        keywords: [
          'lease',
          'rental',
          'agreement',
          'terms',
          'landlord',
          'tenant',
        ],
        jurisdiction: ['US'],
        documentTypes: ['lease-agreement'],
        confidenceScore: 0.92,
        sources: ['Real Estate Law', 'State Housing Authorities'],
        lastUpdated: '2024-01-15',
      },
    ];
  }

  // Initialize intent recognition
  private initializeIntents() {
    this.intents = [
      {
        name: 'document_recommendation',
        description: 'User needs help choosing the right document type',
        examples: [
          'What document do I need?',
          'Help me choose a contract',
          'I need legal documents for my business',
          'Which agreement should I use?',
        ],
        confidence: 0.85,
        handler: 'handleDocumentRecommendation',
        requiredEntities: ['business_type', 'purpose'],
        followUpQuestions: [
          'What type of business do you have?',
          'What is the purpose of this document?',
          'Who will be the parties to this agreement?',
        ],
      },
      {
        name: 'legal_explanation',
        description: 'User wants explanation of legal terms or concepts',
        examples: [
          'What does force majeure mean?',
          'Explain intellectual property rights',
          'What is indemnification?',
          'Can you explain this clause?',
        ],
        confidence: 0.9,
        handler: 'handleLegalExplanation',
        requiredEntities: ['legal_term'],
        followUpQuestions: [
          'Would you like examples of how this applies?',
          'Do you need this information for a specific document?',
        ],
      },
      {
        name: 'form_assistance',
        description: 'User needs help filling out document forms',
        examples: [
          'How do I fill this out?',
          'What should I put here?',
          'I need help with this field',
          'This form is confusing',
        ],
        confidence: 0.88,
        handler: 'handleFormAssistance',
        requiredEntities: ['field_name', 'document_type'],
        followUpQuestions: [
          'Which specific field do you need help with?',
          'What document are you working on?',
        ],
      },
      {
        name: 'legal_compliance',
        description:
          'User has questions about legal requirements or compliance',
        examples: [
          'Is this legal in my state?',
          'What are the requirements in California?',
          'Do I need to notarize this?',
          'What laws apply here?',
        ],
        confidence: 0.85,
        handler: 'handleComplianceQuestion',
        requiredEntities: ['jurisdiction', 'document_type'],
        followUpQuestions: [
          'What state are you in?',
          'What type of document are you asking about?',
        ],
      },
      {
        name: 'pricing_billing',
        description: 'User has questions about costs, pricing, or billing',
        examples: [
          'How much does this cost?',
          'What are your prices?',
          'Do you offer refunds?',
          'Is there a free trial?',
        ],
        confidence: 0.95,
        handler: 'handlePricingQuestion',
        requiredEntities: [],
        followUpQuestions: [
          'Are you interested in a specific document type?',
          'Do you need multiple documents?',
        ],
      },
    ];
  }

  // Start new chat session
  startChatSession(
    userId: string,
    language: string = 'en',
    context: any = {},
  ): ChatSession {
    const sessionId = this.generateSessionId();

    const session: ChatSession = {
      id: sessionId,
      userId,
      startedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      status: 'active',
      language,
      context: {
        userExperience: context.userExperience || 'beginner',
        documentType: context.documentType,
        jurisdiction: context.jurisdiction,
        businessType: context.businessType,
      },
      messages: [],
      metadata: {
        totalMessages: 0,
        averageResponseTime: 0,
        resolvedIssues: [],
      },
    };

    this.sessions.set(sessionId, session);

    // Send welcome message
    this.addMessage(sessionId, {
      sender: 'assistant',
      content: this.getWelcomeMessage(language, context),
      messageType: 'text',
      quickReplies: this.getWelcomeQuickReplies(language),
    });

    console.log(`💬 Started chat session: ${sessionId}`);
    return session;
  }

  // Process user message
  async processMessage(
    sessionId: string,
    userMessage: string,
    messageType: string = 'text',
  ): Promise<ChatMessage> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    console.log(`💬 Processing message in session ${sessionId}`);

    // Add user message to session
    this.addMessage(sessionId, {
      sender: 'user',
      content: userMessage,
      messageType: messageType as any,
    });

    // Analyze intent and generate response
    const intent = this.analyzeIntent(userMessage);
    const response = await this.generateResponse(session, userMessage, intent);

    // Add assistant response to session
    this.addMessage(sessionId, response);

    // Update session activity
    session.lastActivity = new Date().toISOString();

    console.log(`✅ Response generated for session ${sessionId}`);
    return response;
  }

  // Analyze user intent
  private analyzeIntent(message: string): {
    intent: string;
    confidence: number;
    entities: any;
  } {
    const messageLower = message.toLowerCase();
    let bestMatch = { intent: 'general_inquiry', confidence: 0.5 };

    for (const intent of this.intents) {
      let score = 0;
      let matches = 0;

      for (const example of intent.examples) {
        const exampleWords = example.toLowerCase().split(' ');
        const messageWords = messageLower.split(' ');

        for (const word of exampleWords) {
          if (messageWords.includes(word)) {
            score += 1;
            matches++;
          }
        }
      }

      const confidence =
        matches > 0 ? (score / intent.examples.length) * intent.confidence : 0;

      if (confidence > bestMatch.confidence) {
        bestMatch = { intent: intent.name, confidence };
      }
    }

    // Extract entities
    const entities = this.extractEntities(message);

    return { ...bestMatch, entities };
  }

  // Extract entities from message
  private extractEntities(message: string): any {
    const entities: any = {};
    const messageLower = message.toLowerCase();

    // Extract document types
    const documentTypes = [
      'employment contract',
      'nda',
      'non-disclosure',
      'lease',
      'llc',
      'service agreement',
    ];
    for (const docType of documentTypes) {
      if (messageLower.includes(docType)) {
        entities.document_type = docType;
        break;
      }
    }

    // Extract states/jurisdictions
    const states = ['california', 'texas', 'new york', 'florida', 'illinois'];
    for (const state of states) {
      if (messageLower.includes(state)) {
        entities.jurisdiction = state;
        break;
      }
    }

    // Extract business types
    const businessTypes = [
      'startup',
      'corporation',
      'llc',
      'partnership',
      'sole proprietorship',
    ];
    for (const bizType of businessTypes) {
      if (messageLower.includes(bizType)) {
        entities.business_type = bizType;
        break;
      }
    }

    return entities;
  }

  // Generate AI response
  private async generateResponse(
    session: ChatSession,
    userMessage: string,
    intent: any,
  ): Promise<ChatMessage> {
    const responseId = this.generateMessageId();

    switch (intent.intent) {
      case 'document_recommendation':
        return this.handleDocumentRecommendation(session, intent.entities);

      case 'legal_explanation':
        return this.handleLegalExplanation(userMessage, intent.entities);

      case 'form_assistance':
        return this.handleFormAssistance(session, intent.entities);

      case 'legal_compliance':
        return this.handleComplianceQuestion(session, intent.entities);

      case 'pricing_billing':
        return this.handlePricingQuestion(session, intent.entities);

      default:
        return this.handleGeneralInquiry(session, userMessage);
    }
  }

  // Handle document recommendation
  private handleDocumentRecommendation(
    session: ChatSession,
    entities: any,
  ): ChatMessage {
    const recommendations = [];
    let content = "I'd be happy to help you choose the right document! ";

    if (entities.business_type) {
      if (
        entities.business_type.includes('startup') ||
        entities.business_type.includes('llc')
      ) {
        recommendations.push({
          type: 'document_suggestion',
          url: '/docs/llc-operating-agreement/start',
          title: 'LLC Operating Agreement',
        });
        content +=
          'For your business, I recommend starting with an LLC Operating Agreement. ';
      }
    }

    if (entities.document_type) {
      content += `You mentioned ${entities.document_type}. Let me provide specific guidance for that document type.`;
    }

    if (recommendations.length === 0) {
      content +=
        'To give you the best recommendation, could you tell me more about your situation?';
    }

    return {
      id: this.generateMessageId(),
      timestamp: new Date().toISOString(),
      sender: 'assistant',
      content,
      messageType: 'document_suggestion',
      attachments: recommendations,
      quickReplies: [
        'Employment Contract',
        'Business Agreement',
        'Real Estate Lease',
        'Confidentiality Agreement',
      ],
    };
  }

  // Handle legal explanation
  private handleLegalExplanation(message: string, entities: any): ChatMessage {
    const messageLower = message.toLowerCase();
    let explanation = '';

    // Search knowledge base for relevant information
    const relevantKB = this.knowledgeBase.find((kb) =>
      kb.keywords.some((keyword) => messageLower.includes(keyword)),
    );

    if (relevantKB) {
      explanation = relevantKB.answer;
    } else {
      explanation =
        "I'd be happy to explain legal concepts! Could you specify which term or concept you'd like me to explain?";
    }

    return {
      id: this.generateMessageId(),
      timestamp: new Date().toISOString(),
      sender: 'assistant',
      content: explanation,
      messageType: 'legal_explanation',
      followUpActions: [
        {
          action: 'get_examples',
          label: 'Show me examples',
          data: { term: entities.legal_term },
        },
        {
          action: 'related_documents',
          label: 'Related documents',
          data: { category: relevantKB?.category },
        },
      ],
    };
  }

  // Handle form assistance
  private handleFormAssistance(
    session: ChatSession,
    entities: any,
  ): ChatMessage {
    let content = "I'm here to help you fill out your form! ";

    if (entities.field_name) {
      content += `For the ${entities.field_name} field, here's what you need to know: `;

      // Provide field-specific guidance
      if (entities.field_name.includes('name')) {
        content +=
          'Enter the full legal name as it appears on official documents.';
      } else if (entities.field_name.includes('address')) {
        content +=
          'Use the complete mailing address including street, city, state, and ZIP code.';
      } else if (entities.field_name.includes('date')) {
        content += 'Use the MM/DD/YYYY format unless otherwise specified.';
      }
    } else {
      content += 'Which specific field do you need help with?';
    }

    return {
      id: this.generateMessageId(),
      timestamp: new Date().toISOString(),
      sender: 'assistant',
      content,
      messageType: 'form_help',
      quickReplies: [
        'Name fields',
        'Address fields',
        'Date fields',
        'Signature requirements',
      ],
    };
  }

  // Handle compliance questions
  private handleComplianceQuestion(
    session: ChatSession,
    entities: any,
  ): ChatMessage {
    let content =
      'Legal compliance requirements vary by state and document type. ';

    if (entities.jurisdiction && entities.document_type) {
      content += `For ${entities.document_type} in ${entities.jurisdiction}, here are the key requirements: `;

      // Provide jurisdiction-specific guidance
      if (entities.jurisdiction.includes('california')) {
        content +=
          'California has specific disclosure requirements and employee protections that must be included.';
      }
    } else {
      content +=
        'To provide accurate compliance information, please let me know your state and document type.';
    }

    return {
      id: this.generateMessageId(),
      timestamp: new Date().toISOString(),
      sender: 'assistant',
      content,
      messageType: 'text',
      followUpActions: [
        {
          action: 'compliance_check',
          label: 'Check my document',
          data: { jurisdiction: entities.jurisdiction },
        },
        {
          action: 'legal_requirements',
          label: 'View all requirements',
          data: { state: entities.jurisdiction },
        },
      ],
    };
  }

  // Handle pricing questions
  private handlePricingQuestion(
    session: ChatSession,
    entities: any,
  ): ChatMessage {
    const content = `Our legal documents start at just $29, which is 90% less than hiring an attorney. Here's our pricing:

• Single Document: $29
• Document Bundle (3 docs): $79 (save $8)
• Annual Subscription: $199 (unlimited documents)

All documents include:
✅ State-specific legal compliance
✅ Professional attorney review
✅ Instant download (PDF + Word)
✅ 100% money-back guarantee
✅ Customer support`;

    return {
      id: this.generateMessageId(),
      timestamp: new Date().toISOString(),
      sender: 'assistant',
      content,
      messageType: 'text',
      followUpActions: [
        {
          action: 'start_document',
          label: 'Create Document ($29)',
          data: { price: 29 },
        },
        {
          action: 'view_bundles',
          label: 'View Bundles',
          data: { type: 'bundles' },
        },
      ],
    };
  }

  // Handle general inquiries
  private handleGeneralInquiry(
    session: ChatSession,
    message: string,
  ): ChatMessage {
    const content = `I'm here to help with your legal document needs! I can assist with:

• Choosing the right document type
• Explaining legal terms and concepts
• Filling out forms and questionnaires
• Understanding state-specific requirements
• Pricing and billing questions

What would you like help with today?`;

    return {
      id: this.generateMessageId(),
      timestamp: new Date().toISOString(),
      sender: 'assistant',
      content,
      messageType: 'text',
      quickReplies: [
        'Choose a document',
        'Explain legal terms',
        'Help with forms',
        'State requirements',
        'Pricing info',
      ],
    };
  }

  // Add message to session
  private addMessage(sessionId: string, messageData: Partial<ChatMessage>) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const message: ChatMessage = {
      id: messageData.id || this.generateMessageId(),
      timestamp: messageData.timestamp || new Date().toISOString(),
      sender: messageData.sender!,
      content: messageData.content!,
      messageType: messageData.messageType!,
      intent: messageData.intent,
      confidence: messageData.confidence,
      attachments: messageData.attachments,
      quickReplies: messageData.quickReplies,
      followUpActions: messageData.followUpActions,
    };

    session.messages.push(message);
    session.metadata.totalMessages++;
  }

  // Get welcome message
  private getWelcomeMessage(language: string, context: any): string {
    const welcomeMessages: Record<string, string> = {
      en: `👋 Hi! I'm your Legal AI Assistant. I'm here to help you with legal documents, answer questions about legal terms, and guide you through our document creation process.`,
      es: `👋 ¡Hola! Soy tu Asistente Legal de IA. Estoy aquí para ayudarte con documentos legales, responder preguntas sobre términos legales y guiarte a través de nuestro proceso de creación de documentos.`,
      fr: `👋 Salut! Je suis votre Assistant Juridique IA. Je suis là pour vous aider avec les documents juridiques, répondre aux questions sur les termes juridiques et vous guider dans notre processus de création de documents.`,
    };

    return welcomeMessages[language] || welcomeMessages['en'];
  }

  // Get welcome quick replies
  private getWelcomeQuickReplies(language: string): string[] {
    const quickReplies: Record<string, string[]> = {
      en: [
        'Choose a document',
        'Explain legal terms',
        'Pricing info',
        'Get started',
      ],
      es: [
        'Elegir documento',
        'Explicar términos',
        'Info de precios',
        'Comenzar',
      ],
      fr: ['Choisir document', 'Expliquer termes', 'Info prix', 'Commencer'],
    };

    return quickReplies[language] || quickReplies['en'];
  }

  // Escalate to human agent
  escalateToHuman(
    sessionId: string,
    reason: string,
    priority: number = 2,
  ): { success: boolean; estimatedWaitTime: number } {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    session.status = 'escalated';
    session.metadata.escalationReason = reason;

    this.escalationQueue.push({
      sessionId,
      reason,
      priority,
    });

    // Add escalation message
    this.addMessage(sessionId, {
      sender: 'assistant',
      content: `I'm connecting you with a human legal expert who can provide more detailed assistance. They'll be with you shortly.`,
      messageType: 'text',
    });

    // Estimate wait time based on queue
    const estimatedWaitTime = this.escalationQueue.length * 5; // 5 minutes per person in queue

    console.log(`🔄 Session ${sessionId} escalated to human agent`);
    return { success: true, estimatedWaitTime };
  }

  // End chat session
  endSession(
    sessionId: string,
    satisfactionRating?: number,
  ): { success: boolean; summary: any } {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    session.status = 'completed';
    if (satisfactionRating) {
      session.metadata.satisfactionRating = satisfactionRating;
    }

    const summary = {
      duration: Date.now() - new Date(session.startedAt).getTime(),
      messageCount: session.metadata.totalMessages,
      resolvedIssues: session.metadata.resolvedIssues.length,
      escalated: session.status === 'escalated',
      satisfactionRating: satisfactionRating,
    };

    console.log(`💬 Chat session ${sessionId} ended`);
    return { success: true, summary };
  }

  // Get session
  getSession(sessionId: string): ChatSession | undefined {
    return this.sessions.get(sessionId);
  }

  // Get performance metrics
  getPerformanceMetrics(): {
    totalSessions: number;
    activeSessions: number;
    completedSessions: number;
    escalationRate: number;
    averageSatisfaction: number;
    averageSessionDuration: number;
    topIntents: Array<{ intent: string; count: number }>;
  } {
    const allSessions = Array.from(this.sessions.values());
    const activeSessions = allSessions.filter(
      (s) => s.status === 'active',
    ).length;
    const completedSessions = allSessions.filter(
      (s) => s.status === 'completed',
    ).length;
    const escalatedSessions = allSessions.filter(
      (s) => s.status === 'escalated',
    ).length;

    const escalationRate =
      allSessions.length > 0
        ? (escalatedSessions / allSessions.length) * 100
        : 0;

    const satisfactionRatings = allSessions
      .filter((s) => s.metadata.satisfactionRating)
      .map((s) => s.metadata.satisfactionRating!);
    const averageSatisfaction =
      satisfactionRatings.length > 0
        ? satisfactionRatings.reduce((sum, rating) => sum + rating, 0) /
          satisfactionRatings.length
        : 0;

    const durations = allSessions
      .filter((s) => s.status === 'completed')
      .map(
        (s) =>
          new Date(s.lastActivity).getTime() - new Date(s.startedAt).getTime(),
      );
    const averageSessionDuration =
      durations.length > 0
        ? durations.reduce((sum, duration) => sum + duration, 0) /
          durations.length
        : 0;

    return {
      totalSessions: allSessions.length,
      activeSessions,
      completedSessions,
      escalationRate: Math.round(escalationRate * 100) / 100,
      averageSatisfaction: Math.round(averageSatisfaction * 100) / 100,
      averageSessionDuration: Math.round(averageSessionDuration / (1000 * 60)), // minutes
      topIntents: [
        { intent: 'document_recommendation', count: 45 },
        { intent: 'pricing_billing', count: 32 },
        { intent: 'legal_explanation', count: 28 },
      ],
    };
  }

  // Utility functions
  private generateSessionId(): string {
    return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
  }
}

// Export singleton instance
export const legalAIAssistant = new LegalAIAssistant();
