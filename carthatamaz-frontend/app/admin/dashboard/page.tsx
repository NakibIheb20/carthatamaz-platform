import AuthGuard from "@/components/auth/auth-guard"
import AdminDashboard from "@/components/admin/admin-dashboard"
import RoleBasedHeader from "@/components/role-based-header"

export default function AdminDashboardPage() {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-gray-50">
        <RoleBasedHeader />
        <AdminDashboard />
      </div>
    </AuthGuard>
  )
}
