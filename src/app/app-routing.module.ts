import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditorComponent } from "./editor/editor.component"
import { MenuComponent } from "./menu/menu.component"
import { LevelCreationComponent } from "./level-creation/level-creation.component"
import { BallEditorComponent } from './ball-editor/ball-editor.component';

const routes: Routes = [
  { path: '', redirectTo: "/menu", pathMatch: "full" },
  { path: "editor", component: EditorComponent },
  { path: "menu", component: MenuComponent },
  { path: "create", component: LevelCreationComponent },
  { path: "balledit", component: BallEditorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
}
