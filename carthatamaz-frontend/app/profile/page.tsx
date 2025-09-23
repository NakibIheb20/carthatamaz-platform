import AuthGuard from "@/components/auth/auth-guard"
import ProfilePage from "@/components/profile/profile-page"

export default function Profile() {
  return (
    <AuthGuard allowedRoles={["ADMIN", "OWNER", "GUEST"]}>
      <ProfilePage />
    </AuthGuard>
  )
}
