import { Component, Input, type OnInit } from "@angular/core"

@Component({
  selector: "app-incident-investigator",
  templateUrl: "./incident-investigator.component.html",
  styleUrls: ["./incident-investigator.component.css"],
})
export class IncidentInvestigatorComponent implements OnInit {
  @Input() data: any = null
  @Input() title = "Incident Investigator"

  activeView: "structured" | "json" = "structured"
  keyFilter = ""
  valueFilter = ""
  matchCount = 0

  ngOnInit() {
    // Initialize with sample data if none provided
    if (!this.data) {
      this.data = {
        incident: {
          id: "INC-2024-001",
          timestamp: "2024-01-15T10:30:00Z",
          severity: "critical",
          service: "api-gateway",
          error: {
            message: "Connection timeout",
            code: "ETIMEDOUT",
            stack:
              "Error: Connection timeout\n  at Connection.connect (/app/db.js:45)\n  at async query (/app/db.js:120)",
          },
          metadata: {
            region: "us-east-1",
            environment: "production",
            version: "2.3.1",
            tags: ["payment", "checkout", "database"],
            metrics: {
              requestCount: 1523,
              errorRate: 0.45,
              latency: { p50: 120, p95: 850, p99: 1200 },
            },
          },
          user: {
            id: "user_123456",
            email: "john.doe@example.com",
            session: "sess_abc123",
            actions: [
              { type: "page_view", page: "/checkout" },
              { type: "click", element: "submit_payment" },
              { type: "error", message: "Payment failed" },
            ],
          },
        },
      }
    }
  }

  setView(view: "structured" | "json") {
    this.activeView = view
  }

  onKeyFilterChange(value: string) {
    this.keyFilter = value
  }

  onValueFilterChange(value: string) {
    this.valueFilter = value
  }

  onMatchCountChange(count: number) {
    this.matchCount = count
  }

  clearFilters() {
    this.keyFilter = ""
    this.valueFilter = ""
  }

  copyToClipboard() {
    const jsonString = JSON.stringify(this.data, null, 2)
    navigator.clipboard.writeText(jsonString).then(() => {
      alert("JSON copied to clipboard!")
    })
  }
}
