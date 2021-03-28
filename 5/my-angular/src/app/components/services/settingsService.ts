import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Settings} from "../../classes/Settings";

@Injectable()
export class SettingsService {
  private url = 'http://localhost:3005/db/settings'
  constructor(private  http:HttpClient) {

  }
  getSettings() {
    return this.http.get(this.url);
  }

  saveSettings(settings: Settings) {
    this.http.post(this.url, {settings: settings})
      .subscribe((res) => {
        console.log(res);
      });
  }
}
