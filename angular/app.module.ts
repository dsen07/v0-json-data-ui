import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { FormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"

import { AppComponent } from "./app.component"
import { JsonTreeViewComponent } from "./json-tree-view/json-tree-view.component"
import { TreeNodeComponent } from "./tree-node/tree-node.component"

@NgModule({
  declarations: [AppComponent, JsonTreeViewComponent, TreeNodeComponent],
  imports: [BrowserModule, FormsModule, CommonModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
