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

export interface WorkshopData {
  id: string
  title: string
  description: string
  speakerImage: string
  speakerName: string
  maxParticipants: number
  registrationUrl: string
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

// Load workshops data from JSON file
export async function loadWorkshops(filePath: string): Promise<WorkshopData[]> {
  const response = await fetch(filePath)
  if (!response.ok) throw new Error(`Failed to fetch workshops: ${response.status}`)
  const data = await response.json()
  return data as WorkshopData[]
}
