import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChemicalService } from '../../services/chemical.service';
import { Chemical } from '../../models/chemical.model';
import { SafetyBadgeComponent } from '../../components/safety-badge/safety-badge.component';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-chemical-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, SafetyBadgeComponent, LoadingSpinnerComponent],
  templateUrl: './chemical-detail.component.html',
  styleUrl: './chemical-detail.component.scss'
})
export class ChemicalDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private chemicalService = inject(ChemicalService);

  chemical = signal<Chemical | null>(null);
  loading = signal(true);
  error = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.chemicalService.getById(id).subscribe({
        next: (chem) => {
          this.chemical.set(chem);
          this.loading.set(false);
        },
        error: () => {
          this.error.set(true);
          this.loading.set(false);
        }
      });
    }
  }

  getCategoryClass(cat: string): string {
    return 'badge-' + cat.toLowerCase().replace(/[\s-]+/g, '-');
  }
}
