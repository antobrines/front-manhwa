import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ManhwaService } from '../services/manhwa.service';
import { DatePipe } from '@angular/common';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Category } from '../interfaces/category';
import { Manhwa } from '../interfaces/manhwa';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, InfiniteScrollDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  public manhwas: Array<Manhwa> = [];
  private categories: Array<Category> = [];
  public categoriesFiltered: Array<Category> = [];
  private categoriesSelected: Array<string> = [];
  public loading: boolean = false;
  private page: number = 0;
  private manhwasSubscription: Subscription = new Subscription();
  public typesArray: { name: string; selected: boolean }[] = [
    { name: 'Manhwa', selected: true },
    { name: 'Roman', selected: false },
    { name: 'Manhua', selected: false },
    { name: 'One-shot', selected: false },
    { name: 'Doujin', selected: false },
    { name: 'Amérimanga', selected: false },
  ];

  public sorttypesArray(): void {
    this.typesArray.sort((a, b) => a.name.localeCompare(b.name));
  }

  constructor(
    private manhwaS: ManhwaService,
    private datePipe: DatePipe,
    private translate: TranslateService
  ) {
    this.getCategories();
    this.sorttypesArray();
    translate.use('fr');
  }

  async ngOnInit(): Promise<any> {
    this.initData();
  }

  ngOnDestroy(): void {
    this.manhwasSubscription.unsubscribe();
  }

  initData() {
    this.getManhwas();
  }

  private getManhwas() {
    this.loading = true;
    const typeSelected =
      this.typesArray.find((type) => type.selected)?.name || null;
    this.manhwasSubscription.add(
      this.manhwaS
        .getManhwas(this.page, this.categoriesSelected, typeSelected)
        .subscribe({
          next: (res: any) => {
            this.manhwas = [...this.manhwas, ...res.body];
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          },
        })
    );
  }

  private getCategories() {
    this.manhwaS.getCategories().subscribe((res: any) => {
      this.categories = res.body;
      this.categoriesFiltered = res.body
        .map((category: any) => {
          category.nameTranslate = this.translate.instant(category.name);
          return category;
        })
        .sort((a: any, b: any) =>
          a.nameTranslate.localeCompare(b.nameTranslate)
        );
    });
  }

  public onScroll() {
    this.page++;
    this.getManhwas();
  }

  public changeDate(date: Date): any {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  public async addAnimeList(idAnime: number, idList: number) {}

  public changeRating(event: any) {}

  public changeStatus(name: string) {
    this.page = 0;
    this.manhwas = [];
    this.typesArray = this.typesArray.map((type) => {
      if (type.name === name) {
        type.selected = !type.selected;
      } else {
        type.selected = false;
      }
      return type;
    });
    this.getManhwas();
  }

  public searchCategory(event: any) {
    this.categoriesFiltered = this.categories.filter((category: Category) => {
      return category.nameTranslate
        ?.toLowerCase()
        .includes(event.target.value.toLowerCase());
    });
  }

  public filterCategory(slug: string) {
    this.categoriesSelected = this.categoriesSelected.includes(slug)
      ? this.categoriesSelected.filter((category: any) => category !== slug)
      : [...this.categoriesSelected, slug];
    this.page = 0;
    this.manhwas = [];
    this.getManhwas();
  }
}
