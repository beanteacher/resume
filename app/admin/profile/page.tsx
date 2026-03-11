'use client'

import { AdminPageTitle } from '@/components/admin/AdminPageTitle'
import { ProfileForm } from '@/components/admin/ProfileForm'

export default function AdminProfilePage() {
  return (
    <div>
      <AdminPageTitle title="프로필" />
      <ProfileForm />
    </div>
  )
}
