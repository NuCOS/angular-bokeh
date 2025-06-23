// ng lib modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BokehChartComponent } from './components/bokeh-chart/bokeh-chart.component';

@NgModule({
  imports: [
    // ng modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BokehChartComponent,
  ],
  declarations: [
    // shared directives
  ],
  exports: [
    // shared components
    BokehChartComponent,
    // ng lib modules
    CommonModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [

  ],
  // bootstrap: [SandboxBottomSheetComponent]
})
export class SharedModule { }

