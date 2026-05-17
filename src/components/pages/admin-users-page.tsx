import { useEffect, useMemo, useState } from "react"
import { Eye, Trash2, Shield, Search } from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"
import { useAuth } from "@/components/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toastApiError } from "@/lib/toast-api-error"

type AdminUser = {
  id: string
  name?: string
  email: string
  image?: string
  provider?: string
  roles: Array<{ name: string }>
  createdAt?: string
  enabled?: boolean
}

const PAGE_SIZE = 8

export default function AdminUsersPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<AdminUser | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<AdminUser | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const isRoot = user?.roles.some((role) => role.name === "ROLE_ROOT") ?? false

  useEffect(() => {
    let mounted = true
    const loadUsers = async () => {
      try {
        const res = await api.get("/admin/users")
        if (!mounted) return
        const list = Array.isArray(res.data) ? (res.data as AdminUser[]) : []
        setUsers(list)
      } catch (error) {
        toastApiError(error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }
    loadUsers()
    return () => {
      mounted = false
    }
  }, [])

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return users
    return users.filter((item) => item.email.toLowerCase().includes(query))
  }, [users, search])

  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount)
    }
  }, [page, pageCount])

  const pagedUsers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredUsers.slice(start, start + PAGE_SIZE)
  }, [filteredUsers, currentPage])

  const stats = useMemo(() => {
    const total = users.length
    const active = users.filter((item) => item.enabled !== false).length
    const oauth = users.filter((item) => item.provider && item.provider !== "local").length
    const admin = users.filter((item) =>
      item.roles.some((role) => role.name === "ROLE_ADMIN" || role.name === "ROLE_ROOT")
    ).length
    return { total, active, oauth, admin }
  }, [users])

  const onToggleEnabled = async (target: AdminUser) => {
    const previous = users
    const newStatus = !(target.enabled !== false)
    
    // Optimistic update
    setUsers((prev) =>
      prev.map((item) =>
        item.id === target.id ? { ...item, enabled: newStatus } : item
      )
    )

    try {
      await api.patch(`/admin/users/${target.id}`, { enabled: newStatus })
      toast.success(`User ${newStatus ? 'enabled' : 'disabled'}`)
    } catch (error) {
      setUsers(previous)
      toastApiError(error)
    }
  }

  const onDeleteUser = async (target: AdminUser) => {
    if (!isRoot || deletingId) return

    const previous = users
    setDeletingId(target.id)
    setUsers((prev) => prev.filter((item) => item.id !== target.id))
    try {
      await api.delete(`/root/delete/${target.id}`)
      toast.success("User deleted")
      setConfirmDelete(null)
    } catch (error) {
      setUsers(previous)
      toastApiError(error)
    } finally {
      setDeletingId(null)
    }
  }

  const createdLabel = (value?: string) => {
    if (!value) return "Unknown"
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "Unknown"
    return date.toLocaleDateString()
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card variant="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-black">{stats.total}</CardContent>
        </Card>
        <Card variant="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Active Users</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-black">{stats.active}</CardContent>
        </Card>
        <Card variant="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">OAuth Users</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-black">{stats.oauth}</CardContent>
        </Card>
        <Card variant="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Admin Users</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-black">{stats.admin}</CardContent>
        </Card>
      </div>

      <Card variant="glass">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-black uppercase tracking-tight">
              <Shield className="size-4" />
              User Management
            </CardTitle>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search by email..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading users...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No users match this search.</p>
          ) : (
            <>
              <div className="rounded-xl border border-border/50 overflow-hidden bg-card/5 backdrop-blur-sm">
                <Table>
                  <TableHeader className="bg-card/20">
                    <TableRow className="hover:bg-transparent border-border/50">
                      <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">Avatar</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest">Name</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest">Email</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest">Provider</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest">Roles</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest">Created</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest">Status</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagedUsers.map((item) => (
                      <TableRow key={item.id} className="hover:bg-primary/5 border-border/20 transition-colors duration-500 ease-in-out">
                        <TableCell>
                          <Avatar className="size-8 border border-primary/20">
                            <AvatarImage src={item.image} />
                            <AvatarFallback className="bg-primary/10 text-primary font-black text-[10px]">{(item.name || item.email)[0]?.toUpperCase()}</AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-bold text-xs">{item.name || "Unnamed"}</TableCell>
                        <TableCell className="font-mono text-[10px] opacity-70">{item.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">{item.provider || "local"}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {item.roles.map((role) => (
                              <Badge key={role.name} className="text-[9px] bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-1.5 py-0 font-black">
                                {role.name.replace("ROLE_", "")}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-[10px] font-semibold opacity-60">{createdLabel(item.createdAt)}</TableCell>
                        <TableCell>
                          <Badge variant={item.enabled === false ? "destructive" : "secondary"} className="text-[9px] font-black px-1.5 py-0">
                            {item.enabled === false ? "DISABLED" : "ACTIVE"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="xs"
                              onClick={() => setSelected(item)}
                              className="rounded-full"
                            >
                              <Eye className="size-3" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="xs"
                              onClick={() => onToggleEnabled(item)}
                              className="rounded-full"
                            >
                              {item.enabled === false ? "Enable" : "Disable"}
                            </Button>
                            {isRoot && (
                              <Button
                                variant="destructive"
                                size="xs"
                                onClick={() => setConfirmDelete(item)}
                                disabled={deletingId === item.id}
                                className="rounded-full"
                              >
                                <Trash2 className="size-3" />
                                Delete
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                  Page {currentPage} of {pageCount}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="xs"
                    variant="outline"
                    disabled={currentPage <= 1}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    className="rounded-full"
                  >
                    Previous
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    disabled={currentPage >= pageCount}
                    onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
                    className="rounded-full"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {selected && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <Card variant="glass" className="w-full max-w-xl p-6 overflow-visible">
            <h3 className="text-lg font-black uppercase tracking-tight">User Details</h3>
            <div className="mt-4 space-y-2 text-sm">
              <p><span className="font-bold text-muted-foreground/60 uppercase text-[10px] tracking-widest mr-2">ID:</span> <span className="font-mono">{selected.id}</span></p>
              <p><span className="font-bold text-muted-foreground/60 uppercase text-[10px] tracking-widest mr-2">Name:</span> {selected.name || "Unnamed"}</p>
              <p><span className="font-bold text-muted-foreground/60 uppercase text-[10px] tracking-widest mr-2">Email:</span> {selected.email}</p>
              <p><span className="font-bold text-muted-foreground/60 uppercase text-[10px] tracking-widest mr-2">Provider:</span> <Badge variant="outline" className="text-[10px]">{selected.provider || "local"}</Badge></p>
              <p><span className="font-bold text-muted-foreground/60 uppercase text-[10px] tracking-widest mr-2">Roles:</span> {selected.roles.map((r) => r.name.replace('ROLE_', '')).join(", ")}</p>
              <p><span className="font-bold text-muted-foreground/60 uppercase text-[10px] tracking-widest mr-2">Created:</span> {createdLabel(selected.createdAt)}</p>
              <p><span className="font-bold text-muted-foreground/60 uppercase text-[10px] tracking-widest mr-2">Status:</span> 
                <Badge variant={selected.enabled === false ? "destructive" : "secondary"} className="ml-1 text-[9px] font-black">
                  {selected.enabled === false ? "DISABLED" : "ACTIVE"}
                </Badge>
              </p>
            </div>
            <div className="mt-8 flex justify-end">
              <Button variant="outline" onClick={() => setSelected(null)} className="rounded-full">Dismiss Handshake</Button>
            </div>
          </Card>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <Card variant="glass" className="w-full max-w-md p-6 border-destructive/40 overflow-visible">
            <h3 className="text-lg font-black uppercase tracking-tight text-destructive">Decommission User</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Terminate identity <span className="font-bold text-foreground">{confirmDelete.email}</span>? This action is permanent and cannot be reversed.
            </p>
            <div className="mt-8 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setConfirmDelete(null)} disabled={deletingId === confirmDelete.id} className="rounded-full">
                Abort
              </Button>
              <Button
                variant="destructive"
                loading={deletingId === confirmDelete.id}
                loadingLabel="Decommissioning..."
                onClick={() => onDeleteUser(confirmDelete)}
                className="rounded-full"
              >
                Confirm Termination
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
