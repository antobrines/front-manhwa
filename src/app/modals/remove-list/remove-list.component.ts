import { Component, inject } from '@angular/core';
import {
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-remove-list',
  standalone: true,
  imports: [MatDialogClose, MatDialogContent, MatDialogTitle],
  templateUrl: './remove-list.component.html',
  styleUrl: './remove-list.component.css',
})
export class RemoveListComponent {
  dialogRef = inject(MatDialogRef<RemoveListComponent>);

  onNoClick(): void {
    this.dialogRef.close();
  }
}
