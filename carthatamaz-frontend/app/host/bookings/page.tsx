import AuthGuard from "@/components/auth/auth-guard"
import RoleBasedHeader from "@/components/role-based-header"

export default function HostBookingsPage() {
  return (
    <AuthGuard allowedRoles={["OWNER"]}>
      <div className="min-h-screen bg-gray-50">
        <RoleBasedHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mes Réservations</h1>
            <p className="mt-2 text-gray-600">
              Gérez toutes vos réservations en cours et historiques
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Gestion des Réservations
              </h3>
              <p className="text-gray-600 mb-4">
                Cette section affichera toutes vos réservations actives et passées
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Fonctionnalité en développement
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
