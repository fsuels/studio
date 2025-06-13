// scripts/seedUser.ts
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp, collection } from "firebase/firestore";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDzchJQ-4ZypZ2Tscri3VYfJEN2Ocqx0hU",
  authDomain: "legaldoc-26ea8.firebaseapp.com",
  projectId: "legaldoc-26ea8",
  storageBucket: "legaldoc-26ea8.appspot.com",
  messagingSenderId: "584726654660",
  appId: "1:584726654660:web:82597df4ee5bc2098ba391",
  measurementId: "G-3VR0TDX4ZK"
};

// ✅ Init
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔁 Enhanced seed routine for legal platform
async function seedAll() {
  const userId = "d3bMZOfpsWgnvPm07QOyjMbwr8l1";

  // 👤 Enhanced User profile
  await setDoc(doc(db, "users", userId), {
    fullName: "Jordan M. Walker",
    email: "user@example.com",
    phone: "+1-555-555-1234",
    emailVerified: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    profileComplete: true,
    
    // 💼 Enhanced Stripe subscription tracking
    stripe: {
      customerId: "cus_ABC123XYZ",
      subscriptionId: "sub_DEF456UVW",
      priceId: "price_pro_monthly_2024", // Stripe Price ID
      status: "active", // active, past_due, canceled, incomplete
      currentPeriodStart: serverTimestamp(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      cancelAtPeriodEnd: false,
      trialEnd: null,
      defaultPaymentMethodId: "pm_card789xyz"
    },
    
    // 📊 Usage tracking
    usage: {
      documentsCreated: 5,
      documentsLimit: 50,
      notarizationsUsed: 2,
      notarizationsLimit: 10,
      eSignaturesUsed: 3,
      eSignaturesLimit: 25
    },
    
    // 🏠 Enhanced address with validation
    address: {
      line1: "123 Main Street",
      line2: "Apt 4B",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "US",
      verified: true,
      verifiedAt: new Date()
    },
    
    // 🔐 Security & preferences
    preferences: {
      notifications: {
        email: true,
        sms: false,
        documentUpdates: true,
        paymentReminders: true,
        marketingEmails: false
      },
      timezone: "America/New_York",
      language: "en"
    },
    
    // 👨‍💼 Professional info for business users
    businessInfo: {
      type: "LLC", // individual, LLC, corporation, partnership
      name: "Walker Consulting LLC",
      taxId: "12-3456789",
      industry: "Consulting"
    }
  });

  // 📁 Folders for organization
  const folderIds = ["personal", "business", "contracts"];
  for (const folderId of folderIds) {
    await setDoc(doc(db, "users", userId, "folders", folderId), {
      name: folderId === "personal" ? "Personal Documents" : 
            folderId === "business" ? "Business Documents" : "Contracts",
      createdAt: serverTimestamp(),
      color: folderId === "personal" ? "#3B82F6" : 
             folderId === "business" ? "#10B981" : "#F59E0B"
    });
  }

  // 📄 Multiple realistic documents
  const documents = [
    {
      id: "will_001",
      name: "Last Will and Testament",
      docType: "will",
      status: "Complete",
      folderId: "personal",
      tags: ["estate-planning", "important"],
      completionPercentage: 100
    },
    {
      id: "llc_001", 
      name: "LLC Operating Agreement",
      docType: "llc-agreement",
      status: "In Progress",
      folderId: "business",
      tags: ["business", "formation"],
      completionPercentage: 75
    },
    {
      id: "nda_001",
      name: "Non-Disclosure Agreement - Contractor",
      docType: "nda",
      status: "Pending Signature",
      folderId: "contracts",
      tags: ["confidentiality", "contractor"],
      completionPercentage: 100
    }
  ];

  for (const docData of documents) {
    await setDoc(doc(db, "users", userId, "documents", docData.id), {
      name: docData.name,
      status: docData.status,
      docType: docData.docType,
      folderId: docData.folderId,
      tags: docData.tags,
      completionPercentage: docData.completionPercentage,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      deletedAt: null,
      
      // 📝 Form data tracking
      formData: {
        lastSavedAt: new Date(),
        isComplete: docData.completionPercentage === 100,
        validationErrors: []
      },
      
      // 🔒 Security & sharing
      sharing: {
        isShared: docData.id === "nda_001",
        sharedWith: docData.id === "nda_001" ? ["contractor@example.com"] : [],
        permissions: docData.id === "nda_001" ? { "contractor@example.com": "sign" } : {}
      },
      
      // 📋 Legal requirements
      legal: {
        requiresNotarization: docData.docType === "will",
        requiresWitnesses: docData.docType === "will",
        jurisdiction: "NY"
      }
    });

    // 📄 Document versions with legal tracking
    await setDoc(doc(db, "users", userId, "documents", docData.id, "versions", "v1"), {
      createdAt: serverTimestamp(),
      editedBy: userId,
      changeType: "initial_creation",
      snapshot: {
        name: docData.name,
        status: docData.status,
        formData: {}
      },
      ipAddress: "192.168.1.1", // Important for legal documents
      userAgent: "Mozilla/5.0..."
    });
  }

  // ✍️ SignWell E-Signature requests
  await setDoc(doc(db, "users", userId, "signatures", "sig_001"), {
    documentId: "nda_001",
    requestedBy: userId,
    
    // 🔗 SignWell integration
    signwell: {
      envelopeId: "env_abc123xyz789", // SignWell envelope ID
      templateId: "tmpl_nda_standard", // If using SignWell templates
      status: "pending", // pending, completed, declined, expired
      signwellUrl: "https://app.signwell.com/s/abc123xyz789",
      webhookReceived: true,
      lastSyncAt: new Date()
    },
    
    signers: [
      {
        email: "contractor@example.com",
        name: "John Contractor",
        role: "Contractor",
        status: "pending", // pending, signed, declined
        signwellSignerId: "signer_def456", // SignWell's signer ID
        requestedAt: new Date(),
        remindersSent: 1,
        lastReminderAt: new Date()
      }
    ],
    
    status: "pending", // pending, completed, declined, expired
    createdAt: serverTimestamp(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    
    // 💰 Pricing
    cost: 2.50, // SignWell per-signature cost
    stripeFeeId: "fee_signwell_001", // Track fees separately
    
    settings: {
      requirePhoneVerification: false,
      allowDelegation: false,
      reminderFrequency: "weekly",
      signwellBranding: false // Hide SignWell branding with paid plan
    }
  });

  // 🔔 Third-party notarization sessions (like NotaryCam, Notarize.com, etc.)
  await setDoc(doc(db, "users", userId, "notarizations", "notary_001"), {
    documentId: "will_001",
    status: "scheduled", // scheduled, in_progress, completed, cancelled
    scheduledFor: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    
    // 🏢 External notary service integration
    notaryService: {
      provider: "notarize.com", // or "notarycam.com", "safedocs.com", etc.
      sessionId: "ntiz_session_abc123", // Provider's session ID
      sessionUrl: "https://notarize.com/session/abc123", // Direct link to session
      notaryId: "notary_certified_001",
      notaryName: "Sarah Johnson",
      notaryCommission: "12345678",
      notaryState: "NY",
      lastSyncAt: new Date()
    },
    
    // 💰 Cost tracking
    baseFee: 25.00, // Base notarization fee
    platformFee: 5.00, // Your platform markup
    totalFee: 30.00,
    stripePaymentIntentId: "pi_notary_001",
    
    createdAt: serverTimestamp(),
    location: "online", // online (most common), in-person, mobile
    
    // 📋 Session requirements
      // 📋 Session requirements
      requirements: {
        witnessesRequired: 2,
        idVerificationRequired: true,
        documentsToVerify: ["drivers_license"],
        participantEmails: ["user@example.com", "witness1@example.com", "witness2@example.com"]
      },
    
    // 📱 Session details
    sessionDetails: {
      duration: 30, // minutes
      recordingEnabled: true,
      recordingUrl: null, // Filled after session
      certificateUrl: null // Notary certificate PDF
    }
  });

  // 💳 Enhanced Stripe payment records
  const payments = [
    {
      id: "pay_001",
      amount: 2999, // Stripe amounts in cents
      description: "Pro Monthly Subscription",
      type: "subscription",
      stripePaymentIntentId: "pi_1ABC123Stripe456",
      stripeInvoiceId: "in_1DEF789Stripe012"
    },
    {
      id: "pay_002", 
      amount: 3000, // $30.00 total ($25 base + $5 markup)
      description: "Online Notarization - Will Document", 
      type: "notarization",
      stripePaymentIntentId: "pi_1GHI345Stripe678",
      metadata: {
        notarySessionId: "ntiz_session_abc123",
        documentId: "will_001"
      }
    },
    {
      id: "pay_003",
      amount: 250, // $2.50 per signature
      description: "E-Signature Service - 1 signature",
      type: "esignature", 
      stripePaymentIntentId: "pi_1JKL901Stripe234",
      metadata: {
        signwellEnvelopeId: "env_abc123xyz789",
        signaturesCount: 1
      }
    }
  ];

  for (const payment of payments) {
    await setDoc(doc(db, "users", userId, "payments", payment.id), {
      amount: payment.amount,
      currency: "USD",
      date: serverTimestamp(),
      description: payment.description,
      type: payment.type,
      method: "card",
      status: "succeeded", // Stripe status: succeeded, pending, failed
      
      // 🔗 Stripe integration fields
      stripePaymentIntentId: payment.stripePaymentIntentId,
      stripeInvoiceId: payment.stripeInvoiceId || null,
      stripeCustomerId: "cus_ABC123XYZ",
      stripeFees: Math.round(payment.amount * 0.029 + 30), // Stripe fees in cents
      netAmount: payment.amount - Math.round(payment.amount * 0.029 + 30),
      
      // 📊 Enhanced billing details
      billing: {
        name: "Jordan M. Walker",
        email: "user@example.com",
        address: {
          line1: "123 Main Street",
          city: "New York", 
          state: "NY",
          postal_code: "10001",
          country: "US"
        }
      },
      
      // 🔍 Additional metadata for third-party services
      metadata: payment.metadata || {},
      
      // 🧾 Receipt and invoice URLs
      receiptUrl: `https://pay.stripe.com/receipts/${payment.stripePaymentIntentId}`,
      invoiceUrl: payment.stripeInvoiceId ? 
        `https://invoice.stripe.com/i/${payment.stripeInvoiceId}` : null
    });
  }

  // 🤖 AI Generation history
  await setDoc(doc(db, "users", userId, "ai_generations", "gen_001"), {
    promptUsed: "Create a non-disclosure agreement for a freelance graphic designer working on confidential marketing materials",
    documentType: "nda",
    outputSummary: "Comprehensive NDA with IP protection clauses",
    model: "gpt-4-turbo",
    timestamp: serverTimestamp(),
    tokensUsed: 2500,
    cost: 0.15,
    documentId: "nda_001", // Links to created document
    quality: {
      userRating: 5,
      feedback: "Perfect for my needs"
    }
  });

  // 📱 App activity logs (important for legal platforms)
  await setDoc(doc(db, "users", userId, "activity", "act_001"), {
    action: "document_signed",
    documentId: "nda_001", 
    timestamp: serverTimestamp(),
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0...",
    location: {
      country: "US",
      region: "NY",
      city: "New York"
    }
  });

  // 🔔 Enhanced notifications
  const notifications = [
    {
      id: "notif_001",
      message: "Your Will document is ready for notarization",
      type: "notarization",
      priority: "high",
      actionUrl: "/notarizations/notary_001"
    },
    {
      id: "notif_002", 
      message: "NDA signature request sent to contractor@example.com",
      type: "signature",
      priority: "medium",
      actionUrl: "/signatures/sig_001"
    },
    {
      id: "notif_003",
      message: "Monthly subscription renewal successful",
      type: "billing",
      priority: "low",
      actionUrl: "/billing"
    }
  ];

  for (const notif of notifications) {
    await setDoc(doc(db, "users", userId, "notifications", notif.id), {
      message: notif.message,
      type: notif.type,
      priority: notif.priority,
      read: false,
      createdAt: serverTimestamp(),
      actionUrl: notif.actionUrl,
      
      // 📧 Delivery tracking
      channels: {
        inApp: true,
        email: notif.priority !== "low",
        sms: notif.priority === "high"
      },
      deliveryStatus: {
        inApp: "delivered",
        email: notif.priority !== "low" ? "delivered" : null,
        sms: notif.priority === "high" ? "delivered" : null
      }
    });
  }

  // 📞 Support tickets
  await setDoc(doc(db, "users", userId, "support", "ticket_001"), {
    subject: "Question about notarization process",
    message: "Hi, I need help understanding the witness requirements for my will. Can someone explain?",
    status: "open",
    priority: "medium",
    category: "notarization",
    createdAt: serverTimestamp(),
    assignedTo: "support_agent_001",
    tags: ["will", "witnesses", "notarization"]
  });

  // 🏢 For business users - Team management
  await setDoc(doc(db, "users", userId, "team", "member_001"), {
    email: "assistant@walkerllc.com",
    name: "Jane Assistant", 
    role: "editor", // viewer, editor, admin
      invitedAt: new Date(),
      status: "active",
      permissions: {
        canCreateDocuments: true,
        canDeleteDocuments: false,
        canManageBilling: false,
        canInviteMembers: false
      }
    });

  console.log("✅ Seeded comprehensive legal platform data with third-party integrations:");
  console.log("- User profile with Stripe subscription tracking");
  console.log("- Document folders and organization");
  console.log("- Multiple document types with legal metadata");
  console.log("- SignWell e-signature workflows with envelope tracking");
  console.log("- Third-party notarization sessions (Notarize.com/NotaryCam style)");
  console.log("- Detailed Stripe payment history with fees and metadata");
  console.log("- AI generation tracking");
  console.log("- Activity logs for compliance");
  console.log("- Rich notifications system");
  console.log("- Support ticket system");
  console.log("- Team/collaboration features");
}

seedAll().catch((err) => {
  console.error("❌ Seed error:", err);
});