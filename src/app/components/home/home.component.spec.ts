import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppComponent } from '../../app.component';
import { HomeComponent } from './home.component';

import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../../app-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { AgGridModule } from 'ag-grid-angular';

import { ApiService } from '../../shared/services/api.service';
import { HomeService } from '../../shared/services/home.service';

const mockData = [];

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let apiSpy;
  let debugElement;
  let apiService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        HomeComponent,
      ],
      imports: [
        BrowserModule,
        AppRoutingModule,
        SharedModule,
        AgGridModule.withComponents([])
      ],
      providers: [
        ApiService,
        HomeService
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    debugElement = fixture.debugElement;
    apiService = debugElement.injector.get(HomeService);
    apiSpy = spyOn(apiService, 'getGridData').and.returnValue(mockData);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.rowData).toEqual(mockData);
  });

  it('grid API is not available until  `detectChanges`', () => {
    expect(component.gridApi.api).not.toBeTruthy();
  });

  it('grid API is available after `detectChanges`', () => {
    fixture.detectChanges();
    expect(component.gridApi).toBeTruthy();
  });
});
