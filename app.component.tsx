import { Component } from "@angular/core"

@Component({
  selector: "app-root",
  template: `
    <div class="app-container">
      <app-incident-investigator 
        [data]="sampleData"
        [title]="'Incident Investigator'">
      </app-incident-investigator>
    </div>
  `,
  styles: [
    `
    .app-container {
      min-height: 100vh;
      background: #000000;
      padding: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    app-incident-investigator {
      width: 100%;
      max-width: 1400px;
      height: 80vh;
      display: block;
    }
  `,
  ],
})
export class AppComponent {
  sampleData = {
    incident: {
      id: "INC-2024-001",
      timestamp: "2024-01-15T10:30:00Z",
      severity: "critical",
      service: "api-gateway",
      error: {
        message: "Connection timeout",
        code: "ETIMEDOUT",
        stack: "Error: Connection timeout\n  at Connection.connect (/app/db.js:45)\n  at async query (/app/db.js:120)",
      },
      metadata: {
        region: "us-east-1",
        environment: "production",
        version: "2.3.1",
        tags: ["payment", "checkout", "database"],
      },
    },
  }
}
