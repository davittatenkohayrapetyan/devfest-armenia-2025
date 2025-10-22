import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import ExcelJS from 'exceljs'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

const inputXlsx = path.join(projectRoot, 'public', 'devfest-armenia-2025-flattened-sessions.xlsx')
const outputJson = path.join(projectRoot, 'public', 'data.json')

function createSessionId(title) {
  return String(title || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function createSpeakerId(firstName, lastName) {
  return `${String(firstName || '')}-${String(lastName || '')}`
    .toLowerCase()
    .replace(/[^\w-]/g, '')
}

function extractCategories(status) {
  const categories = [String(status || '')]
  return categories
}

function getCategoryColors(category) {
  const categoryLower = String(category || '').toLowerCase()
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

function formatSessionContent(row) {
  const categories = extractCategories(row['Status'])
  const categoryTags = categories
    .map((cat) => {
      const colors = getCategoryColors(cat)
      return `<span class="px-3 py-1 ${colors} rounded-full text-sm font-medium">${cat}</span>`
    })
    .join('\n            ')

  const description = String(row['Description'] || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((paragraph) => paragraph.trim())
    .filter((p) => p.length > 0)
    .map((paragraph) => {
      if (paragraph.startsWith('http://') || paragraph.startsWith('https://')) {
        return `<p class="mb-4">\n          <a href="${paragraph}" target="_blank" rel="noopener noreferrer" class="text-google-blue hover:underline">${paragraph}</a>\n        </p>`
      }
      return `<p class="mb-4">${paragraph}</p>`
    })
    .join('\n        ')

  return `
      <div class="flex flex-col md:flex-row gap-6 mb-6">
        <div class="flex-shrink-0">
          <img src="${row['Profile Picture']}" alt="${row['FirstName']} ${row['LastName']}" class="w-32 h-32 rounded-full object-cover">
        </div>
        <div>
          <p class="text-lg font-semibold mb-2">Speaker: ${row['FirstName']} ${row['LastName']} - ${row['TagLine']}</p>
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

function formatSpeakerContent(row) {
  const bioLines = String(row['Bio'] || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  let bioHtml = ''
  let inList = false

  bioLines.forEach((line) => {
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
          <img src="${row['Profile Picture']}" alt="${row['FirstName']} ${row['LastName']}" class="w-48 h-48 rounded-full object-cover">
        </div>
        <div>
          <h3 class="text-2xl font-bold mb-2">${row['FirstName']} ${row['LastName']}</h3>
          <p class="text-google-blue font-semibold text-lg mb-4">${row['TagLine']}</p>
        </div>
      </div>
      <div class="text-gray-600 dark:text-gray-400 space-y-3">
        ${bioHtml}
      </div>
    `
}

async function readRowsWithHeaders(filePath) {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(filePath)
  const worksheet = workbook.worksheets[0]
  if (!worksheet) return []
  // Extract headers from the first row
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

  const sessions = {}
  const speakers = {}
  const speakerSet = new Set()

  rawData.forEach((row) => {
    const first = row['FirstName']
    const last = row['LastName']
    const speakerId = createSpeakerId(first, last)
    const sessionId = createSessionId(row['Title'])

    sessions[sessionId] = {
      sessionId,
      title: row['Title'],
      speaker: `${first} ${last} - ${row['TagLine']}`,
      photo: row['Profile Picture'],
      content: formatSessionContent(row),
      categories: extractCategories(row['Status']),
      status: row['Status'],
    }

    if (!speakerSet.has(speakerId)) {
      speakerSet.add(speakerId)
      speakers[speakerId] = {
        speakerId,
        name: `${first} ${last}`,
        position: row['TagLine'],
        photo: row['Profile Picture'],
        content: formatSpeakerContent(row),
      }
    }
  })

  const data = { sessions, speakers }
  fs.writeFileSync(outputJson, JSON.stringify(data, null, 2))
  console.log(`Wrote ${Object.keys(sessions).length} sessions and ${Object.keys(speakers).length} speakers to ${outputJson}`)
}

generate().catch((err) => {
  console.error(err)
  process.exit(1)
})
