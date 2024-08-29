import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ManhwaService } from '../services/manhwa.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LoaderComponent } from '../templates/loader/loader.component';
import { TranslateService } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LibrairyService } from '../services/librairy.service';

@Component({
  selector: 'app-manhwa',
  standalone: true,
  imports: [CommonModule, LoaderComponent, MatTooltipModule],
  templateUrl: './manhwa.component.html',
  styleUrl: './manhwa.component.css',
})
export class ManhwaComponent {
  private manhwaS = inject(ManhwaService);
  private datePipe = inject(DatePipe);
  private route = inject(ActivatedRoute);
  private translate = inject(TranslateService);
  private librairyS = inject(LibrairyService);
  anime: any = {};
  idAnime: any = 0;
  manhwa = this.manhwaS.manhwa;
  librairies = this.librairyS.librairies;
  manhwasLibrairy = this.librairyS.manhwasLibrairy;

  ngOnInit() {
    this.idAnime = this.route.snapshot.paramMap.get('id');
    this.manhwaS.getOne(this.idAnime).subscribe();
    this.librairyS.getAll().subscribe();
    this.librairyS.getManhwasFromLibrairy().subscribe();
  }

  ngOnDestroy() {
    this.manhwaS.manhwa.set(null);
  }

  changeDate(date?: Date): any {
    if (!date) {
      return '';
    }
    return this.datePipe.transform(date, 'yyyy');
  }

  capitalizeFirstLetter(string?: string): string {
    if (!string) {
      return '';
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getStatusTranslated(status?: string): string {
    if (!status) {
      return '';
    }
    return this.translate.instant(status);
  }

  addManhwa(id: string, manhwaId: string | undefined): void {
    if (!manhwaId) {
      return;
    }
    this.librairyS.addManhwaToLibrairy(id, manhwaId).subscribe(() => {
      this.librairyS.getManhwasFromLibrairy().subscribe();
    });
  }
}
