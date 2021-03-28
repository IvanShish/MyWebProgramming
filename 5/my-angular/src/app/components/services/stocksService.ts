import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Stock} from "../../classes/Stock";

@Injectable()
export class StocksService {
  private url = 'http://localhost:3005/db/stocks'
  constructor(private  http:HttpClient) {

  }
  getStocks() {
    return this.http.get(this.url);
  }

  saveStocks(stocks: Stock[]) {
    this.http.post(this.url, {stocks: stocks})
      .subscribe((res) => {
        console.log(res);
      });
  }
}
