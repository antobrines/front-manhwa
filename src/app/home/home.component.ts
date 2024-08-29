import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ManhwaService } from '../services/manhwa.service';
import { DatePipe } from '@angular/common';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { LoaderComponent } from '../templates/loader/loader.component';
import { LibrairyService } from './../services/librairy.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    InfiniteScrollDirective,
    LoaderComponent,
    MatTooltipModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private librairyS = inject(LibrairyService);
  private manhwaS = inject(ManhwaService);
  private datePipe = inject(DatePipe);

  manhwasLibrairy = this.librairyS.manhwasLibrairy;
  librairies = this.librairyS.librairies;
  manhwas = this.manhwaS.manhwas;
  manhwaL = this.manhwaS.manhwaL;
  page = this.manhwaS.page;
  categories = this.manhwaS.categories;
  categoriesFiltered = this.manhwaS.categoriesFiltered;
  categoriesSelected = this.manhwaS.categoriesSelected;
  loadingManhwas = this.manhwaS.loadingManhwas;
  typesArray = this.manhwaS.typesArray;
  isAdding = false;
  apiName = this.manhwaS.apiName;

  ngOnInit(): void {
    this.librairyS.getManhwasFromLibrairy().subscribe();
    this.librairyS.getAll().subscribe();
    this.manhwaS.getManhwas().subscribe();
    this.manhwaS.getCategories().subscribe();
  }

  ngOnDestroy(): void {
    this.manhwaS.manhwas.set([]);
    this.manhwaS.categoriesSelected.set([]);
  }

  onScroll() {
    if (
      !this.manhwaS.loadingManhwas() &&
      this.manhwaL().count !== this.manhwaS.manhwas().length
    ) {
      this.manhwaS.changePage();
    }
  }

  changeDate(date: Date): any {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  async addAnimeList(idAnime: string, idList: string) {
    this.isAdding = true;
    this.librairyS.addManhwaToLibrairy(idList, idAnime).subscribe(() => {
      this.librairyS.getManhwasFromLibrairy().subscribe(() => {
        this.isAdding = false;
      });
    });
  }

  changeType(name: string) {
    this.manhwaS.changeType(name);
  }

  searchCategory(event: any) {
    this.manhwaS.searchCategories(event.target.value);
  }

  filterCategory(id: string) {
    console.log(id);
    this.manhwaS.filterCategory(id);
  }
}
