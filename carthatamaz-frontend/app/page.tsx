import HomePage from "@/components/home-page"
import RoleBasedHeader from "@/components/role-based-header"

export default function Home() {
  return (
    <div>
      <RoleBasedHeader />
      <HomePage />
    </div>
  )
}
