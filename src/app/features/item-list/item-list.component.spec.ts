import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ItemListComponent } from './item-list.component';
import { ItemService } from '../../services/item.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { UnifiedRequestModel } from '../../models/unified-request.model';
import { MatTableDataSource } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const mockItems: UnifiedRequestModel[] = [
  { id: '1', address: 'Address 1', description: 'Description 1' },
  { id: '2', address: 'Address 2', description: 'Description 2' },
];

const mockItemService = {
  getAllItems: jest.fn(),
  createItem: jest.fn(),
  updateItem: jest.fn(),
  deleteItem: jest.fn(),
};

const mockDialog = {
  open: jest.fn(),
};

const mockRouter = {
  navigate: jest.fn(),
};

describe('ItemListComponent', () => {
  let component: ItemListComponent;
  let fixture: ComponentFixture<ItemListComponent>;
  let mockDialogRef: { afterClosed: jest.Mock };

  beforeEach(async () => {
    jest.clearAllMocks();

    mockDialogRef = {
      afterClosed: jest.fn(),
    };

    mockItemService.getAllItems.mockReturnValue(of(mockItems));
    mockDialog.open.mockReturnValue(mockDialogRef);
    mockDialogRef.afterClosed.mockReturnValue(of(false));

    await TestBed.configureTestingModule({
      imports: [
        ItemListComponent,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: ItemService, useValue: mockItemService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch items on init', () => {
    expect(mockItemService.getAllItems).toHaveBeenCalled();
    expect(component.items()).toEqual(mockItems);
    expect(component.dataSource).toBeInstanceOf(MatTableDataSource);
  });

  describe('viewItem', () => {
    it('should navigate to item detail view', () => {
      const itemId = '1';
      component.viewItem(itemId);
      expect(mockRouter.navigate).toHaveBeenCalledWith([`item/${itemId}`]);
    });
  });

  describe('createItem', () => {
    it('should open create dialog and create item on confirmation', () => {
      const newItem: UnifiedRequestModel = {
        id: '3',
        address: 'New Address',
        description: 'New Description',
      };

      mockDialogRef.afterClosed.mockReturnValue(of(newItem));
      mockItemService.createItem.mockReturnValue(of(newItem));

      component.createItem();

      expect(mockDialog.open).toHaveBeenCalled();
      expect(mockItemService.createItem).toHaveBeenCalledWith(newItem);
      expect(mockItemService.getAllItems).toHaveBeenCalled();
    });

    it('should not create item when dialog is cancelled', () => {
      mockDialogRef.afterClosed.mockReturnValue(of(null));

      component.createItem();

      expect(mockDialog.open).toHaveBeenCalled();
      expect(mockItemService.createItem).not.toHaveBeenCalled();
    });
  });

  describe('updateItem', () => {
    it('should open update dialog and update item on confirmation', () => {
      const updatedItem: UnifiedRequestModel = {
        ...mockItems[0],
        description: 'Updated Description',
      };

      mockDialogRef.afterClosed.mockReturnValue(of(updatedItem));
      mockItemService.updateItem.mockReturnValue(of(updatedItem));

      component.updateItem(mockItems[0]);

      expect(mockDialog.open).toHaveBeenCalled();
      expect(mockItemService.updateItem).toHaveBeenCalledWith(updatedItem);
    });

    it('should not update item when dialog is cancelled', () => {
      mockDialogRef.afterClosed.mockReturnValue(of(null));

      component.updateItem(mockItems[0]);

      expect(mockDialog.open).toHaveBeenCalled();
      expect(mockItemService.updateItem).not.toHaveBeenCalled();
    });

    it('should update items signal after successful update', () => {
      const updatedItem: UnifiedRequestModel = {
        ...mockItems[0],
        description: 'Updated Description',
      };

      mockDialogRef.afterClosed.mockReturnValue(of(updatedItem));
      mockItemService.updateItem.mockReturnValue(of(updatedItem));

      component.items.set(mockItems);
      component.updateItem(mockItems[0]);

      expect(component.items()).toContainEqual(updatedItem);
    });
  });

  describe('deleteItem', () => {
    it('should open confirm dialog and delete item on confirmation', () => {
      const itemId = '1';
      mockDialogRef.afterClosed.mockReturnValue(of(true));
      mockItemService.deleteItem.mockReturnValue(of(void 0));

      component.items.set(mockItems);
      component.deleteItem(itemId);

      expect(mockDialog.open).toHaveBeenCalled();
      expect(mockItemService.deleteItem).toHaveBeenCalledWith(itemId);
      expect(component.items().length).toBe(1);
      expect(component.items().find(item => item.id === itemId)).toBeUndefined();
    });

    it('should not delete item when dialog is cancelled', () => {
      mockDialogRef.afterClosed.mockReturnValue(of(false));

      component.deleteItem('1');

      expect(mockDialog.open).toHaveBeenCalled();
      expect(mockItemService.deleteItem).not.toHaveBeenCalled();
    });
  });

  describe('MatTableDataSource', () => {
    it('should update dataSource when items signal changes', fakeAsync(() => {
      const newItems = [mockItems[0]];
      component.items.set(newItems);
      tick();

      expect(component.dataSource?.data).toEqual(newItems);
    }));

    it('should initialize with correct columns', () => {
      expect(component.displayedColumns).toEqual([
        'id',
        'address',
        'description',
        'actions',
      ]);
    });
  });

  describe('Error handling', () => {
    it('should handle errors when fetching items fails', () => {
      mockItemService.getAllItems.mockReturnValue(
        of(new Error('Failed to fetch items')),
      );

      component.items.set([]);
      fixture.detectChanges();

      expect(component.items()).toEqual([]);
    });
  });
});
