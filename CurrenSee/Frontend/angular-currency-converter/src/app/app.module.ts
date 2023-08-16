import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { CurrenciesComponent } from './currency-selector/currencies/currencies.component';
import { FormsModule } from '@angular/forms';
import { CurrencySelectorComponent } from './currency-selector/currency-selector.component';
import { CurrencyServiceComponent } from './currency-service/currency-service.component';
import { HttpClientModule } from '@angular/common/http';
import { LogoComponent } from './logo/logo.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { DateRangePickerComponent } from './date-range-picker/date-range-picker.component';
@NgModule({
  declarations: [
    AppComponent,
    CurrenciesComponent,
    CurrencySelectorComponent,
    LogoComponent,
    LineChartComponent,
    DateRangePickerComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule,
    HttpClientModule
  ],
  providers: [CurrencyServiceComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
