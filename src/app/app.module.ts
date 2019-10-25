// modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
// components
import { AppComponent } from './app.component';
// services
import { ApiService } from './shared/services/api.service';
import { HomeService } from './shared/services/home.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    ApiService,
    HomeService
  ],
  bootstrap: [AppComponent],
  exports: [SharedModule]
})
export class AppModule { }
