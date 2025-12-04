import { Component, Input, type OnChanges } from "@angular/core"

@Component({
  selector: "app-json-raw-view",
  templateUrl: "./json-raw-view.component.html",
  styleUrls: ["./json-raw-view.component.css"],
})
export class JsonRawViewComponent implements OnChanges {
  @Input() data: any = null

  formattedJson = ""
  highlightedHtml = ""

  ngOnChanges() {
    this.formatJson()
  }

  formatJson() {
    try {
      this.formattedJson = JSON.stringify(this.data, null, 2)
      this.highlightedHtml = this.syntaxHighlight(this.formattedJson)
    } catch (error) {
      this.formattedJson = "Invalid JSON"
      this.highlightedHtml = '<span class="error">Invalid JSON</span>'
    }
  }

  syntaxHighlight(json: string): string {
    json = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      (match) => {
        let cls = "number"
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "key"
            match = match.slice(0, -1)
            return `<span class="${cls}">${match}</span><span class="punctuation">:</span>`
          } else {
            cls = "string"
          }
        } else if (/true|false/.test(match)) {
          cls = "boolean"
        } else if (/null/.test(match)) {
          cls = "null"
        }
        return `<span class="${cls}">${match}</span>`
      },
    )
  }
}
