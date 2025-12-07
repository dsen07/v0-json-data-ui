"use client"

import { useState, useEffect, useRef } from "react"

interface JsonViewProps {
  data: any
  searchTerm: string
  currentResultIndex: number
  onSearchResultsChange: (results: string[]) => void
}

export function JsonView({ data, searchTerm, currentResultIndex, onSearchResultsChange }: JsonViewProps) {
  const [highlightedJson, setHighlightedJson] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const matchRefs = useRef<HTMLSpanElement[]>([])

  useEffect(() => {
    const jsonString = JSON.stringify(data, null, 2)

    if (!searchTerm) {
      setHighlightedJson(jsonString)
      onSearchResultsChange([])
      return
    }

    // Find all matches
    const matches: Array<{ start: number; end: number; text: string }> = []
    const searchLower = searchTerm.toLowerCase()
    const jsonLower = jsonString.toLowerCase()

    let startIndex = 0
    while (startIndex < jsonLower.length) {
      const index = jsonLower.indexOf(searchLower, startIndex)
      if (index === -1) break

      matches.push({
        start: index,
        end: index + searchTerm.length,
        text: jsonString.slice(index, index + searchTerm.length),
      })
      startIndex = index + 1
    }

    onSearchResultsChange(matches.map((_, i) => String(i)))

    // Build highlighted HTML
    let result = ""
    let lastIndex = 0

    matches.forEach((match, i) => {
      result += escapeHtml(jsonString.slice(lastIndex, match.start))
      result += `<span data-match="${i}" class="${
        i === currentResultIndex ? "bg-blue-500 text-white ring-2 ring-blue-600" : "bg-yellow-300 text-foreground"
      } rounded px-0.5">${escapeHtml(match.text)}</span>`
      lastIndex = match.end
    })
    result += escapeHtml(jsonString.slice(lastIndex))

    setHighlightedJson(result)
  }, [data, searchTerm, currentResultIndex, onSearchResultsChange])

  useEffect(() => {
    if (currentResultIndex >= 0 && containerRef.current) {
      const matchElement = containerRef.current.querySelector(`[data-match="${currentResultIndex}"]`)
      if (matchElement) {
        matchElement.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }, [currentResultIndex])

  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
  }

  return (
    <div ref={containerRef} className="h-full overflow-auto p-4 font-mono text-sm">
      <pre className="text-foreground" dangerouslySetInnerHTML={{ __html: highlightedJson }} />
    </div>
  )
}
