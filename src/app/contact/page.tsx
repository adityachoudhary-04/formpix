"use client";

import React, { useState } from "react";
import { Mail, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 md:py-16 space-y-10">
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Contact Us & Feedback</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Have a question, feedback, or want to suggest new exam presets? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-5 space-y-6">
          <Card>
            <CardHeader className="space-y-2">
              <CardTitle className="text-base">Get in Touch</CardTitle>
              <CardDescription className="text-xs">Direct support channels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-xs">Email</p>
                  <p className="text-xs">support@formpix.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-xs">Community Support</p>
                  <p className="text-xs">Open 24/7 for exam candidates</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-7">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Send us a Message</CardTitle>
              <CardDescription className="text-xs">We typically respond within 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="p-8 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h4 className="font-bold text-base">Thank you for your feedback!</h4>
                  <p className="text-xs text-muted-foreground">
                    Your message has been recorded. If you reported an updated exam notification specification, our
                    curation team will review and update the preset accordingly.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSubmitted(false);
                      setName("");
                      setEmail("");
                      setMessage("");
                    }}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Your Name</Label>
                    <Input
                      required
                      placeholder="Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Email Address</Label>
                    <Input
                      type="email"
                      required
                      placeholder="rahul@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Message / Suggested Exam</Label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Share your message or provide details of an exam format requirement..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>

                  <Button type="submit" className="w-full gap-2">
                    <Send className="w-4 h-4" /> Send Message
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

