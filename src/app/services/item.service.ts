import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UnifiedRequestModel } from '../models/unified-request.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private baseUrl = 'https://localhost:7293/items';
  private http = inject(HttpClient);

  getAllItems(): Observable<UnifiedRequestModel[]> {
    return this.http.get<UnifiedRequestModel[]>(`${this.baseUrl}`);
  }

  getItemById(id: string): Observable<UnifiedRequestModel> {
    return this.http.get<UnifiedRequestModel>(`${this.baseUrl}/${id}`);
  }

  createItem(newItem: UnifiedRequestModel): Observable<UnifiedRequestModel> {
    return this.http.post<UnifiedRequestModel>(this.baseUrl, newItem);
  }

  updateItem(updatedItem: UnifiedRequestModel): Observable<UnifiedRequestModel> {
    return this.http.put<UnifiedRequestModel>(`${this.baseUrl}`, updatedItem);
  }

  deleteItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
