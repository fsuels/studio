import React, { useState } from 'react';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactFormButton() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const message = formData.get('message');
    const mailto = `mailto:support@123legaldoc.com?subject=Website%20question&body=${encodeURIComponent(
      `From: ${email}\n\n${message}`,
    )}`;
    window.location.href = mailto;
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="fixed bottom-6 right-6 z-50 shadow-lg" variant="secondary">
          Ask us your question
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 sm:w-96">
        <SheetHeader>
          <SheetTitle>Ask us your question</SheetTitle>
          <SheetDescription>We\'ll reply by email.</SheetDescription>
        </SheetHeader>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <Input type="email" name="email" placeholder="Your email" required />
          <Textarea name="message" placeholder="How can we help you?" rows={4} required />
          <div className="flex justify-end gap-2">
            <SheetClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </SheetClose>
            <Button type="submit">Send</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
