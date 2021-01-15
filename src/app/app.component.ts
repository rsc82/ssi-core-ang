import { Component, OnInit } from '@angular/core';

import { CurrentContactService } from './shared/services/current-contact.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ssi-core-ang';

  public i: number = 0;
  private subscriptions: Subscription[] = [];

  public get subscriptionCount(): number {
    return this.subscriptions.length;
  }

  constructor(private currentContactService: CurrentContactService) { }
  ngOnInit(): void {
    // this.currentContactService.test.subscribe(a => {
    //   console.log('Holdings ITEM: ', a);
    // }, (err) => {
    //   console.log('Holdings ERR: ', err);
    // });
  }

  public doThang(): void {
    this.subscriptions.push(this.currentContactService.test$.subscribe((t) => console.log('SUB: ', t), (err) => console.error(err)));
  }

  public clear(): void {
    this.subscriptions.forEach(v => v.unsubscribe());
    this.subscriptions = [];
  }

  public loadContact(): void {
    this.i++;
    this.currentContactService.loadContact(this.i);
  }

  public refreshData() {
    //this.currentContactService.testReload$.next();
    console.error('not implemented)');
  }

}
