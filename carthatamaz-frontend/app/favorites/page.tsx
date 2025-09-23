import AuthGuard from "@/components/auth/auth-guard"
import FavoritesPage from "@/components/favorites/favorites-page"

export default function Favorites() {
  return (
    <AuthGuard allowedRoles={["GUEST"]}>
      <FavoritesPage />
    </AuthGuard>
  )
}
