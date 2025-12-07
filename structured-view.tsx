"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface StructuredViewProps {
  data: any
  searchTerm: string
  currentResultIndex: number
  onSearchResultsChange: (results: string[]) => void
}

interface TreeNodeProps {
  keyName: string
  value: any
  level: number
  path: string
  searchTerm: string
  currentResultIndex: number
  matchedPaths: Set<string>
  matchOrder: string[]
}

function collectMatchingPathsInOrder(data: any, searchTerm: string): string[] {
  const matchedPaths: string[] = []
  if (!searchTerm) return matchedPaths

  const searchLower = searchTerm.toLowerCase()

  const traverse = (obj: any, currentPath: string) => {
    if (obj === null || typeof obj !== "object") {
      return
    }

    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        const itemPath = currentPath ? `${currentPath}.${index}` : `${index}`
        const keyMatches = `[${index}]`.toLowerCase().includes(searchLower)
        const isExpandable = item !== null && typeof item === "object"
        const valueMatches = !isExpandable && String(item).toLowerCase().includes(searchLower)

        if (keyMatches || valueMatches) {
          matchedPaths.push(itemPath)
        }

        traverse(item, itemPath)
      })
    } else {
      Object.entries(obj).forEach(([key, value]) => {
        const valuePath = currentPath ? `${currentPath}.${key}` : key
        const keyMatches = key.toLowerCase().includes(searchLower)
        const isExpandable = value !== null && typeof value === "object"
        const valueMatches = !isExpandable && String(value).toLowerCase().includes(searchLower)

        if (keyMatches || valueMatches) {
          matchedPaths.push(valuePath)
        }

        traverse(value, valuePath)
      })
    }
  }

  traverse(data, "")
  return matchedPaths
}

function shouldShowNode(path: string, matchedPaths: Set<string>, searchTerm: string): boolean {
  if (!searchTerm) return true
  if (matchedPaths.has(path)) return true

  // Check if any descendant matches
  for (const matchedPath of matchedPaths) {
    if (matchedPath.startsWith(path + ".")) {
      return true
    }
  }

  return false
}

function TreeNode({
  keyName,
  value,
  level,
  path,
  searchTerm,
  currentResultIndex,
  matchedPaths,
  matchOrder,
}: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2)
  const nodeRef = useRef<HTMLDivElement>(null)

  const isObject = value !== null && typeof value === "object" && !Array.isArray(value)
  const isArray = Array.isArray(value)
  const isExpandable = isObject || isArray

  const searchLower = searchTerm.toLowerCase()
  const keyMatches = searchTerm && keyName.toLowerCase().includes(searchLower)
  const valueMatches = searchTerm && !isExpandable && String(value).toLowerCase().includes(searchLower)

  const isMatch = matchedPaths.has(path)
  const matchIndex = matchOrder.indexOf(path)
  const isCurrentMatch = isMatch && matchIndex === currentResultIndex

  useEffect(() => {
    if (searchTerm && shouldShowNode(path, matchedPaths, searchTerm)) {
      setIsExpanded(true)
    }
  }, [searchTerm, path, matchedPaths])

  useEffect(() => {
    if (isCurrentMatch && nodeRef.current) {
      console.log("[v0] Scrolling to match:", path)

      const scrollContainer = nodeRef.current.closest(".overflow-auto")
      if (scrollContainer) {
        const containerRect = scrollContainer.getBoundingClientRect()
        const nodeRect = nodeRef.current.getBoundingClientRect()

        // Calculate the current position of the node relative to the viewport
        const currentScrollTop = scrollContainer.scrollTop
        const nodeRelativeTop = nodeRect.top - containerRect.top

        // Calculate target scroll position to place node at top with offset
        const targetScrollTop = currentScrollTop + nodeRelativeTop - 20

        console.log("[v0] Scroll details:", {
          currentScrollTop,
          nodeRelativeTop,
          targetScrollTop,
          containerHeight: containerRect.height,
          nodeHeight: nodeRect.height,
        })

        scrollContainer.scrollTo({
          top: targetScrollTop,
          behavior: "smooth",
        })
      } else {
        console.log("[v0] No scroll container found, using scrollIntoView")
        nodeRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        })
      }
    }
  }, [isCurrentMatch, path])

  const getFilteredChildren = () => {
    const children: Array<{ key: string; value: any; path: string }> = []

    if (isArray) {
      value.forEach((item: any, index: number) => {
        const childPath = `${path}.${index}`
        const childKey = `[${index}]`

        if (shouldShowNode(childPath, matchedPaths, searchTerm)) {
          children.push({ key: childKey, value: item, path: childPath })
        }
      })
    } else {
      Object.entries(value).forEach(([key, val]) => {
        const childPath = `${path}.${key}`

        if (shouldShowNode(childPath, matchedPaths, searchTerm)) {
          children.push({ key, value: val, path: childPath })
        }
      })
    }

    return children
  }

  const renderValue = (val: any) => {
    if (val === null) return <span className="text-muted-foreground italic">null</span>
    if (typeof val === "boolean") return <span className="text-chart-1">{String(val)}</span>
    if (typeof val === "number") return <span className="text-chart-3">{val}</span>
    if (typeof val === "string") {
      return <span className="text-chart-2">"{val}"</span>
    }
    return null
  }

  const highlightText = (text: string, shouldHighlight: boolean) => {
    if (!shouldHighlight || !searchTerm) return text

    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"))
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === searchLower ? (
            <mark key={i} className="bg-yellow-300 text-foreground rounded px-0.5">
              {part}
            </mark>
          ) : (
            part
          ),
        )}
      </>
    )
  }

  const filteredChildren = isExpandable && isExpanded ? getFilteredChildren() : []
  const shouldShow = shouldShowNode(path, matchedPaths, searchTerm)

  if (!shouldShow) {
    return null
  }

  return (
    <div ref={nodeRef}>
      <div
        className={cn(
          "flex items-start gap-2 py-1.5 px-3 rounded-md hover:bg-muted/50 transition-colors group",
          isCurrentMatch && "bg-blue-100 ring-2 ring-blue-500",
        )}
        style={{ paddingLeft: `${level * 24 + 12}px` }}
      >
        {isExpandable && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-shrink-0 mt-0.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        )}
        {!isExpandable && <div className="w-4 flex-shrink-0" />}

        <div className="flex-1 min-w-0 flex items-start gap-3">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className={cn("font-mono text-sm font-medium", keyMatches ? "text-foreground" : "text-muted-foreground")}
            >
              {highlightText(keyName, keyMatches)}:
            </span>
            {isMatch && (
              <Badge variant="secondary" className="h-5 text-xs">
                Match
              </Badge>
            )}
          </div>

          {!isExpandable && (
            <div className="font-mono text-sm break-all">
              {valueMatches ? highlightText(String(value), true) : renderValue(value)}
            </div>
          )}

          {isExpandable && !isExpanded && (
            <span className="text-sm text-muted-foreground">
              {searchTerm
                ? `Filtered(${filteredChildren.length})`
                : isArray
                  ? `Array(${value.length})`
                  : `Object(${Object.keys(value).length})`}
            </span>
          )}
        </div>
      </div>

      {isExpandable && isExpanded && (
        <div>
          {filteredChildren.map((child) => (
            <TreeNode
              key={child.path}
              keyName={child.key}
              value={child.value}
              level={level + 1}
              path={child.path}
              searchTerm={searchTerm}
              currentResultIndex={currentResultIndex}
              matchedPaths={matchedPaths}
              matchOrder={matchOrder}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function StructuredView({ data, searchTerm, currentResultIndex, onSearchResultsChange }: StructuredViewProps) {
  const matchOrder = collectMatchingPathsInOrder(data, searchTerm)
  const matchedPaths = new Set(matchOrder)

  useEffect(() => {
    onSearchResultsChange(matchOrder)
  }, [matchOrder.join(","), onSearchResultsChange])

  const getRootEntries = () => {
    if (!searchTerm) {
      return Object.entries(data)
    }

    return Object.entries(data).filter(([key]) => {
      return shouldShowNode(key, matchedPaths, searchTerm)
    })
  }

  const rootEntries = getRootEntries()

  return (
    <div className="h-full overflow-auto p-4">
      {rootEntries.map(([key, value]) => (
        <TreeNode
          key={key}
          keyName={key}
          value={value}
          level={0}
          path={key}
          searchTerm={searchTerm}
          currentResultIndex={currentResultIndex}
          matchedPaths={matchedPaths}
          matchOrder={matchOrder}
        />
      ))}
      {searchTerm && rootEntries.length === 0 && (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center">
            <p className="text-sm">No matches found for "{searchTerm}"</p>
            <p className="text-xs mt-1">Try a different search term</p>
          </div>
        </div>
      )}
    </div>
  )
}
