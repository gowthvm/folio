import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SkillDetailClient } from './skill-detail-client'

export default async function SkillDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch skill with milestones and sessions
  const { data: skill } = await supabase
    .from('skills')
    .select(`
      *,
      milestones (
        *,
        sessions (*)
      )
    `)
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!skill) {
    redirect('/dashboard')
  }

  return <SkillDetailClient skillId={params.id} initialSkill={skill} />
}
