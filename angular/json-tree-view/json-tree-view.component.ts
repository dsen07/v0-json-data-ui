import { Component, Input, type OnInit, type OnChanges } from "@angular/core"

interface TreeNodeData {
  keyName: string
  value: any
  level: number
  isRoot?: boolean
  keyFilter?: string
  valueFilter?: string
}

@Component({
  selector: "app-json-tree-view",
  templateUrl: "./json-tree-view.component.html",
  styleUrls: ["./json-tree-view.component.css"],
})
export class JsonTreeViewComponent implements OnInit, OnChanges {
  @Input() data: any

  keyFilter = ""
  valueFilter = ""
  filteredData: any
  matchCount: number | null = null
  rootNode: TreeNodeData | null = null

  ngOnInit(): void {
    this.updateFilteredData()
  }

  ngOnChanges(): void {
    this.updateFilteredData()
  }

  onKeyFilterChange(value: string): void {
    this.keyFilter = value
    this.updateFilteredData()
  }

  onValueFilterChange(value: string): void {
    this.valueFilter = value
    this.updateFilteredData()
  }

  clearKeyFilter(): void {
    this.keyFilter = ""
    this.updateFilteredData()
  }

  clearValueFilter(): void {
    this.valueFilter = ""
    this.updateFilteredData()
  }

  clearAllFilters(): void {
    this.keyFilter = ""
    this.valueFilter = ""
    this.updateFilteredData()
  }

  private updateFilteredData(): void {
    const keyFilterLower = this.keyFilter.toLowerCase()
    const valueFilterLower = this.valueFilter.toLowerCase()

    if (!this.keyFilter && !this.valueFilter) {
      this.filteredData = this.data
      this.matchCount = null
    } else {
      this.filteredData = this.filterJson(this.data, keyFilterLower, valueFilterLower)
      this.matchCount = this.countMatches(this.filteredData)
    }

    this.rootNode = {
      keyName: "root",
      value: this.filteredData,
      level: 0,
      isRoot: true,
      keyFilter: keyFilterLower,
      valueFilter: valueFilterLower,
    }
  }

  private filterJson(obj: any, keyFilter: string, valueFilter: string): any {
    if (obj === null || obj === undefined) return obj

    // For primitive values, check if value matches
    if (typeof obj !== "object") {
      const valueStr = String(obj).toLowerCase()
      return valueFilter && !valueStr.includes(valueFilter) ? undefined : obj
    }

    // For arrays, filter each item
    if (Array.isArray(obj)) {
      const filtered = obj
        .map((item) => this.filterJson(item, keyFilter, valueFilter))
        .filter((item) => item !== undefined)
      return filtered.length > 0 ? filtered : undefined
    }

    // For objects, filter keys and values
    const filtered: any = {}
    let hasMatches = false

    for (const [key, value] of Object.entries(obj)) {
      const keyMatch = !keyFilter || key.toLowerCase().includes(keyFilter)
      const valueStr = typeof value === "object" ? "" : String(value).toLowerCase()
      const valueMatch = !valueFilter || valueStr.includes(valueFilter)

      // If key matches, include this property and all its children
      if (keyMatch) {
        // If there's also a value filter, apply it to non-object values
        if (valueFilter && typeof value !== "object") {
          if (valueMatch) {
            filtered[key] = value
            hasMatches = true
          }
        } else {
          filtered[key] = value
          hasMatches = true
        }
      } else {
        // Key doesn't match, but recursively check children
        const filteredValue = this.filterJson(value, keyFilter, valueFilter)
        if (filteredValue !== undefined) {
          filtered[key] = filteredValue
          hasMatches = true
        }
      }
    }

    return hasMatches ? filtered : undefined
  }

  private countMatches(obj: any, count = 0): number {
    if (obj === null || obj === undefined) return count
    if (typeof obj !== "object") return count + 1

    if (Array.isArray(obj)) {
      return obj.reduce((acc, item) => this.countMatches(item, acc), count)
    }

    return Object.values(obj).reduce((acc, value) => this.countMatches(value, acc), count)
  }

  get hasActiveFilters(): boolean {
    return !!(this.keyFilter || this.valueFilter)
  }

  get showNoResults(): boolean {
    return this.hasActiveFilters && this.matchCount === 0
  }
}
