import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Contact {
  id: string;
  name: string;
}

export interface Holding {
  accountNumber: string;
  marketValue: number;
}

// This might or might not be a good idea for error handling:
// export interface Loader {
//   isLoading: boolean;
//   percentage: number;
//   error: Error;
// }
// export interface LoadableObservable<T> {
//   stream: Observable<T>;
//   loader: Observable<Loader>;
// }

@Injectable({
  providedIn: 'root'
})
export class CurrentContactService {

  private contact: Contact;

  public holdings: Observable<Holding[]>;
  public accounts: Observable<Account[]>;

  constructor() { }

  public loadContact(id: string) {
    this.contact = {
      id: id,
      name: 'Roderik Steenbergen'
    }
  }

}
