import { Injectable } from '@angular/core';
import {
  Observable,
  BehaviorSubject,
  scheduled,
  of,
  timer,
  ReplaySubject,
  throwError,
  Subscription,
} from 'rxjs';
import {
  map,
  switchMap,
  shareReplay,
  catchError,
  tap,
  startWith,
  publishReplay,
  refCount,
} from 'rxjs/operators';

export interface Contact {
  id: string;
  name: string;
}

export interface Holding {
  accountNumber: string;
  marketValue: number;
}

export class Data {
  id: number;
}

export class DataError {
  code?: number;
  err: any;
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
  providedIn: 'root',
})
export class DataService {
  loadData(param: number): Observable<Data> {
    return timer(1000).pipe(
      map(() => {
        const modulus = 3;
        console.log('DATA LOADED -->', param, param % modulus);
        if (param !== 0 && param % modulus === 0 && Math.random() > 0.5) {
          throw new Error('fuck off');
        }
        return { id: param };
      })
    );
  }
}

export class Loadable<T> {
  constructor(public data: T, public loading: boolean, public error: any) {}
}

@Injectable({
  providedIn: 'root',
})
export class CurrentContactService {
  private contact$: ReplaySubject<number> = new ReplaySubject(1);

  public test$: Observable<Loadable<Data>>;
  public accounts$: Observable<Account[]>;

  private timer$ = timer(500, 1000);

  constructor(private dataService: DataService) {



    this.test$ =  this.contact$.pipe(
      switchMap((n) => {
        return this.dataService.loadData(n).pipe(
          map((d) => new Loadable<Data>(d, false, null)),
          startWith(new Loadable<Data>(null, false, null))
        );
      }),
      // refCount true: unsubscribe from source when no subscriptions. This causes the "lazy load" to function.
      // When subscribers error out the refcount decreases
      // there's an interesting difference between publishReplay and shareReplay:
      // ShareReplay can be tried again on failure while publishReplay cannot and it kills whole stream
      // publishReplay(1),refCount(),
      shareReplay({ refCount: true, bufferSize: 1 })
      //catchError((err) => of(new Loadable<Data>(null, false, err)))
    );

    let i = 0;
    //setInterval(() => { this.contact$.next(i); i++; }, 2500);

    // this.contact = new BehaviorSubject<Contact>(null);
    // this.test = this.timer$.pipe(
    //   tap(() => console.log('----START------')),
    //   switchMap(a => this.dataService.loadData(a).pipe(
    //     tap(() => console.log('LOADING DATA!', a)),
    //     catchError((err) => of<DataError>({ err: err})))
    //   ),
    //   switchMap(a => a instanceof DataError ? of(a) : of(a).pipe(shareReplay(1))),
    //   tap(a => console.log('TIMER: ', a)),
    // );
  }

  public loadContact(i: number) {
    this.contact$.next(i);
  }
}
