import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { JuegoComponent } from './juego/juego.component';
import { TorreComponent } from './torre/torre.component';
import { InstruccionesComponent } from './instrucciones/instrucciones.component';
import { QueEsTorreHanoiComponent } from './que-es-torre-hanoi/que-es-torre-hanoi.component';

@NgModule({
  declarations: [
    AppComponent,
    JuegoComponent,
    TorreComponent,
    InstruccionesComponent,
    QueEsTorreHanoiComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
