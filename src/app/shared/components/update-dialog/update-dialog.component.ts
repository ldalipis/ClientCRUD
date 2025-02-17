import { Component, inject, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { UnifiedRequestModel } from '../../../models/unified-request.model';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-dialog',
  standalone: true,
  imports: [
    MatButton,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
  ],
  templateUrl: './update-dialog.component.html',
})
export class UpdateDialogComponent {
  dialogRef = inject(MatDialogRef<UpdateDialogComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: UnifiedRequestModel) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.data);
  }
}
