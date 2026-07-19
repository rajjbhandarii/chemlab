import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChemicalService } from '../../services/chemical.service';
import { ChemicalListItem, CategoryCount } from '../../models/chemical.model';
import { ChemicalCardComponent } from '../../components/chemical-card/chemical-card.component';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';

@Component({
  selector: 'app-chemicals',
  standalone: true,
  imports: [CommonModule, FormsModule, ChemicalCardComponent, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './chemicals.component.html',
  styleUrl: './chemicals.component.scss'
})
export class ChemicalsComponent implements OnInit {
  private chemicalService = inject(ChemicalService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  chemicals = signal<ChemicalListItem[]>([]);
  categories = signal<CategoryCount[]>([]);
  loading = signal(true);
  searchQuery = signal('');
  selectedCategory = signal<string | null>(null);
  currentPage = signal(1);
  totalPages = signal(1);
  total = signal(0);

  private readonly limit = 24;

  ngOnInit(): void {
    this.chemicalService.getCategories().subscribe(cats => {
      this.categories.set(cats);
    });

    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory.set(params['category']);
      }
      this.loadChemicals();
    });
  }

  loadChemicals(): void {
    this.loading.set(true);
    const cat = this.selectedCategory() || undefined;

    this.chemicalService.getAll(this.currentPage(), this.limit, cat).subscribe({
      next: (res) => {
        this.chemicals.set(res.chemicals);
        this.totalPages.set(res.pagination.pages);
        this.total.set(res.pagination.total);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  selectCategory(category: string | null): void {
    this.selectedCategory.set(category);
    this.currentPage.set(1);
    this.router.navigate([], {
      queryParams: category ? { category } : {},
      queryParamsHandling: category ? 'merge' : ''
    });
    this.loadChemicals();
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    if (query.length >= 2) {
      this.loading.set(true);
      this.chemicalService.search(query, 50).subscribe({
        next: (results) => {
          this.chemicals.set(results as any);
          this.totalPages.set(1);
          this.total.set(results.length);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } else if (query.length === 0) {
      this.loadChemicals();
    }
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadChemicals();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    for (let i = start; i <= end; i++) { pages.push(i); }
    return pages;
  }
}
