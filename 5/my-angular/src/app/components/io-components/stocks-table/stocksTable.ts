import { Component, OnInit } from '@angular/core';
import {Stock} from "../../../classes/Stock";
import {StocksService} from "../../services/stocksService";

@Component({
  selector: 'stocks-table',
  templateUrl: './stocksTable.html',
  providers: [StocksService],
  styleUrls: ['../../../app.component.css']
})
export class StocksTable implements OnInit{
  stocks: Stock[]
  isCorrect = true;
  value = 0;
  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor(private service: StocksService) {
  }
  ngOnInit(): void {
    this.service.getStocks().subscribe((data: {stocks: Stock[]}) => {
      this.stocks = data.stocks;
    });
  }

  deleteStock(index: number):void {
    this.stocks.splice(index, 1);
  }

  addStock(): void {
    this.stocks.push(new Stock("", 0, 0, 0, 0));
  }

  saveChanges(): void {
    console.log(this.stocks);
    this.isCorrect = true;
    for (let stock of this.stocks) {
      if (stock.name === "" || stock.startingPrice < 0 || stock.maxStep < 0 || stock.number < 0) {
        this.isCorrect = false;
      }
    }

    if (this.isCorrect) {
      this.service.saveStocks(this.stocks);
      alert("Успешно сохранено!");
    }
  }


  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  updateValue(insideValue: number) {
    this.value = insideValue;
    this.onChange(insideValue);
    this.onTouched();
  }
}
