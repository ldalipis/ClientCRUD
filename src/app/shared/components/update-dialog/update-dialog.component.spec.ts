import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UpdateDialogComponent } from './update-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('UpdateDialogComponent', () => {
  let component: UpdateDialogComponent;
  let fixture: ComponentFixture<UpdateDialogComponent>;
  let mockDialogRef: jest.Mocked<MatDialogRef<UpdateDialogComponent>>;

  const mockData = {
    id: '1',
    address: 'Test Address',
    description: 'Test Description',
  };

  beforeEach(async () => {
    mockDialogRef = {
      close: jest.fn(),
    } as unknown as jest.Mocked<MatDialogRef<UpdateDialogComponent>>;

    await TestBed.configureTestingModule({
      imports: [
        UpdateDialogComponent,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with provided data', () => {
    expect(component.data).toEqual(mockData);
  });

  it('should close dialog without data when cancelled', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith();
  });

  it('should close dialog with updated data when saved', () => {
    const updatedData = {
      ...mockData,
      address: 'Updated Address',
    };
    component.data = updatedData;

    component.onSave();
    expect(mockDialogRef.close).toHaveBeenCalledWith(updatedData);
  });
});
