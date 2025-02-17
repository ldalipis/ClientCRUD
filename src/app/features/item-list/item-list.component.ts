import { Component, effect, inject, signal } from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { UnifiedRequestModel } from '../../models/unified-request.model';
import { ItemService } from '../../services/item.service';
import { MatButton } from '@angular/material/button';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UpdateDialogComponent } from '../../shared/components/update-dialog/update-dialog.component';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-item-list',
  standalone: true,
  templateUrl: './item-list.component.html',
  imports: [
    MatButton,
    MatTable,
    MatHeaderCell,
    MatColumnDef,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatToolbar,
  ],
  styleUrls: ['./item-list.component.scss'],
})
export class ItemListComponent {
  displayedColumns: string[] = ['id', 'address', 'description', 'actions'];
  dataSource: MatTableDataSource<UnifiedRequestModel> | null = null;

  private itemService = inject(ItemService);
  private dialog = inject(MatDialog);

  items = signal<UnifiedRequestModel[]>([]);

  constructor() {
    this.fetchAllItems();

    effect(() => {
      this.dataSource = new MatTableDataSource<UnifiedRequestModel>(this.items());
    });
  }

  private fetchAllItems(): void {
    this.itemService.getAllItems().subscribe((data) => {
      this.items.set(data);
    });
  }

  createItem(): void {
    const dialogRef = this.dialog.open(UpdateDialogComponent, {
      data: { id: crypto.randomUUID(), address: '', description: '' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.itemService.createItem(result).subscribe(() => this.refreshItems());
      }
    });
  }

  updateItem(item: UnifiedRequestModel): void {
    const dialogRef = this.dialog.open(UpdateDialogComponent, {
      data: { ...item },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.itemService.updateItem(result).subscribe(() => {
          this.items.set(
            this.items().map((i) =>
              i.id === result.id ? result : i,
            ),
          );
        });
      }
    });
  }

  deleteItem(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.itemService.deleteItem(id).subscribe(() => {
          this.items.set(this.items().filter((item) => item.id !== id));
        });
      }
    });
  }

  private refreshItems(): void {
    this.fetchAllItems();
  }
}
