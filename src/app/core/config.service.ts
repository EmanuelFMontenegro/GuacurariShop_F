// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { firstValueFrom } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class ConfigService {
//   private config: any = {};

//   constructor(private http: HttpClient) {}

//   loadConfig(): Promise<void> {
//     return firstValueFrom(this.http.get('/assets/config.json'))
//       .then(config => {
//         this.config = config;
//       })
//       .catch(err => {
//         console.error('Error loading config.json', err);
//       });
//   }

//   get supabaseUrl(): string {
//     return this.config.supabaseUrl;
//   }

//   get supabaseKey(): string {
//     return this.config.supabaseKey;
//   }
// }
