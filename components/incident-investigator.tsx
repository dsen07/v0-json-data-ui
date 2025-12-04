"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Code2, ListTree } from "lucide-react"
import { cn } from "@/lib/utils"
import JsonTreeView from "./json-tree-view"
import JsonRawView from "./json-raw-view"

type ViewMode = "tree" | "raw"

interface IncidentInvestigatorProps {
  data: any
}

export default function IncidentInvestigator({ data }: IncidentInvestigatorProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("tree")

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Incident Investigator</h1>
            <p className="text-sm text-muted-foreground mt-1">Analyze and resolve incidents efficiently</p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("tree")}
              className={cn(
                "gap-2 transition-colors",
                viewMode === "tree"
                  ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary",
              )}
            >
              <ListTree className="h-4 w-4" />
              Structured View
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("raw")}
              className={cn(
                "gap-2 transition-colors",
                viewMode === "raw"
                  ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary",
              )}
            >
              <Code2 className="h-4 w-4" />
              JSON View
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === "tree" ? <JsonTreeView data={data} /> : <JsonRawView data={data} />}
      </div>
    </div>
  )
}
