import HostDashboard from "@/components/host/host-dashboard"
import RoleBasedHeader from "@/components/role-based-header"

export default function HostPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <RoleBasedHeader />
      <HostDashboard />
    </div>
  )
}
