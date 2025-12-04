import { Component, Input, type OnInit } from "@angular/core"
import type { DomSanitizer, SafeHtml } from "@angular/platform-browser"

interface TreeNodeData {
  keyName: string
  value: any
  level: number
  isRoot?: boolean
  keyFilter?: string
  valueFilter?: string
}

@Component({
  selector: "app-tree-node",
  templateUrl: "./tree-node.component.html",
  styleUrls: ["./tree-node.component.css"],
})
export class TreeNodeComponent implements OnInit {
  @Input() nodeData!: TreeNodeData

  isExpanded = false
  copied = false
  childNodes: TreeNodeData[] = []

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    const level = this.nodeData.level
    const hasFilter = !!(this.nodeData.keyFilter || this.nodeData.valueFilter)
    this.isExpanded = level < 2 || hasFilter
    this.updateChildNodes()
  }

  get isObject(): boolean {
    return (
      this.nodeData.value !== null && typeof this.nodeData.value === "object" && !Array.isArray(this.nodeData.value)
    )
  }

  get isArray(): boolean {
    return Array.isArray(this.nodeData.value)
  }

  get isExpandable(): boolean {
    return this.isObject || this.isArray
  }

  get paddingLeft(): string {
    return `${this.nodeData.level * 1.5 + 1}rem`
  }

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded
  }

  handleCopy(): void {
    navigator.clipboard.writeText(JSON.stringify(this.nodeData.value, null, 2))
    this.copied = true
    setTimeout(() => (this.copied = false), 2000)
  }

  getValueType(val: any): string {
    if (val === null) return "null"
    if (Array.isArray(val)) return "array"
    return typeof val
  }

  getValueColor(val: any): string {
    const type = this.getValueType(val)
    switch (type) {
      case "string":
        return "value-string"
      case "number":
        return "value-number"
      case "boolean":
        return "value-boolean"
      case "null":
        return "value-null"
      default:
        return ""
    }
  }

  highlightText(text: string, filter: string): SafeHtml {
    if (!filter) return text

    const regex = new RegExp(`(${this.escapeRegExp(filter)})`, "gi")
    const highlighted = text.replace(regex, '<mark class="highlight">$1</mark>')
    return this.sanitizer.bypassSecurityTrustHtml(highlighted)
  }

  private escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  }

  getKeyDisplay(): SafeHtml {
    const keyFilter = this.nodeData.keyFilter || ""
    return this.highlightText(this.nodeData.keyName, keyFilter)
  }

  getValueDisplay(): SafeHtml | string {
    const val = this.nodeData.value

    if (this.isExpandable) {
      const itemCount = this.isArray ? val.length : Object.keys(val).length
      const preview = this.isArray ? `Array[${itemCount}]` : `Object{${itemCount}}`
      return preview
    }

    const stringValue = val === null ? "null" : typeof val === "string" ? `"${val}"` : String(val)

    const valueFilter = this.nodeData.valueFilter || ""
    if (valueFilter && typeof val !== "object") {
      return this.highlightText(stringValue, valueFilter)
    }

    return stringValue
  }

  private updateChildNodes(): void {
    if (!this.isExpandable) {
      this.childNodes = []
      return
    }

    const val = this.nodeData.value
    const nextLevel = this.nodeData.level + 1

    if (this.isArray) {
      this.childNodes = val.map((item: any, index: number) => ({
        keyName: `[${index}]`,
        value: item,
        level: nextLevel,
        isRoot: false,
        keyFilter: this.nodeData.keyFilter,
        valueFilter: this.nodeData.valueFilter,
      }))
    } else {
      this.childNodes = Object.entries(val).map(([key, value]) => ({
        keyName: key,
        value: value,
        level: nextLevel,
        isRoot: false,
        keyFilter: this.nodeData.keyFilter,
        valueFilter: this.nodeData.valueFilter,
      }))
    }
  }

  get isRoot(): boolean {
    return !!this.nodeData.isRoot
  }

  get displayValue(): string | SafeHtml {
    return this.getValueDisplay()
  }

  get isValueExpandable(): boolean {
    return this.isExpandable
  }
}
