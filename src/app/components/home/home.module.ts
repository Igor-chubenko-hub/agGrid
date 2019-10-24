import { NgModule } from '@angular/core';
import { HomeRouting } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports : [
    SharedModule,
    HomeRouting,
  ]
})
export class HomeModule { }
