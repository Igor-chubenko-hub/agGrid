import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AgGridModule.withComponents([]),
    HttpClientModule
  ],
  exports: [
    CommonModule,
    AgGridModule,
    HttpClientModule
  ],
  providers: []
})
export class SharedModule { }
