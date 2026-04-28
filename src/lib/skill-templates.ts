export interface SkillTemplate {
  id: string
  title: string
  category: string
  emoji: string
  description: string
  milestones: Array<{
    title: string
    weight: number
    estimated_hours?: number
  }>
  target_days?: number
}

export const SKILL_TEMPLATES: SkillTemplate[] = [
  {
    id: 'guitar-fingerpicking',
    title: 'Learn Fingerpicking — Classical Guitar',
    category: 'Music',
    emoji: '🎸',
    description: 'Master classical guitar fingerpicking techniques from basic patterns to advanced pieces.',
    target_days: 90,
    milestones: [
      { title: 'Learn basic chord shapes (C, G, Am, F)', weight: 10, estimated_hours: 5 },
      { title: 'Master thumb independence', weight: 15, estimated_hours: 8 },
      { title: 'Practice Travis picking pattern', weight: 15, estimated_hours: 10 },
      { title: 'Learn alternating bass technique', weight: 15, estimated_hours: 12 },
      { title: 'Play through first complete song', weight: 20, estimated_hours: 15 },
      { title: 'Master arpeggio patterns', weight: 15, estimated_hours: 10 },
      { title: 'Perform piece from memory', weight: 10, estimated_hours: 8 },
    ]
  },
  {
    id: 'python-programming',
    title: 'Learn Python Programming',
    category: 'Learning',
    emoji: '🐍',
    description: 'Go from zero to building real applications with Python.',
    target_days: 60,
    milestones: [
      { title: 'Set up development environment', weight: 5, estimated_hours: 2 },
      { title: 'Learn basic syntax and variables', weight: 10, estimated_hours: 5 },
      { title: 'Master control flow (if/else, loops)', weight: 15, estimated_hours: 8 },
      { title: 'Understand functions and modules', weight: 15, estimated_hours: 10 },
      { title: 'Learn data structures (lists, dicts, sets)', weight: 15, estimated_hours: 12 },
      { title: 'Build first CLI application', weight: 20, estimated_hours: 15 },
      { title: 'Learn basic OOP concepts', weight: 10, estimated_hours: 8 },
      { title: 'Deploy first project', weight: 10, estimated_hours: 5 },
    ]
  },
  {
    id: 'running-5k',
    title: 'Train for 5K Race',
    category: 'Fitness',
    emoji: '🏃',
    description: 'Build endurance and speed to complete your first 5K race.',
    target_days: 56,
    milestones: [
      { title: 'Complete baseline 1-mile walk/jog', weight: 10, estimated_hours: 3 },
      { title: 'Run 2 miles without stopping', weight: 15, estimated_hours: 8 },
      { title: 'Build to 3-mile distance', weight: 15, estimated_hours: 12 },
      { title: 'Incorporate interval training', weight: 15, estimated_hours: 10 },
      { title: 'Run 5K at comfortable pace', weight: 20, estimated_hours: 15 },
      { title: 'Improve pace by 30 seconds/mile', weight: 15, estimated_hours: 12 },
      { title: 'Complete practice 5K race', weight: 10, estimated_hours: 5 },
    ]
  },
  {
    id: 'watercolor-painting',
    title: 'Learn Watercolor Painting',
    category: 'Creative',
    emoji: '🎨',
    description: 'Develop watercolor skills from basic techniques to finished artworks.',
    target_days: 45,
    milestones: [
      { title: 'Master basic wash techniques', weight: 10, estimated_hours: 4 },
      { title: 'Learn color mixing and theory', weight: 15, estimated_hours: 6 },
      { title: 'Practice brush control', weight: 15, estimated_hours: 8 },
      { title: 'Create first simple landscape', weight: 20, estimated_hours: 10 },
      { title: 'Learn wet-on-wet technique', weight: 15, estimated_hours: 8 },
      { title: 'Complete still life painting', weight: 15, estimated_hours: 10 },
      { title: 'Finish portfolio piece', weight: 10, estimated_hours: 6 },
    ]
  },
  {
    id: 'creative-writing',
    title: 'Write First Short Story',
    category: 'Creative',
    emoji: '✍️',
    description: 'Develop writing skills and complete your first short story.',
    target_days: 30,
    milestones: [
      { title: 'Develop story concept and outline', weight: 15, estimated_hours: 3 },
      { title: 'Create character profiles', weight: 10, estimated_hours: 2 },
      { title: 'Write first draft (500 words/day)', weight: 25, estimated_hours: 15 },
      { title: 'Complete full first draft', weight: 20, estimated_hours: 10 },
      { title: 'Self-edit and revise', weight: 15, estimated_hours: 8 },
      { title: 'Get feedback and final polish', weight: 15, estimated_hours: 5 },
    ]
  },
  {
    id: 'meditation-practice',
    title: 'Build Daily Meditation Habit',
    category: 'Fitness',
    emoji: '🧘',
    description: 'Establish a consistent meditation practice for mental wellness.',
    target_days: 21,
    milestones: [
      { title: 'Complete 3-day streak (5 min sessions)', weight: 15, estimated_hours: 1 },
      { title: 'Reach 7-day streak', weight: 20, estimated_hours: 2 },
      { title: 'Extend sessions to 10 minutes', weight: 15, estimated_hours: 2 },
      { title: 'Complete 14-day streak', weight: 20, estimated_hours: 3 },
      { title: 'Try guided meditation app', weight: 10, estimated_hours: 2 },
      { title: 'Reach 21-day streak (habit formed)', weight: 20, estimated_hours: 3 },
    ]
  },
]

export function getTemplateById(id: string): SkillTemplate | undefined {
  return SKILL_TEMPLATES.find(t => t.id === id)
}

export function getTemplatesByCategory(category: string): SkillTemplate[] {
  return SKILL_TEMPLATES.filter(t => t.category === category)
}

export function getAllCategories(): string[] {
  return Array.from(new Set(SKILL_TEMPLATES.map(t => t.category)))
}
