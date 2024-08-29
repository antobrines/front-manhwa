import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { map, Observable, tap } from 'rxjs';
import { Manhwa } from '../interfaces/manhwa';
import { Category } from '../interfaces/category';
import { Response } from '../interfaces/response';
import { TranslateService } from '@ngx-translate/core';
import { ManhwaList } from '../interfaces/manhwa-list';

@Injectable({
  providedIn: 'root',
})
export class ManhwaService {
  private http = inject(HttpClient);
  private translate = inject(TranslateService);

  apiName = 'mangadex';
  manhwaL = signal<ManhwaList>({} as ManhwaList);
  manhwas = signal<Manhwa[]>([]);
  manhwa = signal<Manhwa | null>(null);
  page = signal<number>(0);
  categoriesSelected = signal<string[]>([]);
  categories = signal<Category[]>([]);
  categoriesFiltered = signal<Category[]>([]);
  loadingManhwas = signal<boolean>(false);
  search = signal<string>('');

  typesArray: { name: string; selected: boolean }[] = [
    { name: 'Manhwa', selected: true },
    { name: 'Roman', selected: false },
    { name: 'Manhua', selected: false },
    { name: 'One-shot', selected: false },
    { name: 'Doujin', selected: false },
    { name: 'Amérimanga', selected: false },
  ];
  sortTypesArray(): void {
    this.typesArray.sort((a, b) => a.name.localeCompare(b.name));
  }

  constructor() {
    this.sortTypesArray();
  }

  public getManhwas(isSearch = false): Observable<ManhwaList> {
    this.loadingManhwas.set(true);
    const params: any = {
      page: this.page().toString(),
    };
    if (this.categoriesSelected().length > 0 && !isSearch) {
      const categoriesString = this.categoriesSelected().join(',');
      params.categories = `${categoriesString}`;
    }
    const typeSelected = this.typesArray.find((type) => type.selected);
    if (typeSelected && !isSearch && this.apiName === 'Kitsu') {
      params.type = typeSelected.name;
    }
    params.apiname = this.apiName;
    if (this.search() !== '' && isSearch) {
      params.text = this.search();
      this.categoriesSelected.set([]);
      this.manhwas.set([]);
      params.page = 0;
      params.limit = 20;
      params.apiname = 'mangadex';
    }
    return this.http
      .get<Response<ManhwaList>>(environment.backUrl + 'manhwas', {
        params,
      })
      .pipe(
        tap((manhwaList: Response<ManhwaList>) => {
          if (this.manhwas().length > 0) {
            this.manhwas.set([...this.manhwas(), ...manhwaList.body.manhwas]);
          } else {
            this.manhwas.set(manhwaList.body.manhwas);
          }
          this.manhwaL.set(manhwaList.body);
          this.loadingManhwas.set(false);
        }),
        map((response: Response<ManhwaList>) => response.body)
      );
  }

  public getOne(id: string): Observable<Manhwa> {
    return this.http
      .get<Response<Manhwa>>(environment.backUrl + 'manhwas/' + id, {
        params: { apiname: this.apiName },
      })
      .pipe(
        tap((librairy: Response<Manhwa>) => {
          this.manhwa.set(librairy.body);
        }),
        map((response: Response<Manhwa>) => response.body)
      );
  }

  public getCategories(): Observable<Category[]> {
    return this.http
      .get<Response<Category[]>>(environment.backUrl + 'categories', {
        params: { apiname: this.apiName },
      })
      .pipe(
        tap((response: Response<Category[]>) => {
          this.categories.set(response.body);
          this.categoriesFiltered.set(
            response.body
              .map((category: any) => {
                category.nameTranslate = this.translate.instant(category.name);
                return category;
              })
              .sort((a, b) => a.nameTranslate.localeCompare(b.nameTranslate))
          );
        }),
        map((response: Response<Category[]>) => response.body)
      );
  }

  public searchCategories(search: string): void {
    this.categoriesFiltered.set(
      this.categories().filter((category: Category) => {
        return category.nameTranslate
          ?.toLowerCase()
          .includes(search.toLowerCase());
      })
    );
  }

  public filterCategory(id: string): void {
    this.categoriesSelected.set(
      this.categoriesSelected().includes(id)
        ? this.categoriesSelected().filter((category: any) => category !== id)
        : [...this.categoriesSelected(), id]
    );
    this.resetManhwas();
  }

  public changeType(name: string): void {
    this.typesArray = this.typesArray.map((type) => {
      if (type.name === name) {
        type.selected = !type.selected;
      } else {
        type.selected = false;
      }
      return type;
    });
    this.resetManhwas();
  }

  public resetManhwas(reload = true): void {
    this.manhwas.set([]);
    this.page.set(0);
    this.search.set('');
    if (reload) {
      this.getManhwas().subscribe();
    }
  }

  public changePage(): void {
    this.page.set(this.page() + 1);
    this.getManhwas().subscribe();
  }
}
