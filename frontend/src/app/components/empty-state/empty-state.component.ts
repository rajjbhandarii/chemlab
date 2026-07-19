import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state">
      <span class="empty-icon">{{ icon }}</span>
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
      gap: 0.75rem;
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 0.5rem;
      opacity: 0.6;
    }

    h3 {
      color: var(--text-primary);
      font-size: 1.25rem;
    }

    p {
      color: var(--text-muted);
      font-size: 0.95rem;
      max-width: 400px;
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon = '🔬';
  @Input() title = 'Nothing here yet';
  @Input() message = 'Try adjusting your search or filters.';
}
