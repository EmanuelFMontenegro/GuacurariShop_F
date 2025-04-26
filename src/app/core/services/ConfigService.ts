import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly apiUrl: string = 'http://localhost:8080';  

  constructor() {}

  getApiUrl(): string {
    return this.apiUrl;
  }
}
