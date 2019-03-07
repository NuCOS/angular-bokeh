// ng lib modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import { BokehChartComponent } from './components/bokeh-chart/bokeh-chart.component';

@NgModule({
  imports: [
    // ng modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  declarations: [
    // shared directives
    BokehChartComponent
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
  // With dynamically loaded components there are no selector references in the templates
  // since components are loaded at runtime. In order to ensure that the compiler will still
  // generate a factory, dynamically loaded components have to be added to their NgModule's
  // entryComponents array.
  // The dynamically loaded components woudln't be added due to the Treeshaking
  // https://angular.io/docs/ts/latest/cookbook/dynamic-component-loader.html
  entryComponents: [

  ],
  // bootstrap: [SandboxBottomSheetComponent]
})
export class SharedModule { }

