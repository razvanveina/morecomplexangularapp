import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = 'http://192.168.0.122:3000';

  constructor(private http: HttpClient) { }

  saveData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, data);
  }

  loadData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/load`);
  }
}
