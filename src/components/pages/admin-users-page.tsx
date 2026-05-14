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

  const onToggleEnabled = (target: AdminUser) => {
    setUsers((prev) =>
      prev.map((item) =>
        item.id === target.id ? { ...item, enabled: !(item.enabled !== false) } : item
      )
    )
    toast.success("Account status updated locally")
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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-black">{stats.total}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Active Users</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-black">{stats.active}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">OAuth Users</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-black">{stats.oauth}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Admin Users</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-black">{stats.admin}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-black">
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
              <div className="rounded-xl border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Avatar</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagedUsers.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Avatar className="size-8">
                            <AvatarImage src={item.image} />
                            <AvatarFallback>{(item.name || item.email)[0]?.toUpperCase()}</AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-semibold">{item.name || "Unnamed"}</TableCell>
                        <TableCell className="font-mono text-xs">{item.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.provider || "local"}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {item.roles.map((role) => (
                              <Badge key={role.name} className="text-[10px]">
                                {role.name.replace("ROLE_", "")}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{createdLabel(item.createdAt)}</TableCell>
                        <TableCell>
                          <Badge variant={item.enabled === false ? "destructive" : "secondary"}>
                            {item.enabled === false ? "Disabled" : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelected(item)}
                            >
                              <Eye className="size-4" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onToggleEnabled(item)}
                            >
                              {item.enabled === false ? "Enable" : "Disable"}
                            </Button>
                            {isRoot && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setConfirmDelete(item)}
                                disabled={deletingId === item.id}
                              >
                                <Trash2 className="size-4" />
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
                <p className="text-xs text-muted-foreground">
                  Page {currentPage} of {pageCount}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={currentPage <= 1}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={currentPage >= pageCount}
                    onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
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
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-xl rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-black">User Details</h3>
            <div className="mt-4 space-y-2 text-sm">
              <p><span className="font-semibold">ID:</span> {selected.id}</p>
              <p><span className="font-semibold">Name:</span> {selected.name || "Unnamed"}</p>
              <p><span className="font-semibold">Email:</span> {selected.email}</p>
              <p><span className="font-semibold">Provider:</span> {selected.provider || "local"}</p>
              <p><span className="font-semibold">Roles:</span> {selected.roles.map((r) => r.name).join(", ")}</p>
              <p><span className="font-semibold">Created:</span> {selected.createdAt || "Unknown"}</p>
              <p><span className="font-semibold">Status:</span> {selected.enabled === false ? "Disabled" : "Active"}</p>
            </div>
            <div className="mt-5 flex justify-end">
              <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-xl border border-destructive/40 bg-card p-6">
            <h3 className="text-lg font-black text-destructive">Confirm User Deletion</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Delete user <span className="font-semibold text-foreground">{confirmDelete.email}</span>? This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConfirmDelete(null)} disabled={deletingId === confirmDelete.id}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                loading={deletingId === confirmDelete.id}
                loadingLabel="Deleting..."
                onClick={() => onDeleteUser(confirmDelete)}
              >
                Delete User
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
