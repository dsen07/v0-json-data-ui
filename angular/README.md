# Angular JSON Tree View Component

This is an Angular implementation of the JSON Tree View component with custom CSS (no Tailwind).

## Components

1. **JsonTreeViewComponent** - Main container with filtering functionality
2. **TreeNodeComponent** - Recursive component for rendering JSON nodes

## Features

- Toggleable expand/collapse for nested objects and arrays
- Filter by keys and values with real-time highlighting
- Copy to clipboard functionality
- Works with any level of JSON nesting
- Syntax highlighting for different data types
- Match count display
- Custom CSS styling (no framework dependencies)

## Installation

1. Copy the component files to your Angular project:
   - `json-tree-view/` folder
   - `tree-node/` folder

2. Add the components to your module declarations in `app.module.ts`

3. Import the global styles in your `styles.css` or `angular.json`

4. Use in your template:

\`\`\`html
<app-json-tree-view [data]="yourJsonData"></app-json-tree-view>
\`\`\`

## Usage Example

\`\`\`typescript
export class YourComponent {
  incidentData = {
    incident_id: "INC-2024-001",
    severity: "high",
    affected_services: ["auth-api", "user-service"],
    metrics: {
      error_rate: 0.45,
      response_time_ms: 2500
    }
  };
}
\`\`\`

\`\`\`html
<app-json-tree-view [data]="incidentData"></app-json-tree-view>
\`\`\`

## Note

This code was generated for reference and cannot be previewed in v0 (Next.js/React only environment). 
Please test in your Angular project and adjust as needed.
