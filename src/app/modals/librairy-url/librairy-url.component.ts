import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { LibrairyService } from '../../services/librairy.service';

@Component({
  selector: 'app-librairy-url',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogContent, MatDialogTitle],
  templateUrl: './librairy-url.component.html',
  styleUrl: './librairy-url.component.css',
})
export class LibrairyUrlComponent implements OnInit {
  data = inject(MAT_DIALOG_DATA);
  librairyS = inject(LibrairyService);
  dialogRef = inject(MatDialogRef<LibrairyUrlComponent>);

  url = new FormControl('');
  isUpdate = false;
  ngOnInit() {
    if (this.data.url) {
      this.url.setValue(this.data.url);
      this.isUpdate = true;
    }
  }

  updateUrl() {
    if (!this.url.value) {
      return;
    }
    this.librairyS.updateUrl(this.data.id, this.url.value).subscribe(() => {
      this.librairyS.getOne(this.data.librairyId).subscribe(() => {
        this.dialogRef.close();
      });
    });
  }
}
