import { Component } from "@angular/core"

@Component({
  selector: "app-root",
  template: `
    <div class="app-container">
      <app-json-tree-view [data]="sampleData"></app-json-tree-view>
    </div>
  `,
  styles: [
    `
    .app-container {
      height: 100vh;
      background: #0a0a0a;
    }
  `,
  ],
})
export class AppComponent {
  sampleData = {
    incident_id: "INC-2024-001",
    severity: "high",
    status: "investigating",
    timestamp: "2024-01-15T10:30:00Z",
    affected_services: ["auth-api", "user-service", "payment-gateway"],
    metrics: {
      error_rate: 0.45,
      response_time_ms: 2500,
      affected_users: 1234,
    },
    logs: [
      {
        level: "error",
        message: "Database connection timeout",
        timestamp: "2024-01-15T10:29:45Z",
      },
      {
        level: "error",
        message: "Retry failed after 3 attempts",
        timestamp: "2024-01-15T10:29:50Z",
      },
    ],
    metadata: {
      region: "us-east-1",
      environment: "production",
      version: "2.1.0",
    },
  }
}
