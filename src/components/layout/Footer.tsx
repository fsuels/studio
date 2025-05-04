// src/components/layout/Footer.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Linkedin, Twitter, Send } from 'lucide-react'; // Social and Send icons
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/layout/Logo'; // Import the Logo component

export function Footer() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.includes('@')) { // Simple validation
             toast({ title: "Invalid Email", description: "Please enter a valid email address.", variant: "destructive" });
             return;
        }
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("Subscribing email:", email);
        toast({ title: "Subscribed!", description: "Thanks for joining! Check your inbox for your free credits." });
        setEmail('');
        setIsLoading(false);
    };

  return (
    <footer className="bg-muted text-muted-foreground py-12 mt-16 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Logo & Product */}
          <div className="space-y-4">
             <Logo className="h-8 mb-3"/> {/* Add Logo here */}
             <h4 className="font-semibold text-foreground mb-3 sr-only">Product</h4> {/* Keep for structure, hide visually */}
             <ul className="space-y-2 text-sm">
              <li><Link href="/#how-it-works" className="hover:text-primary hover:underline">How It Works</Link></li>
              <li><Link href="/pricing" className="hover:text-primary hover:underline">Pricing</Link></li>
              <li><Link href="/features" className="hover:text-primary hover:underline">Features</Link></li>
               {/* Add more product links */}
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" className="hover:text-primary hover:underline">Blog</Link></li>
              <li><Link href="/faq" className="hover:text-primary hover:underline">FAQ</Link></li>
              <li><Link href="/support" className="hover:text-primary hover:underline">Support</Link></li>
               {/* Add more resource links */}
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy-policy" className="hover:text-primary hover:underline">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-primary hover:underline">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="hover:text-primary hover:underline">Disclaimer</Link></li>
            </ul>
          </div>

          {/* Column 4: Community & Subscribe */}
          <div>
             <h4 className="font-semibold text-foreground mb-3">Community</h4>
             <div className="flex space-x-3 mb-6">
                 <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin className="h-5 w-5" />
                 </a>
                 <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors">
                     <Twitter className="h-5 w-5" />
                 </a>
                 {/* Add more social icons */}
             </div>

            <h4 className="font-semibold text-foreground mb-3">Get 3 Free Credits</h4>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow bg-background text-sm"
                aria-label="Email for newsletter subscription"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" className="bg-primary text-primary-foreground hover:bg-primary/90" aria-label="Subscribe" disabled={isLoading}>
                 {isLoading ? <div className="h-4 w-4 border-2 border-t-transparent border-primary-foreground rounded-full animate-spin"></div> : <Send className="h-4 w-4" />}
              </Button>
            </form>
            <p className="text-xs mt-2">Join our mailing list for updates and offers.</p>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center text-xs">
          © {new Date().getFullYear()} 123LegalDoc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
