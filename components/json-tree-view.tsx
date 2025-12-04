"use client"

import { useState, useMemo } from "react"
import { ChevronRight, ChevronDown, Copy, Check, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface JsonTreeViewProps {
  data: any
}

export default function JsonTreeView({ data }: JsonTreeViewProps) {
  const [keyFilter, setKeyFilter] = useState("")
  const [valueFilter, setValueFilter] = useState("")

  const filteredData = useMemo(() => {
    if (!keyFilter && !valueFilter) return data
    return filterJson(data, keyFilter.toLowerCase(), valueFilter.toLowerCase())
  }, [data, keyFilter, valueFilter])

  const matchCount = useMemo(() => {
    if (!keyFilter && !valueFilter) return null
    return countMatches(filteredData)
  }, [filteredData, keyFilter, valueFilter])

  return (
    <div className="h-full overflow-auto bg-background">
      <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Filter by key..."
              value={keyFilter}
              onChange={(e) => setKeyFilter(e.target.value)}
              className="pl-9 pr-9 h-10 bg-card border-border"
            />
            {keyFilter && (
              <button
                onClick={() => setKeyFilter("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Filter by value..."
              value={valueFilter}
              onChange={(e) => setValueFilter(e.target.value)}
              className="pl-9 pr-9 h-10 bg-card border-border"
            />
            {valueFilter && (
              <button
                onClick={() => setValueFilter("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {(keyFilter || valueFilter) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setKeyFilter("")
                setValueFilter("")
              }}
              className="flex-shrink-0"
            >
              Clear All
            </Button>
          )}
        </div>
        {(keyFilter || valueFilter) && matchCount !== null && (
          <div className="mt-2 text-sm text-muted-foreground">
            {matchCount === 0 ? "No matches found" : `Found ${matchCount} ${matchCount === 1 ? "match" : "matches"}`}
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="bg-card border border-border rounded-lg">
          {(keyFilter || valueFilter) && matchCount === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No matches found for your filters</p>
              <p className="text-sm mt-1">Try adjusting your search criteria</p>
            </div>
          ) : (
            <TreeNode
              keyName="root"
              value={filteredData}
              level={0}
              isRoot
              keyFilter={keyFilter.toLowerCase()}
              valueFilter={valueFilter.toLowerCase()}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function filterJson(obj: any, keyFilter: string, valueFilter: string): any {
  if (obj === null || obj === undefined) return obj

  // For primitive values, check if value matches
  if (typeof obj !== "object") {
    const valueStr = String(obj).toLowerCase()
    return valueFilter && !valueStr.includes(valueFilter) ? undefined : obj
  }

  // For arrays, filter each item
  if (Array.isArray(obj)) {
    const filtered = obj.map((item) => filterJson(item, keyFilter, valueFilter)).filter((item) => item !== undefined)
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
      const filteredValue = filterJson(value, keyFilter, valueFilter)
      if (filteredValue !== undefined) {
        filtered[key] = filteredValue
        hasMatches = true
      }
    }
  }

  return hasMatches ? filtered : undefined
}

function countMatches(obj: any, count = 0): number {
  if (obj === null || obj === undefined) return count
  if (typeof obj !== "object") return count + 1

  if (Array.isArray(obj)) {
    return obj.reduce((acc, item) => countMatches(item, acc), count)
  }

  return Object.values(obj).reduce((acc, value) => countMatches(value, acc), count)
}

interface TreeNodeProps {
  keyName: string
  value: any
  level: number
  isRoot?: boolean
  keyFilter?: string
  valueFilter?: string
}

function TreeNode({ keyName, value, level, isRoot = false, keyFilter = "", valueFilter = "" }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2 || !!(keyFilter || valueFilter))

  const [copied, setCopied] = useState(false)

  const isObject = value !== null && typeof value === "object" && !Array.isArray(value)
  const isArray = Array.isArray(value)
  const isExpandable = isObject || isArray

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(value, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getValueType = (val: any): string => {
    if (val === null) return "null"
    if (Array.isArray(val)) return "array"
    return typeof val
  }

  const getValueColor = (val: any): string => {
    const type = getValueType(val)
    switch (type) {
      case "string":
        return "text-[var(--json-string)]"
      case "number":
        return "text-[var(--json-number)]"
      case "boolean":
        return "text-[var(--json-boolean)]"
      case "null":
        return "text-[var(--json-null)]"
      default:
        return "text-foreground"
    }
  }

  const highlightText = (text: string, filter: string) => {
    if (!filter) return text

    const parts = text.split(new RegExp(`(${filter})`, "gi"))
    return parts.map((part, i) =>
      part.toLowerCase() === filter ? (
        <mark key={i} className="bg-primary/30 text-foreground rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  const renderValue = (val: any) => {
    if (isExpandable) {
      const itemCount = isArray ? val.length : Object.keys(val).length
      const preview = isArray ? `Array[${itemCount}]` : `Object{${itemCount}}`
      return <span className="text-muted-foreground font-mono text-sm">{preview}</span>
    }

    const stringValue = val === null ? "null" : typeof val === "string" ? `"${val}"` : String(val)

    const displayValue = valueFilter && typeof val !== "object" ? highlightText(stringValue, valueFilter) : stringValue

    return <span className={cn("font-mono text-sm", getValueColor(val))}>{displayValue}</span>
  }

  return (
    <div className={cn(!isRoot && "border-l-2 border-border/50")}>
      <div
        className={cn(
          "flex items-start gap-2 px-4 py-2.5 hover:bg-accent/30 transition-colors group",
          isRoot && "border-b border-border",
        )}
        style={{ paddingLeft: `${level * 1.5 + 1}rem` }}
      >
        {/* Expand/Collapse Button */}
        {isExpandable && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-0.5 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        )}
        {!isExpandable && <div className="w-4" />}

        {/* Key */}
        <div className="flex-1 min-w-0 flex items-start gap-3">
          {!isRoot && (
            <span className="text-[var(--json-key)] font-mono text-sm font-medium flex-shrink-0">
              {keyFilter ? highlightText(keyName, keyFilter) : keyName}:
            </span>
          )}

          {/* Value */}
          <div className="flex-1 min-w-0 break-all">{renderValue(value)}</div>
        </div>

        {/* Copy Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0 flex-shrink-0"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      </div>

      {/* Children */}
      {isExpandable && isExpanded && (
        <div>
          {isArray
            ? value.map((item: any, index: number) => (
                <TreeNode
                  key={index}
                  keyName={`[${index}]`}
                  value={item}
                  level={level + 1}
                  keyFilter={keyFilter}
                  valueFilter={valueFilter}
                />
              ))
            : Object.entries(value).map(([key, val]) => (
                <TreeNode
                  key={key}
                  keyName={key}
                  value={val}
                  level={level + 1}
                  keyFilter={keyFilter}
                  valueFilter={valueFilter}
                />
              ))}
        </div>
      )}
    </div>
  )
}
