import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';
import { MenuComponent } from './menu/menu.component';
import { TopComponent } from './top/top.component';
import { LevelCreationComponent } from './level-creation/level-creation.component';
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap';
import { BoardComponent } from './board/board.component';
import { BallEditorComponent } from './ball-editor/ball-editor.component';
import { CubeIndicatorComponent } from './cube-indicator/cube-indicator.component';
import { EndpointEditorComponent } from './endpoint-editor/endpoint-editor.component';
import { NameComponent } from './name/name.component';
import { VerifyInputComponent } from './verify-input/verify-input.component';
import { LevelComponent } from './level/level.component';
import { LevelSelectorComponent } from './level-selector/level-selector.component';
import { TutorialComponent } from './tutorial/tutorial.component';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    MenuComponent,
    TopComponent,
    LevelCreationComponent,
    NgbProgressbar,
    BoardComponent,
    BallEditorComponent,
    CubeIndicatorComponent,
    EndpointEditorComponent,
    NameComponent,
    VerifyInputComponent,
    LevelComponent,
    LevelSelectorComponent,
    TutorialComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
