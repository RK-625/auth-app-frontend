import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Search, 
  Trash2, 
  Mail,
  Lock,
  ArrowRight
} from "lucide-react"
import { GlowDecoration } from "@/components/glow-decoration"
import { FallingPattern } from "@/components/falling-pattern"
import { InteractiveLogo } from "@/components/ui/logo"
import { 
  Field, 
  FieldLabel, 
  FieldErrorSlot, 
  FieldGroup,
  FieldSeparator
} from "@/components/ui/field"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 md:p-16 space-y-24 pb-40">
      
      {/* HEADER */}
      <header className="space-y-4 max-w-4xl border-b border-border pb-10">
        <div className="flex items-center gap-4">
           <InteractiveLogo />
           <Badge variant="outline" className="text-[10px] tracking-widest font-black uppercase">Live Lab</Badge>
        </div>
        <h1 className="text-5xl font-black tracking-tighter">The Living Dictionary.</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          This page renders the <span className="text-primary font-bold">actual React components</span> used in production. 
          Use this to verify behaviors, animations, and responsive states.
        </p>
      </header>

      {/* 1. BUTTONS */}
      <section className="space-y-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-black uppercase tracking-tight">01. Button Matrix</h2>
          <p className="text-sm text-muted-foreground">Standardized action primitives with pill-shaped geometry.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase opacity-40">Primary</h3>
            <div className="flex flex-col gap-3">
              <Button variant="primary">Primary Action</Button>
              <Button variant="primary" size="sm">Small Action</Button>
              <Button variant="primary" loading>Loading State</Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase opacity-40">Secondary / Outline</h3>
            <div className="flex flex-col gap-3">
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost Button</Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase opacity-40">Destructive</h3>
            <div className="flex flex-col gap-3">
              <Button variant="destructive">Destructive</Button>
              <Button variant="destructive" size="sm">Small Delete</Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase opacity-40">With Icons</h3>
            <div className="flex flex-col gap-3">
              <Button variant="primary" className="gap-2">Continue <ArrowRight className="size-4" /></Button>
              <Button variant="outline" size="icon"><Search className="size-4" /></Button>
              <Button variant="destructive" size="icon"><Trash2 className="size-4" /></Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FORM ELEMENTS */}
      <section className="space-y-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-black uppercase tracking-tight">02. Form Controls</h2>
          <p className="text-sm text-muted-foreground">Input fields with strictly defined error slots and spacing.</p>
        </div>

        <div className="max-w-xl space-y-10">
           <FieldGroup className="p-6 rounded-2xl border border-border bg-card/10">
              <Field>
                <FieldLabel>Email Address</FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 opacity-40" />
                  <Input placeholder="name@example.com" className="pl-10 h-11" />
                </div>
                <FieldErrorSlot />
              </Field>

              <FieldSeparator>or</FieldSeparator>

              <Field>
                <FieldLabel>Security Key</FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 opacity-40" />
                  <Input type="password" placeholder="••••••••" className="pl-10 h-11" />
                </div>
                <FieldErrorSlot errors={[{ message: "Complexity requirements not met" }]} />
              </Field>
           </FieldGroup>
        </div>
      </section>

      {/* 3. ATMOSPHERE */}
      <section className="space-y-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-black uppercase tracking-tight">03. Atmosphere</h2>
          <p className="text-sm text-muted-foreground">High-impact visual feedback and decorative backgrounds.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card variant="glass" className="overflow-hidden h-[300px]">
             <FallingPattern />
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Badge className="bg-primary/20 backdrop-blur-md">Falling Pattern Preview</Badge>
             </div>
          </Card>

          <Card className="overflow-hidden border-border bg-card/20 h-[300px]">
             <GlowDecoration />
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase opacity-40">Full Screen Loader</h3>
          <div className="relative h-40 w-full border border-border rounded-2xl overflow-hidden bg-card/10">
             {/* We wrap it to prevent it from covering the whole screen in the lab */}
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                   <div className="relative size-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
                   <span className="text-xs font-bold uppercase tracking-widest opacity-60">System Synchronizing...</span>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 4. DATA & STATUS */}
      <section className="space-y-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-black uppercase tracking-tight">04. Links & Interactions</h2>
          <p className="text-sm text-muted-foreground">Standardized hover effects for text-based actions.</p>
        </div>

        <div className="flex gap-12 items-center p-8 rounded-2xl border border-border bg-card/10">
           <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase opacity-40">Center Expand</span>
              <a href="#" className="text-primary font-bold link-underline-center text-lg">Forgot password?</a>
           </div>
           <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase opacity-40">Navigation Style</span>
              <a href="#" className="text-foreground/60 font-medium link-underline-center">Return to dashboard</a>
           </div>
        </div>
      </section>

      {/* 5. IDENTITY & STATUS */}
      <section className="space-y-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-black uppercase tracking-tight">05. Identity & Status</h2>
          <p className="text-sm text-muted-foreground">Standardized representations for users and roles.</p>
        </div>

        <div className="flex flex-wrap gap-8 items-center">
          <div className="flex items-center gap-3">
            <Avatar className="size-12 border-2 border-primary/20">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-primary-foreground font-black">JD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-bold">John Doe</span>
              <span className="text-[10px] font-black uppercase text-primary">Admin</span>
            </div>
          </div>

          <Separator orientation="vertical" className="h-10" />

          <div className="flex gap-2">
            <Badge variant="default">Active</Badge>
            <Badge variant="outline">Offline</Badge>
            <Badge variant="destructive">Suspended</Badge>
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Verified</Badge>
          </div>
          
          <Separator orientation="vertical" className="h-10" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Test Dropdown</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 glass-card">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Security Keys</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>

      {/* FOOTER FOOTNOTE */}
      <footer className="pt-20 border-t border-border/30">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 text-center">
          Stitch Identity Design System • Develop Branch Only
        </p>
      </footer>
    </div>
  )
}
