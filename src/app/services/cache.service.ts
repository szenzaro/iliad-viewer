import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Map } from '../utils/index';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  cache: Map<any> = {};

  constructor(
    private http: HttpClient,
  ) {
  }

  cachedGet<T>(path: string): Observable<T> {
    return !!this.cache[path]
      ? of<T>(this.cache[path])
      : this.http.get<T>(path).pipe(tap((x) => this.cache[path] = x));
  }
}
