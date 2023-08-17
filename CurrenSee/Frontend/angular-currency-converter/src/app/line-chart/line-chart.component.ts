import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CurrencyServiceComponent } from '../currency-service/currency-service.component';
import { Chart } from 'chart.js/auto';


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {
  public chart: any;
  response: any;
  dateArray: string[] = [];
  rateArray: number[] = [];
  @Input() inputDataFrom?: any;
  @Input() inputDataTo?: any;
  @Output() childFunctionCall = new EventEmitter<void>();

  constructor(private apiService: CurrencyServiceComponent) {}

  ngOnInit(): void {
    // this.apiService.getHistory().subscribe((data) => {
    //   return this.createChart(data);
    // });
    // this.createChart();
    // this.sendAndReceive();
  }




  sendAndReceive(): void {
    const currentDate = new Date();
    const endDate = currentDate.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"
    
    // Calculate StartDate as 5 days before EndDate
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - 5);
    const startDateFormatted = startDate.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"

      console.log(typeof(startDateFormatted));
      console.log(endDate);
      console.log("Starting test here");
      console.log("From:" + this.inputDataFrom.name);
      console.log("To:" + this.inputDataTo.name);
      
    // const objectToSend = {
    //   StartDate: startDateFormatted,
    //   EndDate: endDate,
    //   Source: 'USD',
    //   Destination: 'NGN',
    // };

    const apiUrl = `http://tomisin-001-site1.dtempurl.com/api/v1/exchange/history?StartDate=${startDateFormatted}&EndDate=${endDate}&Source=USD&Destination=NGN`;

    this.apiService.getHistoryData(apiUrl).subscribe(
      response => {
        console.log('API Response:', response);
        this.response = response;
        this.extractData(response);
      },
      error => {
        console.error('API Error:', error);
        // Handle the API error
      }
    );
  }

  extractData(response: any): void {
    if (response.data && response.data.rates) {
      for (const date in response.data.rates) {
        if (response.data.rates.hasOwnProperty(date)) {
          this.dateArray.push(date);
          this.rateArray.push(response.data.rates[date].NGN);
        }

        
      }
    }
    console.log(this.dateArray);
    console.log(this.rateArray);

    this.createChart(this.dateArray, this.rateArray);
  }












  // createChart(chartData): void {
  //   const canvas = <HTMLCanvasElement>document.getElementById('lineChart');
  //   const ctx = canvas.getContext('2d');

  //   new Chart('ctx', {
  //     type: 'line',
  //     data: {
  //       labels: chartData.dates,
  //       datasets: [
  //         {
  //           label: 'Rate Data',
  //           data: chartData.rates,
  //           borderColor: 'blue',
  //           fill: false,
  //         },
  //       ],
  //     },
  //   });
  // }

  createChart(Xaxis: string[], Yaxis: number[]){
  
    this.chart = new Chart("MyChart", {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: Xaxis, 
	       datasets: [
          {
            label: "Rates",
            data: Yaxis,
            backgroundColor: '#DF4902'
          }  
        ]
      },
      options: {
        aspectRatio:1.4
      }
      
    });
  }

}