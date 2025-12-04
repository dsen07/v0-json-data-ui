import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { CommonModule } from "@angular/common"

import { AppComponent } from "./app.component"
import { IncidentInvestigatorComponent } from "./incident-investigator/incident-investigator.component"
import { JsonTreeViewComponent } from "./json-tree-view/json-tree-view.component"
import { JsonRawViewComponent } from "./json-raw-view/json-raw-view.component"

@NgModule({
  declarations: [AppComponent, IncidentInvestigatorComponent, JsonTreeViewComponent, JsonRawViewComponent],
  imports: [BrowserModule, CommonModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
