import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {Routes, RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {StocksComponent} from "./components/page-components/stocks/stocks";
import {SetComponent} from "./components/page-components/settings/settings";
import {NotfoundComponent} from "./components/page-components/notfound/notfound";
import {BrokersComponent} from "./components/page-components/brokers/brokers";
import {BrokersTable} from "./components/io-components/brokers-table/brokersTable";
import {StocksTable} from "./components/io-components/stocks-table/stocksTable";
import {SettingsForm} from "./components/io-components/setings-form/settingsForm";

const appRoutes: Routes = [
  {path: '', component: StocksComponent},
  {path: 'stocks', component: StocksComponent},
  {path: 'brokers', component: BrokersComponent},
  {path: 'settings', component: SetComponent},
  {path: '**', component: NotfoundComponent}
]


@NgModule({
  declarations: [
    AppComponent, StocksComponent, SetComponent, NotfoundComponent, BrokersComponent, BrokersTable, StocksTable, SettingsForm
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    FormsModule
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
