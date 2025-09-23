import AuthGuard from "@/components/auth/auth-guard"
import BookingsPage from "@/components/bookings/bookings-page"

export default function Bookings() {
  return (
    <AuthGuard allowedRoles={["GUEST"]}>
      <BookingsPage />
    </AuthGuard>
  )
}
