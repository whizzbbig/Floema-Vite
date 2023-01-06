import fs from 'fs'
import { dirname, resolve } from 'path'

export class DynamicRouterBuilder {
  constructor (data, id) {
    this.data = data
    this.id = id
  }

  async generate () {
    const pageTemplate = fs.readFileSync(resolve(`src/pages/${this.id}/index.html`), 'utf8')

    for (const page of this.data) {
      let pageTemplateClone = pageTemplate

      pageTemplateClone = pageTemplateClone.replace(/#id/g, page.uid)

      this.writeFile(`src/pages/${this.id}/${page.uid}/index.html`, pageTemplateClone)
    }
  }

  writeFile (path, contents, callback) {
    fs.mkdir(dirname(path), { recursive: true }, error => {
      if (error) {
        return callback(error)
      }

      fs.writeFileSync(path, contents, callback)
    })
  }
}
