export interface SessionData {
  sessionId: string
  title: string
  speaker: string
  photo: string
  content: string
  categories: string[]
  status: string
}

export interface SpeakerData {
  speakerId: string
  name: string
  position: string
  photo: string
  content: string
}

// Load pre-generated JSON (public/data.json) and return sessions and speakers data
export async function parseExcelData(filePath: string): Promise<{
  sessions: Record<string, SessionData>
  speakers: Record<string, SpeakerData>
}> {
  const response = await fetch(filePath)
  if (!response.ok) throw new Error(`Failed to fetch data: ${response.status}`)
  const data = await response.json()
  return {
    sessions: (data.sessions ?? {}) as Record<string, SessionData>,
    speakers: (data.speakers ?? {}) as Record<string, SpeakerData>,
  }
}
