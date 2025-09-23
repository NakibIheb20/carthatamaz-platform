import { Suspense } from "react"
import SettingsPage from "@/components/settings/settings-page"

export default function Settings() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
          </div>
        }
      >
        <SettingsPage />
      </Suspense>
    </div>
  )
}
