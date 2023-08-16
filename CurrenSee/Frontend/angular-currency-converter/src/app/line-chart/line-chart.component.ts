import { Component, OnInit, Input } from '@angular/core';
import { CurrencyServiceComponent } from '../currency-service/currency-service.component';
import { Chart } from 'chart.js/auto';


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {
  public chart: any;

  constructor(private apiService: CurrencyServiceComponent) {}

  ngOnInit(): void {
    // this.apiService.getHistory().subscribe((data) => {
    //   return this.createChart(data);
    // });
    this.createChart();
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

  createChart(){
  
    this.chart = new Chart("MyChart", {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['2022-05-10', '2022-05-11', '2022-05-12','2022-05-13',
								 '2022-05-14', '2022-05-15', '2022-05-16','2022-05-17', ], 
	       datasets: [
          {
            label: "Sales",
            data: ['467','576', '572', '79', '92',
								 '574', '573', '576'],
            backgroundColor: 'blue'
          },
          {
            label: "Profit",
            data: ['542', '542', '536', '327', '17',
									 '0.00', '538', '541'],
            backgroundColor: 'limegreen'
          }  
        ]
      },
      options: {
        aspectRatio:2.5
      }
      
    });
  }
}
