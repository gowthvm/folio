import type { Skill, Milestone, Session } from '@/types/database'

export function exportSkillsToCSV(skills: (Skill & { milestones?: Milestone[] })[]) {
  const headers = ['Title', 'Category', 'Status', 'Progress %', 'Total XP', 'Streak Days', 'Target Date', 'Created At']
  
  const rows = skills.map(skill => {
    const progress = skill.milestones
      ? skill.milestones.filter(m => m.status === 'completed').reduce((sum, m) => sum + m.weight_percent, 0)
      : 0
    const status = progress === 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started'
    
    return [
      skill.title,
      skill.category,
      status,
      progress,
      skill.total_xp || 0,
      skill.streak_count || 0,
      skill.target_date || '—',
      skill.created_at,
    ]
  })

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `folio-skills-export-${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function exportSessionsToCSV(sessions: Session[], skillTitle: string) {
  const headers = ['Date', 'Note', 'Mood', 'Duration (minutes)']
  
  const rows = sessions.map(session => [
    session.created_at,
    session.note || '',
    session.mood || '',
    session.duration_minutes || 0,
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `folio-${skillTitle}-sessions-${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
