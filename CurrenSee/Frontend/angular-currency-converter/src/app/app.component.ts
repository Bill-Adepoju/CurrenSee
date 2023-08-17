import {
  AfterViewInit,
  Component,

  OnInit,
  ViewChild,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {Currency} from "./Currency";

import {CurrencyServiceComponent} from "./currency-service/currency-service.component";
// import Chart from 'chart.js/auto';
import { LineChartComponent } from './line-chart/line-chart.component';
import { Chart } from 'chart.js/auto';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  // chart: any = [];
  public chart: Chart | undefined;
  response: any;
  dateArray: string[] = [];
  rateArray: number[] = [];


  title = 'currency-exchange';
  public isDataAvailable = false;
  public failedToLoad = false;
  public _from;
  public to;
  public amount_value;
  @ViewChild('from') fromCmp;
  @ViewChild('to') toCmp;
  @ViewChild('amount_input', {static: false}) amount_input;
  @ViewChild('submitBtn', {static: false}) submitBtn;
  @ViewChild('formExchange', {static: false}) formExchange;
  // @ViewChild(LineChartComponent) lineChartComponet;

  public resultFrom;
  public resultTo;
  public resultInfo;
  public isResult = false;
  public lastUpdate;
  get from_symbol() {
    return this._from.symbol;
  }

  constructor(private modalService: NgbModal, public service: CurrencyServiceComponent) {
  }

  public open(modal: any): void {
    this.modalService.open(modal);
  }


  public selectFrom = (currency: Currency): void =>{
    this._from=currency;
    if(this.isResult)
      this.exchange();
    // console.log(this._from);
  }


  public selectTo = (currency: Currency): void =>{
    this.to=currency;
    if(this.isResult)
      this.exchange();
    // console.log(this.to)
  }

  changeAmountValue(){
    this.amount_value = (Math.round( this.amount_value * 100) / 100).toFixed(2);
    localStorage.setItem("amount", this.amount_value);
    if(this.isResult)
      this.exchange();
  }


  public switchCurrencies(){
    //query endpoint and redraw chat after currency switched
    this.sendAndReceive(this._from, this.to);
    let temp : Currency = this._from;
    this.fromCmp.selectCurrency(this.to);
    this.toCmp.selectCurrency(temp);
    if(this.isResult)
      this.exchange();
  }

  public exchange(){
    // this.createChart();
    // if (this.lineChartComponet){
    //   this.lineChartComponet.sendAndReceive();
    // }
    // Query endpoint after currency converted or entry selected
    this.sendAndReceive(this._from, this.to);
    let rateBase = this.to.rate/this._from.rate;
    let result = this.amount_value*rateBase;
    this.resultFrom = this.amount_value + " " + (this._from.full_name ? this._from.full_name :  this._from.name) + "  =";
    this.resultTo = (result).toFixed(5) + " " + (this.to.full_name ? this.to.full_name :  this.to.name);
    // 
    this.resultInfo = (1).toFixed(2) + " " + this._from.name + " = " + rateBase.toFixed(6) + " " +this.to.name + '\n ';
    // this.resultInfo = (1).toFixed(2) + " " + this._from.name + " = " + rateBase.toFixed(6) + " " +this.to.name + '\n '
    //                   +  (1).toFixed(2) + " " + this.to.name + " = " + (1/rateBase).toFixed(6) + " " +this._from.name ;
  }

  onSubmit(): void {
    // if (this.lineChartComponet){
    //   this.lineChartComponet.sendAndReceive();
    // }
    this.exchange();
    this.isResult= true;
    var date = new Date(this.service.getLastUpdate());
    this.lastUpdate = date.toLocaleString()  + " UTC";
  }

  ngOnInit(): void {
    this.service.getCurrenciesPromise().then((data) => {
      this._from = data[0];
      this.to = data[1];
      this.isDataAvailable = true

    },
      () =>{
      this.failedToLoad = true;
      }
    );

    let localAmount = localStorage.getItem("amount");
    this.amount_value= localAmount ? localAmount : (1).toFixed(2);
    
  }



  windowResize(): void{
    this.submitBtn.nativeElement.style.width = this.formExchange.nativeElement.style.width;
  }

  ngAfterViewInit(): void {

  }


  //================================ CHART================

  // consuming history api
  sendAndReceive(sourceCur: any, destinationCur: any): void {
    const currentDate = new Date();
    const endDate = currentDate.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"
    
    // Calculate StartDate as 5 days before EndDate
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - 5);
    const startDateFormatted = startDate.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"

      // console.log(typeof(startDateFormatted));
      // console.log(endDate);
      // console.log("Starting test here");
      // console.log("From:" + this.inputDataFrom.name);
      // console.log("To:" + this.inputDataTo.name);
      
    // const objectToSend = {
    //   StartDate: startDateFormatted,
    //   EndDate: endDate,
    //   Source: 'USD',
    //   Destination: 'NGN',
    // };
    // console.log(sourceCur.name);
    // console.log(typeof(sourceCur.name));
    // console.log(destinationCur.name);
    var source: string = sourceCur.name;//'USD';
    var dest: string = destinationCur.name; //'NGN';
    // const apiUrl = `http://tomisin-001-site1.dtempurl.com/api/v1/exchange/history?StartDate=${startDateFormatted}&EndDate=${endDate}&Source=${sourceCur.name}&Destination=${destinationCur.name}`;
    const apiUrl = `http://tomisin-001-site1.dtempurl.com/api/v1/exchange/history?StartDate=${startDateFormatted}&EndDate=${endDate}&Source=${source}&Destination=${dest}`;
    // console.log(apiUrl);

    this.service.getHistoryData(apiUrl).subscribe(
      response => {
        // console.log('API Response:', response);
        this.response = response;
        // console.log(this.response);
        this.extractData(response);
      },
      error => {
        console.error('API Error:', error);
        // Handle the API error
      }
    );
  }

  //placing data consumed from endpoint into uniform date and rate Arrays
  extractData(response: any): void {
    if (response.data && response.data.rates) {
      // console.log('Extracting data right now!!!')
      // console.log(this.response);
      // console.log((this.response['data']['rates'].values()))[0]
      const data = this.response;
      // console.log(data);

      var currencyCode = Object.keys(data.data.rates[Object.keys(data.data.rates)[0]])[0];
      // console.log(currencyCode);
      // console.log(typeof(currencyCode));
      // wipe existing array before refill
      this.dateArray.length = 0;
      this.rateArray.length = 0;
      for (const date in response.data.rates) {
        // console.log(date);
        // console.log(response.data.rates[date][currencyCode])
        if (response.data.rates.hasOwnProperty(date)) {
          this.dateArray.push(date);
          this.rateArray.push(response.data.rates[date][currencyCode]);
        }

        
      }
    }
    console.log(this.dateArray);
    console.log(this.rateArray);

    this.createChart(this.dateArray, this.rateArray);
  }

  createChart(XaxisData: string[], YaxisData: number[]){

    //destory cavans of one has already been created
    if(this.chart) {
      this.chart.destroy();
    }
  
    this.chart = new Chart("MyChart", {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: XaxisData, 
	       datasets: [
          {
            label: "Rates",
            data: YaxisData,
            backgroundColor: '#DF4902'
          }  
        ]
      },
      options: {
        aspectRatio:2.5
      }
      
    });
  }


  // createChart(){
  
  //   this.chart = new Chart("MyChart", {
  //     type: 'bar', //this denotes tha type of chart

  //     data: {// values on X-Axis
  //       labels: ['2022-05-10', '2022-05-11', '2022-05-12','2022-05-13',
	// 							 '2022-05-14', '2022-05-15', '2022-05-16','2022-05-17', ], 
	//        datasets: [
  //         {
  //           label: "Sales",
  //           data: ['467','576', '572', '79', '92',
	// 							 '574', '573', '576'],
  //           backgroundColor: 'blue'
  //         },
  //         {
  //           label: "Profit",
  //           data: ['542', '542', '536', '327', '17',
	// 								 '0.00', '538', '541'],
  //           backgroundColor: 'limegreen'
  //         }  
  //       ]
  //     },
  //     options: {
  //       aspectRatio:2.5
  //     }
      
  //   });
  // }


}
