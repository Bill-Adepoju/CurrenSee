import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Currency } from 'src/app/Currency';
import { of, Observable } from 'rxjs';
//import { CURRENCIES } from 'src/app/mock-currency';
import {DATA } from 'src/app/mock-chat-data';

@Injectable({
  providedIn: 'root',
})
export class CurrencyServiceComponent{

  private currencies:Currency[] = [];
  private lastUpdate;
  // private apiUrl = 'http://tomisin-001-site1.dtempurl.com/api/v1/exchange/history';
  constructor(private http: HttpClient) {
  }

  public getCurrencies(){
    return this.currencies;
  }

  public getLastUpdate(){
      return this.lastUpdate;
  }

  public getCurrenciesPromise() {
    return new Promise<any>((resolve, reject) => {
    if(this.currencies.length==0)
    {
      this.http.get<any>('https://open.er-api.com/v6/latest/USD').subscribe(data => {
        for (var key in data.rates){
          var value = data.rates[key];
          let currency:Currency = {rate: value, full_name: '', name: key, symbol: ''};
          this.currencies.push(currency);
          console.log(this.currencies);
        }
          this.lastUpdate = data.time_last_update_utc;
        this.http.get<any>('https://restcountries.com/v3.1/all?fields=currencies').subscribe(data => {

          data.forEach(currency => {
              let name = Object.keys(currency.currencies)[0]
              // console.log(name)
              var index = this.currencies.findIndex(element => element.name==name);
              // console.log(index);
              if (index!=-1)
                this.currencies[index] = {...this.currencies[index], full_name: currency.currencies[name].name, symbol: currency.currencies[name].symbol}
          }
          )
          resolve(this.currencies);
        },
          () => {
            reject();
          }
        )
      },
        () => {
          reject();
        }
      )
    }
    else {
      resolve(this.currencies);
    }
  })}

  getHistory() {
    const historicData = of(DATA);
    return historicData;
  }

  getHistoryData (url: string): Observable<any> {
    return this.http.get(url);
  }
}


