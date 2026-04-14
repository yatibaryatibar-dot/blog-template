const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')

dayjs.extend(customParseFormat)

const postsDirectory = path.join(process.cwd(), 'content')
const mode = process.argv.includes('--fix') ? 'fix' : 'check'

function getAllMarkdownFiles(dir: string): string[] {
  let results: string[] = []
  const items = fs.readdirSync(dir)

  items.forEach((item: string) => {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      results = results.concat(getAllMarkdownFiles(fullPath))
    } else if (item.endsWith('.md')) {
      results.push(fullPath)
    }
  })

  return results
}

function formatDate(date: any): string | null {
  if (!date) return null
  const parsed = dayjs(date)
  if (!parsed.isValid()) return null
  return parsed.format('YYYY-MM-DD')
}

function processFile(file: string): { changed: boolean; valid: boolean; reason?: string } {
  const content = fs.readFileSync(file, 'utf8')
  const { data, content: markdownContent } = matter(content)

  const cleanData: Record<string, any> = { ...data }
  const formattedDate = formatDate(data.date)

  if (!formattedDate) {
    if (mode === 'fix') {
      cleanData.date = dayjs().format('YYYY-MM-DD')
      const out = matter.stringify(markdownContent, cleanData, {
        // @ts-ignore
        styles: { '!!str': 'literal' },
        lineWidth: -1,
      })
      fs.writeFileSync(file, out)
      return { changed: true, valid: true }
    }
    return { changed: false, valid: false, reason: 'missing_or_invalid_date' }
  }

  const normalized = String(data.date) === formattedDate
  if (!normalized) {
    if (mode === 'fix') {
      cleanData.date = formattedDate
      const out = matter.stringify(markdownContent, cleanData, {
        // @ts-ignore
        styles: { '!!str': 'literal' },
        lineWidth: -1,
      })
      fs.writeFileSync(file, out)
      return { changed: true, valid: true }
    }
    return { changed: false, valid: false, reason: `date_not_normalized(${data.date}=>${formattedDate})` }
  }

  return { changed: false, valid: true }
}

function main() {
  const files = getAllMarkdownFiles(postsDirectory)
  let updatedCount = 0
  const violations: Array<{ file: string; reason: string }> = []

  files.forEach((file) => {
    const result = processFile(file)
    if (result.changed) {
      updatedCount++
      console.log(`Updated metadata for: ${path.relative(postsDirectory, file)}`)
    }
    if (!result.valid) {
      violations.push({ file: path.relative(postsDirectory, file), reason: result.reason || 'invalid' })
    }
  })

  console.log(`\nMode: ${mode}`)
  console.log(`Processed ${files.length} files:`)
  console.log(`- ${updatedCount} files updated`)
  console.log(`- ${files.length - updatedCount} files unchanged`)

  if (violations.length > 0) {
    console.error(`\nFrontmatter validation failed (${violations.length}):`)
    violations.forEach((v) => console.error(`- ${v.file}: ${v.reason}`))
    process.exit(1)
  }
}

main()

export {}
