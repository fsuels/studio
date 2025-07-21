// API route for waitlist signups from blocked states

import { NextRequest, NextResponse } from 'next/server';
import { ratelimit } from '@/lib/ratelimit';
import { getClientIP } from '@/lib/geolocation';

interface WaitlistEntry {
  email: string;
  firstName: string;
  lastName: string;
  documentType: string;
  businessType?: string;
  message?: string;
  stateCode: string;
  stateName: string;
  priority: 'standard' | 'urgent';
  timestamp: string;
  reason: string;
  riskLevel: 'red' | 'amber';
  ipAddress: string;
  userAgent: string;
}

// In production, you'd save this to a database
// For now, we'll just log it (you can replace with your database logic)
const waitlistEntries: WaitlistEntry[] = [];

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIP(request);
    const { success } = await ratelimit.limit(identifier);

    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Validate required fields
    const { email, firstName, lastName, documentType, stateCode, stateName } =
      body;

    if (
      !email ||
      !firstName ||
      !lastName ||
      !documentType ||
      !stateCode ||
      !stateName
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 },
      );
    }

    // Create waitlist entry
    const waitlistEntry: WaitlistEntry = {
      email: email.toLowerCase().trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      documentType: documentType.trim(),
      businessType: body.businessType?.trim(),
      message: body.message?.trim(),
      stateCode: stateCode.toUpperCase(),
      stateName: stateName.trim(),
      priority: body.priority || 'standard',
      timestamp: new Date().toISOString(),
      reason: body.reason || 'State restrictions',
      riskLevel: body.riskLevel || 'red',
      ipAddress: identifier,
      userAgent,
    };

    // Check for duplicate emails in the same state
    const existingEntry = waitlistEntries.find(
      (entry) =>
        entry.email === waitlistEntry.email &&
        entry.stateCode === waitlistEntry.stateCode,
    );

    if (existingEntry) {
      return NextResponse.json(
        { error: 'Email already registered for this state' },
        { status: 409 },
      );
    }

    // Save to waitlist (replace with database save in production)
    waitlistEntries.push(waitlistEntry);

    // Log for monitoring
    console.log('Waitlist signup:', {
      email: waitlistEntry.email,
      state: waitlistEntry.stateName,
      documentType: waitlistEntry.documentType,
      priority: waitlistEntry.priority,
      timestamp: waitlistEntry.timestamp,
    });

    // In production, you'd:
    // 1. Save to database
    // 2. Send confirmation email
    // 3. Add to email marketing list
    // 4. Notify legal team for high-priority requests

    // TODO: Integrate with your email service
    // await sendConfirmationEmail(waitlistEntry);

    // TODO: Add to marketing automation
    // if (waitlistEntry.priority === 'urgent') {
    //   await notifyLegalTeam(waitlistEntry);
    // }

    return NextResponse.json({
      success: true,
      message: `Successfully added to waitlist for ${stateName}`,
      waitlistId: `wl_${Date.now()}_${stateCode}`, // Generate simple ID
    });
  } catch (error) {
    console.error('Waitlist signup error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to join waitlist. Please try again.',
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Admin endpoint to view waitlist stats (add authentication in production)
    const url = new URL(request.url);
    const stateCode = url.searchParams.get('state');

    let filteredEntries = waitlistEntries;

    if (stateCode) {
      filteredEntries = waitlistEntries.filter(
        (entry) => entry.stateCode === stateCode.toUpperCase(),
      );
    }

    // Group by state
    const byState = filteredEntries.reduce(
      (acc, entry) => {
        if (!acc[entry.stateCode]) {
          acc[entry.stateCode] = {
            stateName: entry.stateName,
            count: 0,
            urgent: 0,
            recent: 0,
          };
        }
        acc[entry.stateCode].count++;
        if (entry.priority === 'urgent') {
          acc[entry.stateCode].urgent++;
        }
        // Count entries from last 7 days
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        if (new Date(entry.timestamp) > weekAgo) {
          acc[entry.stateCode].recent++;
        }
        return acc;
      },
      {} as Record<string, any>,
    );

    // Most requested document types
    const documentTypes = filteredEntries.reduce(
      (acc, entry) => {
        acc[entry.documentType] = (acc[entry.documentType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return NextResponse.json({
      success: true,
      stats: {
        total: filteredEntries.length,
        byState,
        topDocuments: Object.entries(documentTypes)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10)
          .map(([doc, count]) => ({ document: doc, count })),
        recentSignups: filteredEntries.filter(
          (entry) =>
            new Date(entry.timestamp) >
            new Date(Date.now() - 24 * 60 * 60 * 1000),
        ).length,
      },
    });
  } catch (error) {
    console.error('Waitlist stats error:', error);

    return NextResponse.json(
      { success: false, error: 'Failed to retrieve stats' },
      { status: 500 },
    );
  }
}
