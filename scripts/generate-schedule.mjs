import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import ExcelJS from 'exceljs'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

const inputXlsx = path.join(projectRoot, 'public', 'devfest-armenia-2025 schedulelist.xlsx')
const outputJson = path.join(projectRoot, 'public', 'schedule.json')

function parseTime(timeStr) {
  // Parse time string like "10:20am - 10:40am" and return start and end times
  if (!timeStr) return { start: '', end: '' }
  const parts = String(timeStr).split(' - ')
  return {
    start: parts[0]?.trim() || '',
    end: parts[1]?.trim() || ''
  }
}

function normalizeRoom(room) {
  // Normalize room names to standardized identifiers
  if (!room) return 'unknown'
  const roomLower = String(room).toLowerCase()
  if (roomLower.includes('hall a')) return 'hall-a'
  if (roomLower.includes('hall b')) return 'hall-b'
  if (roomLower.includes('hall c')) return 'hall-c'
  return 'unknown'
}

function getRoomDisplayName(room) {
  if (!room) return 'Unknown'
  const roomLower = String(room).toLowerCase()
  if (roomLower.includes('hall a')) return 'Hall A'
  if (roomLower.includes('hall b')) return 'Hall B'
  if (roomLower.includes('hall c')) return 'Hall C'
  return String(room)
}

function timeToMinutes(timeStr) {
  // Convert time string like "10:20am" to minutes from midnight
  if (!timeStr) return 0
  const match = String(timeStr).toLowerCase().match(/(\d+):(\d+)(am|pm)/)
  if (!match) return 0
  let hours = parseInt(match[1], 10)
  const minutes = parseInt(match[2], 10)
  const period = match[3]
  if (period === 'pm' && hours !== 12) hours += 12
  if (period === 'am' && hours === 12) hours = 0
  return hours * 60 + minutes
}

async function readRowsWithHeaders(filePath) {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(filePath)
  const worksheet = workbook.worksheets[0]
  if (!worksheet) return []
  
  const headerRow = worksheet.getRow(1)
  const headers = []
  headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    headers[colNumber] = String(cell.value || '').trim()
  })

  const rows = []
  for (let r = 2; r <= worksheet.actualRowCount; r++) {
    const row = worksheet.getRow(r)
    if (!row || row.hasValues === false) continue
    const obj = {}
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const key = headers[colNumber]
      if (!key) return
      let value = cell.value
      if (value && typeof value === 'object' && 'text' in value) {
        value = value.text
      }
      obj[key] = value == null ? '' : value
    })
    // Skip empty rows
    const hasAny = Object.values(obj).some((v) => String(v).trim().length > 0)
    if (hasAny) rows.push(obj)
  }
  return rows
}

async function generate() {
  if (!fs.existsSync(inputXlsx)) {
    console.error(`Input file not found: ${inputXlsx}`)
    process.exit(1)
  }

  const rawData = await readRowsWithHeaders(inputXlsx)

  // Group sessions by time slot and room
  const timeSlots = new Set()
  const rooms = new Set()
  const sessions = []

  rawData.forEach((row) => {
    const { start, end } = parseTime(row['Time'])
    const roomId = normalizeRoom(row['Room'])
    const roomDisplay = getRoomDisplayName(row['Room'])
    
    timeSlots.add(start)
    rooms.add(roomId)

    // Create a unique ID using start time, room, and a sanitized title fragment
    const titleSlug = String(row['Title'] || 'session')
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 30)
    
    sessions.push({
      id: `${start}-${roomId}-${titleSlug}`.replace(/[^a-z0-9-]/gi, '-').toLowerCase(),
      title: String(row['Title'] || 'TBA').trim(),
      speaker: String(row['Speakers'] || '').trim(),
      startTime: start,
      endTime: end,
      room: roomId,
      roomDisplay: roomDisplay,
      startMinutes: timeToMinutes(start),
      endMinutes: timeToMinutes(end),
      duration: timeToMinutes(end) - timeToMinutes(start)
    })
  })

  // Sort time slots chronologically
  const sortedTimeSlots = Array.from(timeSlots).sort((a, b) => timeToMinutes(a) - timeToMinutes(b))
  
  // Get unique rooms sorted
  const sortedRooms = Array.from(rooms).sort()

  // Create schedule object
  const schedule = {
    eventDate: '2025-12-20',
    eventName: 'DevFest Armenia 2025',
    disclaimer: 'This schedule is not final and may be subject to change.',
    timeSlots: sortedTimeSlots,
    rooms: sortedRooms.map(id => ({
      id,
      name: id === 'hall-a' ? 'Hall A' : id === 'hall-b' ? 'Hall B' : id === 'hall-c' ? 'Hall C' : id
    })),
    sessions: sessions
  }

  fs.writeFileSync(outputJson, JSON.stringify(schedule, null, 2))
  console.log(`Wrote ${sessions.length} sessions to ${outputJson}`)
}

generate().catch((err) => {
  console.error(err)
  process.exit(1)
})
