const parser = new DOMParser()

const toSnakeCase = (string: string) =>
  string
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/:/g, '')
    .replace(/ - /g, '_')
    .replace(/\s|\./g, '_')

const parse = (string: string) => {
  string = string.trim()

  if (string === '') return null

  if (string === 'No') return false

  if (string === 'Yes') return true

  if (/^\d+(\.\d+)?$/.test(string)) return Number(string)

  return string
}

export const parseBlizzardData = (html: string) => {
  const result: any = {}
  let title: string, subtitle: string

  const blizzard = parser.parseFromString(html, 'text/html')

  blizzard.querySelector('body div')?.remove()

  for (const element of blizzard.querySelectorAll('h1,h2,table')) {
    switch (element.tagName.toLowerCase()) {
      case 'h1': {
        title = toSnakeCase(element.textContent!)
        result[title] ??= {}
        break
      }
      case 'h2': {
        subtitle = toSnakeCase(element.textContent!)
        result[title!][subtitle] ??= []
        break
      }
      case 'table': {
        const headers: string[] = []

        for (const head of element.querySelectorAll('thead tr th')) {
          headers.push(toSnakeCase(head.textContent!))
        }

        for (const body of element.querySelectorAll('tbody tr')) {
          const item: any = {}

          for (let index = 0, tds = body.querySelectorAll('td'); index < tds.length; index++) {
            item[headers[index]] = parse(tds[index].textContent!)
          }

          result[title!][subtitle!].push(item)
        }
        break
      }
    }
  }

  return result
}
