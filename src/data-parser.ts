import * as XLSX from 'xlsx'

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

interface RawSessionData {
  'Session Id': number
  'Title': string
  'Description': string
  'Owner': string
  'Owner Email': string
  'Status': string
  'Date Submitted': number
  'Speaker Id': string
  'FirstName': string
  'LastName': string
  'Email': string
  'TagLine': string
  'Bio': string
  'Profile Picture': string
}

// Parse Excel file and return sessions and speakers data
export async function parseExcelData(filePath: string): Promise<{
  sessions: Record<string, SessionData>
  speakers: Record<string, SpeakerData>
}> {
  const response = await fetch(filePath)
  const arrayBuffer = await response.arrayBuffer()
  const workbook = XLSX.read(arrayBuffer, { type: 'array' })
  
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]
  const rawData = XLSX.utils.sheet_to_json<RawSessionData>(worksheet)
  
  const sessions: Record<string, SessionData> = {}
  const speakers: Record<string, SpeakerData> = {}
  const speakerSet = new Set<string>()
  
  // Process each session
  rawData.forEach((row) => {
    const speakerId = createSpeakerId(row.FirstName, row.LastName)
    const sessionId = createSessionId(row.Title)
    
    // Create session entry
    sessions[sessionId] = {
      sessionId: sessionId,
      title: row.Title,
      speaker: `${row.FirstName} ${row.LastName} - ${row.TagLine}`,
      photo: row['Profile Picture'],
      content: formatSessionContent(row),
      categories: extractCategories(row.Status),
      status: row.Status
    }
    
    // Create speaker entry (avoid duplicates)
    if (!speakerSet.has(speakerId)) {
      speakerSet.add(speakerId)
      speakers[speakerId] = {
        speakerId: speakerId,
        name: `${row.FirstName} ${row.LastName}`,
        position: row.TagLine,
        photo: row['Profile Picture'],
        content: formatSpeakerContent(row)
      }
    }
  })
  
  return { sessions, speakers }
}

// Create a URL-friendly session ID from title
function createSessionId(title: string): string {
  return title.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// Create a URL-friendly speaker ID from name
function createSpeakerId(firstName: string, lastName: string): string {
  return `${firstName}-${lastName}`.toLowerCase()
    .replace(/[^\w-]/g, '')
}

// Format session content for modal display
function formatSessionContent(row: RawSessionData): string {
  const categories = extractCategories(row.Status)
  const categoryTags = categories.map(cat => {
    const colors = getCategoryColors(cat)
    return `<span class="px-3 py-1 ${colors} rounded-full text-sm font-medium">${cat}</span>`
  }).join('\n            ')
  
  const description = row.Description.replace(/\r\n/g, '\n')
    .split('\n')
    .map(paragraph => paragraph.trim())
    .filter(p => p.length > 0)
    .map(paragraph => {
      // Check if it's a URL
      if (paragraph.startsWith('http://') || paragraph.startsWith('https://')) {
        return `<p class="mb-4">
          <a href="${paragraph}" target="_blank" rel="noopener noreferrer" class="text-google-blue hover:underline">${paragraph}</a>
        </p>`
      }
      return `<p class="mb-4">${paragraph}</p>`
    })
    .join('\n        ')
  
  return `
      <div class="flex flex-col md:flex-row gap-6 mb-6">
        <div class="flex-shrink-0">
          <img src="${row['Profile Picture']}" alt="${row.FirstName} ${row.LastName}" class="w-32 h-32 rounded-full object-cover">
        </div>
        <div>
          <p class="text-lg font-semibold mb-2">Speaker: ${row.FirstName} ${row.LastName} - ${row.TagLine}</p>
          <div class="flex flex-wrap gap-2">
            ${categoryTags}
          </div>
        </div>
      </div>
      <div class="prose dark:prose-invert max-w-none">
        ${description}
      </div>
    `
}

// Format speaker content for modal display
function formatSpeakerContent(row: RawSessionData): string {
  const bioLines = row.Bio.replace(/\r\n/g, '\n')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
  
  let bioHtml = ''
  let inList = false
  
  bioLines.forEach(line => {
    if (line.startsWith('-')) {
      if (!inList) {
        bioHtml += '<ul class="list-disc list-inside space-y-2 mt-4">\n'
        inList = true
      }
      bioHtml += `          <li>${line.substring(1).trim()}</li>\n`
    } else {
      if (inList) {
        bioHtml += '        </ul>\n'
        inList = false
      }
      bioHtml += `        <p>${line}</p>\n`
    }
  })
  
  if (inList) {
    bioHtml += '        </ul>\n'
  }
  
  return `
      <div class="flex flex-col md:flex-row gap-6 mb-6">
        <div class="flex-shrink-0">
          <img src="${row['Profile Picture']}" alt="${row.FirstName} ${row.LastName}" class="w-48 h-48 rounded-full object-cover">
        </div>
        <div>
          <h3 class="text-2xl font-bold mb-2">${row.FirstName} ${row.LastName}</h3>
          <p class="text-google-blue font-semibold text-lg mb-4">${row.TagLine}</p>
        </div>
      </div>
      <div class="text-gray-600 dark:text-gray-400 space-y-3">
        ${bioHtml}
      </div>
    `
}

// Extract categories from status and title
function extractCategories(status: string): string[] {
  const categories = [status]
  
  // You can add logic here to extract more categories from the title or description
  // For now, we'll just use the status
  
  return categories
}

// Get Tailwind CSS classes for category tags
function getCategoryColors(category: string): string {
  const categoryLower = category.toLowerCase()
  
  if (categoryLower === 'accepted') {
    return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
  } else if (categoryLower.includes('android')) {
    return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
  } else if (categoryLower.includes('firebase')) {
    return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
  } else if (categoryLower.includes('production')) {
    return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
  } else {
    return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
  }
}
