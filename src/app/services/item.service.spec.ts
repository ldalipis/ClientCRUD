import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ItemService } from './item.service';
import { UnifiedRequestModel } from '../models/unified-request.model';

describe('ItemService', () => {
  let service: ItemService;
  let httpMock: HttpTestingController;
  const baseUrl = 'https://localhost:7293/items';

  // Mock item data
  const mockItem: UnifiedRequestModel = {
    id: '123',
    address: 'Test Address',
    description: 'Test Description',
  };

  const mockItems: UnifiedRequestModel[] = [
    mockItem,
    {
      id: '456',
      address: 'Another Address',
      description: 'Another Description',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ItemService],
    });

    service = TestBed.inject(ItemService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify that no unmatched requests are outstanding
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllItems', () => {
    it('should return all items', () => {
      service.getAllItems().subscribe(items => {
        expect(items).toEqual(mockItems);
        expect(items.length).toBe(2);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockItems);
    });

    it('should handle error when getting all items fails', () => {
      service.getAllItems().subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(baseUrl);
      req.flush('Not Found', {
        status: 404,
        statusText: 'Not Found',
      });
    });
  });

  describe('getItemById', () => {
    it('should return a single item by id', () => {
      const itemId = '123';

      service.getItemById(itemId).subscribe(item => {
        expect(item).toEqual(mockItem);
      });

      const req = httpMock.expectOne(`${baseUrl}/${itemId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockItem);
    });

    it('should handle error when getting item by id fails', () => {
      const itemId = 'invalid-id';

      service.getItemById(itemId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${baseUrl}/${itemId}`);
      req.flush('Not Found', {
        status: 404,
        statusText: 'Not Found',
      });
    });
  });

  describe('createItem', () => {
    it('should create a new item', () => {
      const newItem: UnifiedRequestModel = {
        id: '789',
        address: 'New Address',
        description: 'New Description',
      };

      service.createItem(newItem).subscribe(item => {
        expect(item).toEqual(newItem);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newItem);
      req.flush(newItem);
    });

    it('should handle error when creation fails', () => {
      const invalidItem = {} as UnifiedRequestModel;

      service.createItem(invalidItem).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        },
      });

      const req = httpMock.expectOne(baseUrl);
      req.flush('Bad Request', {
        status: 400,
        statusText: 'Bad Request',
      });
    });
  });

  describe('updateItem', () => {
    it('should update an existing item', () => {
      const updatedItem: UnifiedRequestModel = {
        ...mockItem,
        description: 'Updated Description',
      };

      service.updateItem(updatedItem).subscribe(item => {
        expect(item).toEqual(updatedItem);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedItem);
      req.flush(updatedItem);
    });

    it('should handle error when update fails', () => {
      const invalidItem = {} as UnifiedRequestModel;

      service.updateItem(invalidItem).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        },
      });

      const req = httpMock.expectOne(baseUrl);
      req.flush('Bad Request', {
        status: 400,
        statusText: 'Bad Request',
      });
    });
  });

  describe('deleteItem', () => {
    it('should delete an item', () => {
      const itemId = '123';

      service.deleteItem(itemId).subscribe(response => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`${baseUrl}/${itemId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle error when deletion fails', () => {
      const itemId = 'invalid-id';

      service.deleteItem(itemId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${baseUrl}/${itemId}`);
      req.flush('Not Found', {
        status: 404,
        statusText: 'Not Found',
      });
    });
  });
});
