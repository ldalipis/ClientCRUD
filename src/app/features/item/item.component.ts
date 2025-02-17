import { CommonModule } from '@angular/common';
import { Component, Signal, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { toSignal } from '@angular/core/rxjs-interop'; // Required to convert Observables to Signals
import { ItemService } from '../../services/item.service';
import { UnifiedRequestModel } from '../../models/unified-request.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent {
  private readonly itemService = inject(ItemService); // Inject the ItemService
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  item: Signal<UnifiedRequestModel | null>;

  constructor() {
    const itemId = this.route.snapshot.paramMap.get('id')!;
    this.item = toSignal(this.itemService.getItemById(itemId), { initialValue: null });
  }

  goBack(): void {
    this.router.navigate(['']);
  }

}
