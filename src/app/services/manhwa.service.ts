import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { firstValueFrom, lastValueFrom, Subject, Subscriber } from 'rxjs';
import { Manhwa } from '../interfaces/manhwa';
import { Category } from '../interfaces/category';

@Injectable({
  providedIn: 'root',
})
export class ManhwaService {
  constructor(private http: HttpClient) {}

  public getManhwas(
    page: number,
    categories: Array<string>,
    typeSelected: string | null
  ): Subject<Manhwa[]> {
    const params: any = {
      page: page.toString(),
    };

    if (categories.length > 0) {
      const categoriesString = categories.join(',');
      params.categories = `${categoriesString}`;
    }
    if (typeSelected) {
      params.type = typeSelected;
    }
    return this.http.get(environment.backUrl + 'manhwas', {
      params,
    }) as Subject<any>;
  }

  public getManhwaById(id: number): Subject<Manhwa> {
    return this.http.get(environment.backUrl + 'manhwas/' + id) as Subject<any>;
  }

  public getCategories(): Subject<Category> {
    return this.http.get(environment.backUrl + 'categories') as Subject<any>;
  }
}
