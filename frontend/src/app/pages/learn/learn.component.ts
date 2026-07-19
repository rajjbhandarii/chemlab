import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LEARNING_TOPICS } from '../../data/learning-content';

@Component({
    selector: 'app-learn',
    imports: [CommonModule, RouterLink],
    template: `
    <div class="page learn-page">
      <div class="container">
        <div class="page-header"><h1>Learning <span class="text-gradient">Center</span></h1><p>Explore fundamental chemistry topics with interactive content</p></div>
        <div class="topics-grid">
          @for (topic of topics; track topic.id) {
            <a [routerLink]="['/learn', topic.id]" class="topic-card glass-card">
              <span class="topic-icon">{{ topic.icon }}</span>
              <h3>{{ topic.title }}</h3>
              <p>{{ topic.description }}</p>
              <span class="topic-sections">{{ topic.sections.length }} sections</span>
            </a>
          }
        </div>
      </div>
    </div>
  `,
    styles: [`
    .page-header { text-align: center; margin-bottom: 2.5rem; h1 { margin-bottom: 0.5rem; } p { color: var(--text-secondary); font-size: 1.1rem; } }
    .topics-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
    .topic-card { display: flex; flex-direction: column; gap: 0.75rem; text-decoration: none; color: inherit; padding: 2rem;
      .topic-icon { font-size: 2.5rem; }
      h3 { font-size: 1.15rem; }
      p { font-size: 0.9rem; color: var(--text-muted); flex: 1; }
      .topic-sections { font-size: 0.8rem; color: var(--accent-secondary); font-weight: 500; }
    }
  `]
})
export class LearnComponent {
  topics = LEARNING_TOPICS;
}
