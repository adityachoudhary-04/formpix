import React from "react";
import { Shield, Zap, Heart, Camera, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 md:py-16 space-y-12">
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">About SarkariPhoto</h1>
        <p className="text-muted-foreground text-base md:text-lg">
          Empowering millions of job seekers across India with fast, privacy-first, and 100% free photo and signature
          editing tools.
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-muted-foreground space-y-6 text-sm md:text-base leading-relaxed">
        <p>
          Every year, over 30 million candidates across India apply for government and entrance examinations, including
          UPSC Civil Services, SSC CGL/CHSL, IBPS Banking PO, Railway RRB, Defence, Teaching, and State Public Service
          Commissions. A disproportionately large percentage of online application rejections occur simply because the
          uploaded photograph or signature fails the strict dimension or file size validation of the recruitment portal.
        </p>

        <p>
          Commercial online resizers often require costly subscriptions, display invasive advertisements, stamp ugly
          watermarks, or—worst of all—upload candidates&apos; personal biometric photos and signatures to untrusted cloud
          servers.
        </p>

        <p>
          <strong>SarkariPhoto</strong> was built to solve this problem cleanly and ethically. Our platform runs entirely
          inside your web browser using HTML5 Canvas, Web Workers, and modern JavaScript APIs. Your documents never touch
          any server, guaranteeing 100% data privacy and instant processing speed.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <Card>
          <CardHeader className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <CardTitle className="text-base">100% Browser Privacy</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground leading-relaxed">
            Your images and signatures are processed entirely in your device memory. Zero uploads to any backend server.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <CardTitle className="text-base">Lightning Fast</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground leading-relaxed">
            No network latency or server queue delays. Resizing, background cleaning, and compression happen in
            milliseconds.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <CardTitle className="text-base">Free Forever</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground leading-relaxed">
            No signup, no subscription paywalls, no watermark, and no artificial restrictions. Accessible to all students.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
