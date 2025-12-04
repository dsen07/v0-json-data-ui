import IncidentInvestigator from "@/components/incident-investigator"

export default function Home() {
  const sampleIncidentData = {
    incident_id: "INC-2024-12-04-001",
    timestamp: "2024-12-04T15:23:41.523Z",
    severity: "high",
    status: "investigating",
    service: {
      name: "payment-service",
      version: "2.3.1",
      region: "us-east-1",
      environment: "production",
    },
    error: {
      type: "DatabaseConnectionTimeout",
      message: "Connection to database pool timed out after 5000ms",
      stack_trace: [
        "at DatabasePool.connect (db.js:234)",
        "at PaymentProcessor.processPayment (payment.js:89)",
        "at APIHandler.handleRequest (api.js:156)",
      ],
      metadata: {
        connection_pool_size: 50,
        active_connections: 48,
        pending_requests: 127,
        timeout_threshold_ms: 5000,
      },
    },
    request: {
      method: "POST",
      path: "/api/v2/payments/process",
      headers: {
        "content-type": "application/json",
        "x-request-id": "req_abc123xyz789",
        "user-agent": "Mozilla/5.0 (compatible; API-Client/1.0)",
      },
      body: {
        amount: 99.99,
        currency: "USD",
        payment_method: "credit_card",
        customer_id: "cust_xyz789",
      },
    },
    metrics: {
      cpu_usage: 87.5,
      memory_usage_mb: 1843,
      response_time_ms: null,
      affected_users: 234,
      error_rate: 0.125,
    },
    related_incidents: [
      {
        id: "INC-2024-12-04-002",
        correlation: "high",
        service: "database-cluster",
      },
    ],
    assignee: {
      id: "eng_789",
      name: "Sarah Chen",
      team: "Platform Engineering",
      on_call: true,
    },
    tags: ["database", "timeout", "payment", "critical"],
    notes:
      "Investigating connection pool exhaustion. Possible correlation with increased traffic from marketing campaign.",
    runbook_url: "https://docs.company.com/runbooks/db-connection-timeout",
  }

  return (
    <main className="min-h-screen bg-background">
      <IncidentInvestigator data={sampleIncidentData} />
    </main>
  )
}
