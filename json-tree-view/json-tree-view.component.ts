import { Component, Input, Output, EventEmitter, type OnChanges, type SimpleChanges } from "@angular/core"

interface TreeNode {
  key: string
  value: any
  type: string
  path: string
  isExpanded: boolean
  children?: TreeNode[]
  isVisible: boolean
  keyMatches: boolean
  valueMatches: boolean
  hasMatchInChildren: boolean
}

@Component({
  selector: "app-json-tree-view",
  templateUrl: "./json-tree-view.component.html",
  styleUrls: ["./json-tree-view.component.css"],
})
export class JsonTreeViewComponent implements OnChanges {
  @Input() data: any = null
  @Input() keyFilter = ""
  @Input() valueFilter = ""
  @Output() matchCountChange = new EventEmitter<number>()

  tree: TreeNode[] = []
  matchCount = 0

  ngOnChanges(changes: SimpleChanges) {
    if (changes["data"] || changes["keyFilter"] || changes["valueFilter"]) {
      this.buildTree()
    }
  }

  buildTree() {
    this.tree = this.parseObject(this.data, "", "")
    this.applyFilters()
  }

  parseObject(obj: any, parentKey: string, path: string): TreeNode[] {
    const nodes: TreeNode[] = []

    if (obj === null || obj === undefined) {
      return nodes
    }

    const entries = Array.isArray(obj) ? obj.map((item, index) => [index.toString(), item]) : Object.entries(obj)

    for (const [key, value] of entries) {
      const currentPath = path ? `${path}.${key}` : key
      const type = this.getType(value)

      const node: TreeNode = {
        key,
        value,
        type,
        path: currentPath,
        isExpanded: this.getDefaultExpandedState(currentPath),
        isVisible: true,
        keyMatches: false,
        valueMatches: false,
        hasMatchInChildren: false,
      }

      if (type === "object" || type === "array") {
        node.children = this.parseObject(value, key, currentPath)
      }

      nodes.push(node)
    }

    return nodes
  }

  getType(value: any): string {
    if (value === null) return "null"
    if (Array.isArray(value)) return "array"
    return typeof value
  }

  getDefaultExpandedState(path: string): boolean {
    const depth = path.split(".").length
    return depth <= 2
  }

  applyFilters() {
    const keyLower = this.keyFilter.toLowerCase()
    const valueLower = this.valueFilter.toLowerCase()
    let count = 0

    const filterNode = (node: TreeNode): boolean => {
      const keyMatch = !keyLower || node.key.toLowerCase().includes(keyLower)
      const valueMatch = !valueLower || this.valueMatchesFilter(node.value, valueLower)

      node.keyMatches = keyLower && keyMatch
      node.valueMatches = valueLower && valueMatch

      let hasChildMatch = false
      if (node.children) {
        for (const child of node.children) {
          if (filterNode(child)) {
            hasChildMatch = true
          }
        }
      }

      node.hasMatchInChildren = hasChildMatch

      const matches =
        (keyMatch && valueLower === "") || (valueMatch && keyLower === "") || (keyMatch && valueMatch) || hasChildMatch

      if ((node.keyMatches || node.valueMatches) && !node.children) {
        count++
      }

      node.isVisible = matches || (!keyLower && !valueLower)

      if (matches && (node.keyMatches || node.valueMatches || hasChildMatch)) {
        node.isExpanded = true
      }

      return matches
    }

    for (const node of this.tree) {
      filterNode(node)
    }

    this.matchCount = count
    this.matchCountChange.emit(count)
  }

  toggleNode(node: TreeNode) {
    node.isExpanded = !node.isExpanded
  }

  valueMatchesFilter(value: any, filter: string): boolean {
    if (value === null || value === undefined) {
      return "null".includes(filter) || "undefined".includes(filter)
    }
    return value.toString().toLowerCase().includes(filter)
  }

  getValueString(value: any, type: string): string {
    if (type === "string") return `"${value}"`
    if (type === "null") return "null"
    if (type === "undefined") return "undefined"
    return String(value)
  }

  getArrayLength(value: any): number {
    return Array.isArray(value) ? value.length : 0
  }

  getObjectKeys(value: any): number {
    return value && typeof value === "object" ? Object.keys(value).length : 0
  }
}
