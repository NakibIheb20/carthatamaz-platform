import AuthGuard from "@/components/auth/auth-guard"
import RoleBasedHeader from "@/components/role-based-header"

export default function HostListingsPage() {
  return (
    <AuthGuard allowedRoles={["OWNER"]}>
      <div className="min-h-screen bg-gray-50">
        <RoleBasedHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mes Propriétés</h1>
            <p className="mt-2 text-gray-600">
              Gérez vos hébergements, ajoutez de nouvelles propriétés et modifiez les existantes
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm0 0V5a2 2 0 012-2h6l2 2h6a2 2 0 012 2v1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Gestion des Propriétés
              </h3>
              <p className="text-gray-600 mb-4">
                Ici vous pourrez ajouter, modifier et gérer toutes vos propriétés
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Ajouter une nouvelle propriété
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
