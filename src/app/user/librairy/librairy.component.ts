import { NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LibrairyService } from '../../services/librairy.service';
import { LoaderComponent } from '../../templates/loader/loader.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { LibrairyUrlComponent } from '../../modals/librairy-url/librairy-url.component';
import { RemoveListComponent } from '../../modals/remove-list/remove-list.component';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-manhwa',
  standalone: true,
  imports: [
    NgClass,
    RouterModule,
    ReactiveFormsModule,
    LoaderComponent,
    MatTooltipModule,
  ],
  templateUrl: './librairy.component.html',
  styleUrl: './librairy.component.css',
})
export class LibrairyComponent implements OnInit, OnDestroy {
  private librairyS = inject(LibrairyService);
  private dialog = inject(MatDialog);

  basicList: any[] = ['planned', 'current', 'completed', 'on_old'];
  librairies = this.librairyS.librairies;
  librairy = this.librairyS.librairy;
  loading = false;
  disabled = false;
  currentLibrairyId = '';

  ngOnInit() {
    this.loading = true;
    this.librairyS.getAll().subscribe((librairies) => {
      if (librairies.length > 0) {
        this.getOne(librairies[0]._id);
      }
      this.loading = false;
    });
  }

  ngOnDestroy() {
    this.librairyS.librairy.set(null);
  }

  public getOne(id: string) {
    this.loading = true;
    this.librairyS.getOne(id).subscribe(() => {
      this.currentLibrairyId = id;
      this.loading = false;
    });
  }

  public removeManhwaFromLibrairy(id: string | undefined, manhwaId: string) {
    if (!id) {
      return;
    }
    const dialogRef = this.dialog.open(RemoveListComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.librairyS.removeManhwaFromLibrairy(id, manhwaId).subscribe(() => {
          this.getOne(id);
          this.librairyS.getAll().subscribe();
        });
      }
    });
  }

  public updateNbChapterViewed(event: any, id: string) {
    this.disabled = true;
    this.librairyS
      .updateNbChapterViewed(id, event.target.value)
      .subscribe(() => {
        this.disabled = false;
      });
  }

  public openDialog(id: string, librairyId: string, url?: string) {
    this.dialog.open(LibrairyUrlComponent, {
      data: { id, librairyId, url },
      width: '300px',
    });
  }

  public getUrlImage(url: string | undefined) {
    if (!url) {
      return '';
    }
    return `${environment.backUrl}proxy-image?url=${encodeURIComponent(url)}`;
  }
}
