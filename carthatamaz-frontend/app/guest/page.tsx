import HomePage from "@/components/home-page"
import RoleBasedHeader from "@/components/role-based-header"

export default function GuestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <RoleBasedHeader />
      <HomePage />
    </div>
  )
}
