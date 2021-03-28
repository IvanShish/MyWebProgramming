import { Component, OnInit } from '@angular/core';
import {Broker} from "../../../classes/Broker";
import {BrokersService} from "../../services/brokersService";


@Component({
  selector: 'brokers-table',
  templateUrl: './brokersTable.html',
  providers: [BrokersService],
  styleUrls: ['../../../app.component.css']
})
export class BrokersTable implements OnInit{
  brokers: Broker[]
  isCorrect = true;

  constructor(private service: BrokersService) {
  }
  ngOnInit(): void {
    console.log(this.service.getBrokers().subscribe((data: {brokers: Broker[]}) => {
      this.brokers = data.brokers;
    }));
  }

  deleteBroker(index: number):void {
    this.brokers.splice(index, 1);
  }

  addBroker(): void {
    this.brokers.push(new Broker("", "", 0));
  }

  saveChanges(): void {
    this.isCorrect = true;
    for (let broker of this.brokers) {
      if (broker.login === "" || broker.name === "" || broker.balance < 0) {
        this.isCorrect = false;
      }
    }

    if (this.isCorrect) {
      this.service.saveBrokers(this.brokers);
      alert("Успешно сохранено!");
    }
  }
}
