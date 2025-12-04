"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface JsonRawViewProps {
  data: any
}

export default function JsonRawView({ data }: JsonRawViewProps) {
  const [copied, setCopied] = useState(false)
  const jsonString = JSON.stringify(data, null, 2)

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Syntax highlighting
  const highlightJson = (json: string) => {
    return json
      .replace(/(".*?"):/g, '<span class="json-key">$1</span>:')
      .replace(/: (".*?")/g, ': <span class="json-string">$1</span>')
      .replace(/: (\d+\.?\d*)/g, ': <span class="json-number">$1</span>')
      .replace(/: (true|false)/g, ': <span class="json-boolean">$1</span>')
      .replace(/: (null)/g, ': <span class="json-null">$1</span>')
  }

  return (
    <div className="h-full overflow-auto bg-background relative">
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-card border-b border-border">
        <span className="text-sm text-muted-foreground font-mono">Raw JSON Output</span>
        <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2 bg-transparent">
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy JSON
            </>
          )}
        </Button>
      </div>

      <div className="p-6">
        <div className="bg-card border border-border rounded-lg p-6 overflow-x-auto">
          <pre className="text-sm font-mono leading-relaxed">
            <code dangerouslySetInnerHTML={{ __html: highlightJson(jsonString) }} />
          </pre>
        </div>
      </div>

      <style jsx>{`
        :global(.json-key) {
          color: var(--json-key);
          font-weight: 500;
        }
        :global(.json-string) {
          color: var(--json-string);
        }
        :global(.json-number) {
          color: var(--json-number);
        }
        :global(.json-boolean) {
          color: var(--json-boolean);
        }
        :global(.json-null) {
          color: var(--json-null);
          font-style: italic;
        }
      `}</style>
    </div>
  )
}
