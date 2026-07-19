import { Component, signal, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { SearchService } from '../../services/search.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private themeService = inject(ThemeService);
  private searchService = inject(SearchService);
  private router = inject(Router);

  mobileMenuOpen = signal(false);
  toolsDropdownOpen = signal(false);
  searchQuery = signal('');
  searchResults = signal<any>(null);
  showSearchResults = signal(false);
  scrolled = signal(false);

  private searchSubject = new Subject<string>();

  navLinks = [
    { path: '/', label: 'Home', exact: true },
    { path: '/lab', label: 'Lab', exact: false },
    { path: '/chemicals', label: 'Chemicals', exact: false },
    { path: '/quiz', label: 'Quiz', exact: false }
  ];

  toolLinks = [
    { path: '/equation-balancer', label: 'Equation Balancer', icon: '⚖️' },
    { path: '/safety-checker', label: 'Safety Checker', icon: '🛡️' },
    { path: '/calculators', label: 'Calculators', icon: '🧮' }
  ];

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(q => q.length >= 2),
      switchMap(q => this.searchService.globalSearch(q, 8))
    ).subscribe(results => {
      this.searchResults.set(results);
      this.showSearchResults.set(true);
    });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 20);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.search-wrapper') && !target.closest('.tools-dropdown')) {
      this.showSearchResults.set(false);
      this.toolsDropdownOpen.set(false);
    }
  }

  onSearchInput(query: string): void {
    this.searchQuery.set(query);
    if (query.length < 2) {
      this.showSearchResults.set(false);
      this.searchResults.set(null);
      return;
    }
    this.searchSubject.next(query);
  }

  selectChemical(id: string): void {
    this.showSearchResults.set(false);
    this.searchQuery.set('');
    this.router.navigate(['/chemicals', id]);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  toggleToolsDropdown(): void {
    this.toolsDropdownOpen.update(v => !v);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  get isDark(): boolean {
    return this.themeService.isDark();
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
