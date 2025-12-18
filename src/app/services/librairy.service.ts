import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable, tap } from 'rxjs';
import { Response } from '../interfaces/response';
import { Librairy } from '../interfaces/librairy';
import { LibrairyInfo } from '../interfaces/librairy-info';
import { ManhwaService } from './manhwa.service';

@Injectable({
  providedIn: 'root',
})
export class LibrairyService {
  librairies = signal<Librairy[]>([]);
  librairy = signal<LibrairyInfo | null>(null);
  manhwasLibrairy = signal<string[]>([]);
  manhwaService = inject(ManhwaService);
  constructor(private http: HttpClient) {}

  public getAll(): Observable<Librairy[]> {
    return this.http.get<Response<Librairy[]>>('/api/librairies').pipe(
      tap((librairies: Response<Librairy[]>) => {
        this.librairies.set(librairies.body);
      }),
      map((response: Response<Librairy[]>) => response.body)
    );
  }

  public getOne(id: string, sort?: string): Observable<LibrairyInfo> {
    return this.http
      .get<Response<LibrairyInfo>>('/api/librairies/' + id, {
        params: {
          sort: sort || 'nbChapterViewedDesc',
        },
      })
      .pipe(
        tap((librairy: Response<LibrairyInfo>) => {
          this.librairy.set(librairy.body);
        }),
        map((response: Response<LibrairyInfo>) => response.body)
      );
  }

  public removeManhwaFromLibrairy(
    id: string,
    manhwaId: string
  ): Observable<any> {
    return this.http.delete('/api/librairies/' + id + '/manhwa/' + manhwaId, {
      params: {
        apiName: this.manhwaService.apiName,
      },
    });
  }

  public updateManhwaFromLibrairy(
    fromList: string,
    toList: string,
    manhwaId: string
  ): Observable<any> {
    return this.http.put(
      '/api/librairies/' +
        fromList +
        '/manhwa/' +
        manhwaId +
        '/new-librairy/' +
        toList,
      {
        params: {
          apiName: this.manhwaService.apiName,
        },
      }
    );
  }

  public addManhwaToLibrairy(id: string, manhwaId: string): Observable<any> {
    return this.http.post('/api/librairies/' + id + '/manhwa/' + manhwaId, {
      params: {
        apiName: this.manhwaService.apiName,
      },
    });
  }

  public getManhwasFromLibrairy(): Observable<string[]> {
    return this.http.get<Response<string[]>>('/api/librairies/manhwas').pipe(
      tap((manhwas: Response<string[]>) => {
        this.manhwasLibrairy.set(manhwas.body);
      }),
      map((response: Response<string[]>) => response.body)
    );
  }

  public updateNbChapterViewed(
    id: string,
    nbChapterViewed: number
  ): Observable<any> {
    return this.http.put('/api/manhwas-personnal/' + id + '/chapters', {
      nbChapterViewed,
    });
  }

  public updateUrl(id: string, url: string): Observable<any> {
    return this.http.put('/api/manhwas-personnal/' + id + '/url', {
      url,
    });
  }
}
