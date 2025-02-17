import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemComponent } from './item.component';
import { ItemService } from '../../services/item.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UnifiedRequestModel } from '../../models/unified-request.model';
import { of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

const mockItemService = {
  getItemById: jest.fn(),
};

const mockRouter = {
  navigate: jest.fn(),
};

const mockActivatedRoute = {
  snapshot: {
    paramMap: {
      get: jest.fn(),
    },
  },
};

const mockItem: UnifiedRequestModel = {
  id: '123',
  address: 'Test Address',
  description: 'Test Description',
};

describe('ItemComponent', () => {
  let component: ItemComponent;
  let fixture: ComponentFixture<ItemComponent>;

  beforeEach(async () => {
    jest.clearAllMocks();

    mockItemService.getItemById.mockReturnValue(of(mockItem));
    mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('123');

    await TestBed.configureTestingModule({
      imports: [
        ItemComponent,
        MatCardModule,
        MatButtonModule,
      ],
      providers: [
        { provide: ItemService, useValue: mockItemService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch item data on init', () => {
    expect(mockActivatedRoute.snapshot.paramMap.get).toHaveBeenCalledWith('id');
    expect(mockItemService.getItemById).toHaveBeenCalledWith('123');
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });

  it('should display item data in the template', () => {
    const compiled = fixture.nativeElement;

    fixture.detectChanges();

    expect(compiled.querySelector('mat-card-subtitle').textContent)
      .toContain(mockItem.id);
    expect(compiled.querySelector('mat-card-content').textContent)
      .toContain(mockItem.description);
  });

  it('should show loading state when item is null', () => {
    mockItemService.getItemById.mockReturnValue(of(null));

    fixture = TestBed.createComponent(ItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.loading-text')).toBeTruthy();
  });

  it('should have a back button that triggers goBack', () => {
    const compiled = fixture.nativeElement;
    const backButton = compiled.querySelector('.back-button');

    expect(backButton).toBeTruthy();

    backButton.click();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });
});
