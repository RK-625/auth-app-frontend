import { Link } from "react-router-dom"
import { 
  Home, 
  Settings, 
  LogOut, 
  LayoutDashboard, 
  ShieldCheck, 
  Activity, 
  Key, 
  Smartphone, 
  Search, 
  Bell,
  Fingerprint,
  Lock,
  History
} from "lucide-react"
import { cn } from "@/lib/utils"
import { InteractiveLogo } from "@/components/ui/logo"
import { useAuth } from "@/components/auth-context"
import { ModeToggle } from "@/components/mode-toggle"
import { motion, type Variants } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { logout, user } = useAuth()

  // Animation variants
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } }
  }

  return (
    <div className={cn("relative h-full w-full flex flex-col md:flex-row bg-background text-foreground overflow-hidden", className)} {...props}>
      
      {/* 1. Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/10 backdrop-blur-2xl relative z-20">
        <div className="flex h-16 items-center px-6 border-b border-border/50">
          <InteractiveLogo />
        </div>
        
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          <div className="text-[10px] uppercase tracking-widest font-black text-muted-foreground/40 mb-3 px-3">Identity Ops</div>
          <Link
            to="/dashboard"
            className="flex items-center gap-3 rounded-xl bg-primary/10 px-4 py-3 text-sm font-bold text-primary transition-all duration-300 border border-primary/20 shadow-[0_0_15px_rgba(236,72,153,0.05)]"
          >
            <LayoutDashboard className="size-4" />
            Command Center
          </Link>
          <Link
            to="#"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground transition-all duration-300 hover:bg-card/40 hover:text-foreground border border-transparent hover:border-border"
          >
            <History className="size-4" />
            Audit Logs
          </Link>
          <Link
            to="#"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground transition-all duration-300 hover:bg-card/40 hover:text-foreground border border-transparent hover:border-border"
          >
            <ShieldCheck className="size-4" />
            Security
          </Link>
          
          <div className="text-[10px] uppercase tracking-widest font-black text-muted-foreground/40 mb-3 mt-8 px-3">Account</div>
          <Link
            to="#"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground transition-all duration-300 hover:bg-card/40 hover:text-foreground border border-transparent hover:border-border"
          >
            <Settings className="size-4" />
            Settings
          </Link>
        </nav>
        
        <div className="p-4 border-t border-border/50">
          <button
            onClick={() => logout()}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-muted-foreground transition-all duration-300 hover:bg-destructive/10 hover:text-destructive border border-transparent hover:border-destructive/20"
          >
            <LogOut className="size-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-border/50 px-6 md:px-10 bg-card/5 backdrop-blur-md">
          <div className="flex items-center gap-4">
             <div className="md:hidden">
                <InteractiveLogo />
             </div>
             <h2 className="hidden md:block text-lg font-black tracking-tight uppercase">Overview</h2>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden lg:flex items-center gap-3 bg-input/30 border border-border rounded-full px-4 py-2 text-sm text-muted-foreground w-72 transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/40">
              <Search className="size-4 opacity-40" />
              <input type="text" placeholder="Search events..." className="bg-transparent border-none outline-none w-full text-foreground placeholder:text-muted-foreground/40" />
            </div>
            
            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-card/40">
              <Bell className="size-5" />
              <span className="absolute top-2 right-2 size-2 bg-primary rounded-full animate-glow" />
            </button>

            <ModeToggle />

            <div className="h-6 w-px bg-border/50" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 hover:opacity-80 transition-opacity outline-none">
                  <div className="hidden sm:flex flex-col items-end mr-1">
                    <span className="text-sm font-bold leading-tight">{user?.name || "Default User"}</span>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">{user?.roles?.[0]?.name?.replace('ROLE_', '') || "MEMBER"}</span>
                  </div>
                  <Avatar className="size-9 border-2 border-primary/20 shadow-lg shadow-primary/10">
                    <AvatarImage src={user?.image} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-black text-xs">
                       {(user?.name || user?.email || "U")[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass-card border-border mt-2 p-2 rounded-xl">
                <DropdownMenuLabel className="px-2 py-1.5 text-xs font-black uppercase text-muted-foreground/50">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem className="rounded-lg font-semibold focus:bg-primary/10 focus:text-primary cursor-pointer gap-2">
                   <Home className="size-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg font-semibold focus:bg-primary/10 focus:text-primary cursor-pointer gap-2">
                   <Settings className="size-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem onClick={() => logout()} className="rounded-lg font-semibold text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer gap-2">
                   <LogOut className="size-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-transparent custom-scrollbar">
          <div className="p-6 md:p-10 max-w-[1600px] mx-auto">
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-8"
            >
              
              {/* Row 1: Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                 <motion.div variants={item}>
                    <Card className="glass-card border-border border-l-4 border-l-primary/40 hover:scale-[1.02] transition-transform duration-300">
                       <CardHeader className="pb-2 space-y-0">
                          <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 flex items-center justify-between">
                             Security Score
                             <ShieldCheck className="size-3.5 text-primary" />
                          </CardTitle>
                       </CardHeader>
                       <CardContent>
                          <div className="text-3xl font-black tracking-tighter">98.4%</div>
                          <p className="text-[10px] text-emerald-500 font-bold mt-1">✓ Critical systems secured</p>
                       </CardContent>
                    </Card>
                 </motion.div>

                 <motion.div variants={item}>
                    <Card className="glass-card border-border border-l-4 border-l-indigo-500/40 hover:scale-[1.02] transition-transform duration-300">
                       <CardHeader className="pb-2 space-y-0">
                          <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 flex items-center justify-between">
                             Active Sessions
                             <Smartphone className="size-3.5 text-indigo-400" />
                          </CardTitle>
                       </CardHeader>
                       <CardContent>
                          <div className="text-3xl font-black tracking-tighter">02</div>
                          <p className="text-[10px] text-muted-foreground/60 font-medium mt-1">Devices currently active</p>
                       </CardContent>
                    </Card>
                 </motion.div>

                 <motion.div variants={item}>
                    <Card className="glass-card border-border border-l-4 border-l-amber-500/40 hover:scale-[1.02] transition-transform duration-300">
                       <CardHeader className="pb-2 space-y-0">
                          <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 flex items-center justify-between">
                             Audit Events
                             <Activity className="size-3.5 text-amber-500" />
                          </CardTitle>
                       </CardHeader>
                       <CardContent>
                          <div className="text-3xl font-black tracking-tighter">142</div>
                          <p className="text-[10px] text-emerald-500 font-bold mt-1">↑ 12% from last week</p>
                       </CardContent>
                    </Card>
                 </motion.div>

                 <motion.div variants={item}>
                    <Card className="glass-card border-border border-l-4 border-l-muted-foreground/40 hover:scale-[1.02] transition-transform duration-300">
                       <CardHeader className="pb-2 space-y-0">
                          <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 flex items-center justify-between">
                             Key Strength
                             <Key className="size-3.5 text-muted-foreground" />
                          </CardTitle>
                       </CardHeader>
                       <CardContent>
                          <div className="text-3xl font-black tracking-tighter">256-bit</div>
                          <p className="text-[10px] text-muted-foreground/60 font-medium mt-1">SHA-256 standard</p>
                       </CardContent>
                    </Card>
                 </motion.div>
              </div>

              {/* Row 2: Main Info Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left: Account Identity */}
                <motion.div variants={item} className="lg:col-span-1">
                   <Card className="glass-card h-full border-border">
                      <CardHeader>
                         <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2">
                            <Fingerprint className="size-5 text-primary" />
                            Identity Status
                         </CardTitle>
                         <CardDescription className="text-xs">Your system-level identity details</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                         <div className="p-4 rounded-2xl bg-card/20 border border-border/50">
                            <div className="text-[10px] uppercase tracking-widest font-black text-muted-foreground/50 mb-1">Unique Identifier</div>
                            <div className="text-sm font-mono break-all font-semibold opacity-80">{user?.id || "6f9a2-b8c1-4d32-9e51-f76d432"}</div>
                         </div>
                         <div className="p-4 rounded-2xl bg-card/20 border border-border/50">
                            <div className="text-[10px] uppercase tracking-widest font-black text-muted-foreground/50 mb-1">Verified Email</div>
                            <div className="text-sm font-semibold opacity-90">{user?.email || "admin@substring.com"}</div>
                         </div>
                         <div className="flex items-center gap-4">
                            <Badge className="bg-primary/20 text-primary border-primary/20 hover:bg-primary/30 px-3 py-1 font-bold">LOCAL PROVIDER</Badge>
                            <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 font-bold">MFA ENABLED</Badge>
                         </div>
                      </CardContent>
                   </Card>
                </motion.div>

                {/* Center/Right: Activity Log */}
                <motion.div variants={item} className="lg:col-span-2">
                   <Card className="glass-card h-full border-border">
                      <CardHeader className="flex flex-row items-center justify-between">
                         <div className="space-y-1">
                            <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2">
                               <Activity className="size-5 text-indigo-400" />
                               Recent Handshakes
                            </CardTitle>
                            <CardDescription className="text-xs">Live feed of authentication events</CardDescription>
                         </div>
                         <button className="text-[10px] font-black uppercase text-muted-foreground hover:text-primary transition-colors border border-border px-3 py-1.5 rounded-lg">Download Report</button>
                      </CardHeader>
                      <CardContent>
                         <div className="rounded-xl border border-border/40 overflow-hidden bg-card/5">
                            <Table>
                              <TableHeader className="bg-card/20">
                                <TableRow className="hover:bg-transparent border-border/50">
                                  <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">Event</TableHead>
                                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Metadata</TableHead>
                                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">Timestamp</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {[
                                  { event: "Login Success", meta: "192.168.1.1 • NY, US", time: "Just now", status: "success" },
                                  { event: "Token Refresh", meta: "192.168.1.1 • NY, US", time: "2h ago", status: "info" },
                                  { event: "Password Update", meta: "Internal Request", time: "5d ago", status: "warning" },
                                  { event: "Signup Completed", meta: "Local Auth Flow", time: "1mo ago", status: "success" },
                                ].map((row, i) => (
                                  <TableRow key={i} className="hover:bg-primary/5 border-border/20 transition-colors duration-500 ease-in-out cursor-default">
                                    <TableCell className="font-bold py-4">                                       <div className="flex items-center gap-2">
                                          <div className={cn("size-2 rounded-full", 
                                             row.status === 'success' ? "bg-emerald-500" : 
                                             row.status === 'warning' ? "bg-amber-500" : 
                                             "bg-primary"
                                          )} />
                                          {row.event}
                                       </div>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground font-medium">{row.meta}</TableCell>
                                    <TableCell className="text-right text-xs font-bold text-muted-foreground/60">{row.time}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                         </div>
                      </CardContent>
                   </Card>
                </motion.div>
              </div>

              {/* Row 3: Account Security */}
              <motion.div variants={item}>
                 <Card className="glass-card border-border border-t-4 border-t-emerald-500/40">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                       <div className="space-y-1">
                          <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
                             <Lock className="size-4 text-emerald-500" />
                             Security Hardening
                          </CardTitle>
                       </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
                       <div className="flex items-center gap-4 p-4 rounded-xl bg-card/20 border border-border/50 hover:border-primary/30 transition-colors cursor-pointer group">
                          <div className="size-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                             <ShieldCheck className="size-5" />
                          </div>
                          <div>
                             <div className="text-xs font-black uppercase tracking-widest text-muted-foreground/50">MFA Status</div>
                             <div className="text-sm font-bold">Protected</div>
                          </div>
                       </div>
                       <div className="flex items-center gap-4 p-4 rounded-xl bg-card/20 border border-border/50 hover:border-primary/30 transition-colors cursor-pointer group">
                          <div className="size-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                             <Key className="size-5" />
                          </div>
                          <div>
                             <div className="text-xs font-black uppercase tracking-widest text-muted-foreground/50">Active Tokens</div>
                             <div className="text-sm font-bold">03 Healthy</div>
                          </div>
                       </div>
                       <div className="flex items-center gap-4 p-4 rounded-xl bg-card/20 border border-border/50 hover:border-primary/30 transition-colors cursor-pointer group">
                          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                             <Lock className="size-5" />
                          </div>
                          <div>
                             <div className="text-xs font-black uppercase tracking-widest text-muted-foreground/50">Encryption</div>
                             <div className="text-sm font-bold">AES-256-GCM</div>
                          </div>
                       </div>
                       <div className="flex items-center gap-4 p-4 rounded-xl bg-card/20 border border-border/50 hover:border-primary/30 transition-colors cursor-pointer group">
                          <div className="size-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                             <Activity className="size-5" />
                          </div>
                          <div>
                             <div className="text-xs font-black uppercase tracking-widest text-muted-foreground/50">Alert Policy</div>
                             <div className="text-sm font-bold">High Sensitivity</div>
                          </div>
                       </div>
                    </CardContent>
                 </Card>
              </motion.div>

            </motion.div>
          </div>
        </main>

      </div>
    </div>
  )
}
