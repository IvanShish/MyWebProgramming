import {Component} from "@angular/core";
import {SettingsService} from "../../services/settingsService";
import {Settings} from "../../../classes/Settings";

@Component({
  selector: 'settings-form',
  templateUrl: './settingsForm.html',
  providers: [SettingsService],
  styleUrls: ['../../../app.component.css']
})

export class SettingsForm {
  settings: Settings;
  isCorrect = true;

  constructor(private service: SettingsService) {
  }

  ngOnInit(): void {
    this.service.getSettings().subscribe((data: {settings: Settings}) => {
      this.settings = data.settings;
    });
  }

  saveChanges(): void {
    this.isCorrect = true;
    if (this.settings.interval <= 0 || this.settings.datetimeStart == "" || this.settings.datetimeEnd =="") {
      this.isCorrect = false;
    } else {
      this.service.saveSettings(this.settings);
      alert("Успешно сохранено!");
    }
  }
}
