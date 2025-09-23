import AuthGuard from "@/components/auth/auth-guard"
import RecommendationsPage from "@/components/recommendations/recommandation-page"

export default function Recommendations() {
  return (
    <AuthGuard allowedRoles={["GUEST"]}>
      <RecommendationsPage />
    </AuthGuard>
  )
}
