// src/app/dashboard/page.tsx

import React from 'react';

// Although dashboard isn't typically parameterized in the same way as [linkId],
// applying generateStaticParams structure for potential future use or consistency.
// If the dashboard route *never* expects parameters for static generation,
// this function can be omitted.
export async function generateStaticParams() {
  // For a simple /dashboard, there are usually no params to pre-generate.
  // Return an empty array or an array with an empty object if structure requires.
  // If /dashboard/[userId] existed, you'd return [{ userId: 'user1' }, { userId: 'user2' }]
  return [{}]; // Indicates the base /dashboard route should be generated.
}

// Props will be empty if no dynamic params are defined in the path
interface DashboardPageProps {
    params?: { [key: string]: string | string[] | undefined }; // Optional params
    searchParams?: { [key: string]: string | string[] | undefined }; // Optional query params
}


export default function DashboardPage({ params, searchParams }: DashboardPageProps) {
  // In a real app, this page would likely fetch user-specific data
  // (e.g., list of documents, account settings) based on authentication.
  // Since this is static export, data fetching might happen client-side
  // or be pre-rendered if possible using generateStaticParams with user IDs.

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-muted-foreground mb-6">
        Welcome back! Here you can manage your documents and account settings.
      </p>

      {/* Placeholder for dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {/* Example Card 1: Recent Documents */}
         <div className="border rounded-lg p-6 shadow-sm bg-card text-card-foreground">
             <h2 className="text-xl font-semibold mb-3">Recent Documents</h2>
             <ul className="space-y-2 text-sm text-muted-foreground">
                 <li>Lease Agreement - Signed_Lease_Agreement.pdf</li>
                 <li>Partnership Agreement - Draft_Partnership_v2.pdf</li>
                 <li>Invoice Dispute - Dispute_Letter_Apr24.pdf</li>
             </ul>
             {/* Add link to view all documents */}
         </div>

          {/* Example Card 2: Account Settings */}
         <div className="border rounded-lg p-6 shadow-sm bg-card text-card-foreground">
             <h2 className="text-xl font-semibold mb-3">Account</h2>
             <p className="text-sm text-muted-foreground">Manage your profile and subscription.</p>
             {/* Add link to account settings */}
         </div>

          {/* Example Card 3: Create New Document */}
         <div className="border rounded-lg p-6 shadow-sm bg-card text-card-foreground">
             <h2 className="text-xl font-semibold mb-3">Create New</h2>
             <p className="text-sm text-muted-foreground">Start generating a new legal document.</p>
              {/* Add link to the main generation page */}
         </div>
      </div>
    </main>
  );
}
