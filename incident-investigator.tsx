"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { JsonView } from "@/components/json-view"
import { StructuredView } from "@/components/structured-view"
import { List, Search, ChevronDown, ChevronUp, AlertCircle, FileJson } from "lucide-react"

// Sample incident data for demonstration
const sampleIncidentData = {
  incident: {
    id: "INC-2024-001",
    timestamp: "2024-12-06T14:23:45Z",
    severity: "high",
    status: "investigating",
    title: "API Gateway Timeout Issues",
    affectedServices: ["api-gateway", "user-service", "payment-service"],
    metrics: {
      errorRate: 0.234,
      p95Latency: 2456,
      requestCount: 15234,
      failedRequests: 3567,
    },
    details: {
      region: "us-east-1",
      environment: "production",
      triggeredBy: "automated_monitoring",
      alerts: [
        {
          id: "ALT-001",
          name: "High Error Rate",
          threshold: 0.05,
          actual: 0.234,
          duration: "15m",
        },
        {
          id: "ALT-002",
          name: "Latency Spike",
          threshold: 1000,
          actual: 2456,
          duration: "12m",
        },
      ],
    },
    stackTrace: {
      error: "Gateway Timeout",
      message: "Upstream service failed to respond within 30s",
      cause: {
        service: "user-service",
        endpoint: "/api/v1/users/profile",
        timeout: 30000,
        attempts: 3,
        lastAttempt: "2024-12-06T14:23:40Z",
      },
    },
    logs: [
      {
        timestamp: "2024-12-06T14:23:30Z",
        level: "ERROR",
        message: "Connection timeout to user-service",
        context: {
          requestId: "req-abc-123",
          userId: "user-456",
          endpoint: "/api/v1/users/profile",
        },
      },
    ],
  },
}

export function IncidentInvestigator() {
  const [viewMode, setViewMode] = useState<"structured" | "json">("structured")
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [currentResultIndex, setCurrentResultIndex] = useState(-1)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (!term.trim()) {
      setSearchResults([])
      setCurrentResultIndex(-1)
      return
    }

    // This will be passed to child components to handle actual search
    setCurrentResultIndex(-1)
  }

  const handlePrevious = () => {
    if (searchResults.length === 0) return
    const newIndex = currentResultIndex <= 0 ? searchResults.length - 1 : currentResultIndex - 1
    setCurrentResultIndex(newIndex)
  }

  const handleNext = () => {
    if (searchResults.length === 0) return
    const newIndex = currentResultIndex >= searchResults.length - 1 ? 0 : currentResultIndex + 1
    setCurrentResultIndex(newIndex)
  }

  return (
    <div className="flex h-screen flex-col bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <AlertCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Incident Investigation</h1>
              <p className="text-sm text-muted-foreground">Analyze and resolve incidents efficiently</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-destructive-foreground animate-pulse" />
              High Severity
            </Badge>
            <Badge variant="outline">INC-2024-001</Badge>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="border-b bg-background px-6 py-3">
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex rounded-lg border bg-muted/40 p-1">
            <Button
              variant={viewMode === "structured" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("structured")}
              className="gap-2"
            >
              <List className="h-4 w-4" />
              Structured
            </Button>
            <Button
              variant={viewMode === "json" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("json")}
              className="gap-2"
            >
              <FileJson className="h-4 w-4" />
              Raw JSON
            </Button>
          </div>

          {/* Search */}
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by key or value..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9 pr-20"
              />
              {searchResults.length > 0 && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">
                    {currentResultIndex + 1} / {searchResults.length}
                  </span>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevious}
                disabled={searchResults.length === 0}
                title="Previous match"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                disabled={searchResults.length === 0}
                title="Next match"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden p-6">
        <Card className="h-full overflow-hidden">
          {viewMode === "structured" ? (
            <StructuredView
              data={sampleIncidentData}
              searchTerm={searchTerm}
              currentResultIndex={currentResultIndex}
              onSearchResultsChange={setSearchResults}
            />
          ) : (
            <JsonView
              data={sampleIncidentData}
              searchTerm={searchTerm}
              currentResultIndex={currentResultIndex}
              onSearchResultsChange={setSearchResults}
            />
          )}
        </Card>
      </div>
    </div>
  )
}
