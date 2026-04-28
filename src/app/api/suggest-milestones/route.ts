import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

const SYSTEM_PROMPT = `You are a skill coach. Given a skill title and category, return a JSON array of 5-8 milestone objects. Each object: { title, description, estimated_minutes, weight_percent }. Weights must sum to 100. Be specific and practical. Return only raw JSON, no markdown, no explanation.`

const FALLBACK_MILESTONES: Record<string, { title: string; description: string; estimated_minutes: number; weight_percent: number }[]> = {
  music: [
    { title: 'Understand the basics', description: 'Learn fundamental concepts and techniques', estimated_minutes: 60, weight_percent: 20 },
    { title: 'Learn the first section', description: 'Master the initial portion of the skill', estimated_minutes: 60, weight_percent: 20 },
    { title: 'Practice slowly', description: 'Practice at a comfortable pace', estimated_minutes: 45, weight_percent: 20 },
    { title: 'Build up speed', description: 'Gradually increase speed and fluency', estimated_minutes: 45, weight_percent: 20 },
    { title: 'Full run-through', description: 'Perform the complete skill from start to finish', estimated_minutes: 30, weight_percent: 20 },
  ],
  fitness: [
    { title: 'Learn proper form', description: 'Understand correct technique and posture', estimated_minutes: 45, weight_percent: 20 },
    { title: 'Build foundation', description: 'Start with basic exercises', estimated_minutes: 60, weight_percent: 20 },
    { title: 'Increase intensity', description: 'Gradually increase difficulty', estimated_minutes: 60, weight_percent: 20 },
    { title: 'Push limits', description: 'Challenge yourself further', estimated_minutes: 45, weight_percent: 20 },
    { title: 'Complete first run', description: 'Finish a full session successfully', estimated_minutes: 30, weight_percent: 20 },
  ],
  learning: [
    { title: 'Introduction', description: 'Gather resources and understand basics', estimated_minutes: 60, weight_percent: 20 },
    { title: 'Core concepts', description: 'Master fundamental ideas', estimated_minutes: 60, weight_percent: 20 },
    { title: 'Practical application', description: 'Apply knowledge to real problems', estimated_minutes: 60, weight_percent: 20 },
    { title: 'Advanced topics', description: 'Explore advanced content', estimated_minutes: 45, weight_percent: 20 },
    { title: 'Review and complete', description: 'Final review and completion', estimated_minutes: 30, weight_percent: 20 },
  ],
  creative: [
    { title: 'Gather inspiration', description: 'Research and collect ideas', estimated_minutes: 45, weight_percent: 20 },
    { title: 'First draft', description: 'Create initial version', estimated_minutes: 60, weight_percent: 20 },
    { title: 'Refine and iterate', description: 'Improve and polish work', estimated_minutes: 60, weight_percent: 20 },
    { title: 'Add details', description: 'Add finishing touches', estimated_minutes: 45, weight_percent: 20 },
    { title: 'Final piece', description: 'Complete the final version', estimated_minutes: 30, weight_percent: 20 },
  ],
  other: [
    { title: 'Getting started', description: 'Begin learning the basics', estimated_minutes: 60, weight_percent: 20 },
    { title: 'Building competency', description: 'Develop basic skills', estimated_minutes: 60, weight_percent: 20 },
    { title: 'Practicing', description: 'Regular practice sessions', estimated_minutes: 45, weight_percent: 20 },
    { title: 'Refining', description: 'Improve technique', estimated_minutes: 45, weight_percent: 20 },
    { title: 'Completion', description: 'Finish the learning path', estimated_minutes: 30, weight_percent: 20 },
  ],
}

function getFallbackMilestones(category: string) {
  const key = category.toLowerCase() as keyof typeof FALLBACK_MILESTONES
  return FALLBACK_MILESTONES[key] || FALLBACK_MILESTONES.other
}

async function checkRateLimit(userId: string): Promise<boolean> {
  const supabase = createClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('ai_requests_this_hour')
    .eq('id', userId)
    .single()

  const currentCount = profile?.ai_requests_this_hour || 0
  const limit = 10

  if (currentCount >= limit) {
    return false
  }

  await supabase
    .from('profiles')
    .update({ ai_requests_this_hour: currentCount + 1 })
    .eq('id', userId)

  return true
}

const TIMEOUT_MS = 8000

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const hasRateLimit = await checkRateLimit(session.user.id)
    if (!hasRateLimit) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    const { title, category } = await req.json()

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    if (!apiKey) {
      console.warn('OpenRouter API key not configured, using fallback')
      return NextResponse.json({
        milestones: getFallbackMilestones(category),
        isFallback: true,
      })
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': appUrl,
          'X-Title': 'Folio',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'anthropic/claude-sonnet-4-5',
          stream: true,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: `Skill: ${title}. Category: ${category}.` },
          ],
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      const stream = new ReadableStream({
        async start(streamController) {
          let buffer = ''

          try {
            while (true) {
              const { done, value } = await reader.read()
              if (done) break

              const chunk = decoder.decode(value, { stream: true })
              const lines = chunk.split('\n').filter(line => line.startsWith('data: '))

              for (const line of lines) {
                const data = line.slice(6)
                if (data === '[DONE]') continue

                try {
                  const json = JSON.parse(data)
                  const content = json.choices?.[0]?.delta?.content || ''
                  buffer += content

                  streamController.enqueue(encoder.encode(content))
                } catch {
                  // Ignore parse errors
                }
              }
            }

            const jsonMatch = buffer.match(/\[[\s\S]*\]/)
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0])
              if (Array.isArray(parsed) && parsed.length > 0) {
                streamController.close()
                return
              }
            }

            throw new Error('Invalid response format')
          } catch (error) {
            console.error('Streaming error:', error)
            const fallback = getFallbackMilestones(category)
            streamController.enqueue(encoder.encode(JSON.stringify({ milestones: fallback, isFallback: true, timeout: true })))
            streamController.close()
          }
        },
      })

      return new NextResponse(stream, {
        headers: {
          'Content-Type': 'application/json',
          'Transfer-Encoding': 'chunked',
        },
      })
    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      
      if (fetchError.name === 'AbortError') {
        const fallback = getFallbackMilestones(category)
        return NextResponse.json({
          milestones: fallback,
          isFallback: true,
          timeout: true,
          message: 'Request timed out. Using fallback milestones.',
        })
      }
      
      throw fetchError
    }
  } catch (error) {
    console.error('Suggest milestones error:', error)
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    )
  }
}