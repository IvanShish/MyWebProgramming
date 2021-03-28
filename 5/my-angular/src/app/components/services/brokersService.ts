import {Broker} from "../../classes/Broker";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable()
export class BrokersService {
  private url = 'http://localhost:3005/db/brokers'
  constructor(private  http:HttpClient) {

  }
  getBrokers() {
    return this.http.get(this.url);
  }

  saveBrokers(brokers: Broker[]) {
    this.http.post(this.url, {brokers: brokers})
      .subscribe((res) => {
        console.log(res);
      });
  }
}
