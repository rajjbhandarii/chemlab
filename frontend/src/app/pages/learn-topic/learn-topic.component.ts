import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LEARNING_TOPICS, LearningTopic } from '../../data/learning-content';

@Component({
  selector: 'app-learn-topic',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page topic-page">
      <div class="container narrow">
        @if (topic) {
          <a routerLink="/learn" class="back-link">← All Topics</a>
          <div class="topic-header glass">
            <span class="topic-icon">{{ topic.icon }}</span>
            <h1>{{ topic.title }}</h1>
            <p>{{ topic.description }}</p>
          </div>

          @for (section of topic.sections; track section.title; let i = $index) {
            <div class="section-card glass animate-fade-in-up" [style.animation-delay]="i * 0.1 + 's'">
              <h2>{{ section.title }}</h2>
              <p class="section-content">{{ section.content }}</p>

              @if (section.keyPoints?.length) {
                <div class="key-points">
                  <h4>Key Points</h4>
                  <ul>
                    @for (point of section.keyPoints; track point) {
                      <li>{{ point }}</li>
                    }
                  </ul>
                </div>
              }

              @if (section.example) {
                <div class="example-box">
                  <h4>💡 Example</h4>
                  <p>{{ section.example }}</p>
                </div>
              }
            </div>
          }

          <div class="nav-links">
            @if (prevTopic) {
              <a [routerLink]="['/learn', prevTopic.id]" class="nav-card glass-card">
                <span>← Previous</span>
                <strong>{{ prevTopic.title }}</strong>
              </a>
            }
            @if (nextTopic) {
              <a [routerLink]="['/learn', nextTopic.id]" class="nav-card glass-card next">
                <span>Next →</span>
                <strong>{{ nextTopic.title }}</strong>
              </a>
            }
          </div>
        } @else {
          <div class="not-found glass">
            <h2>Topic not found</h2>
            <a routerLink="/learn" class="btn btn-primary">← Back to Topics</a>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .narrow { max-width: 800px; margin: 0 auto; }
    .back-link { display: inline-block; margin-bottom: 1.5rem; color: var(--text-muted); font-size: 0.9rem; &:hover { color: var(--accent-primary); } }
    .topic-header { padding: 2.5rem; text-align: center; margin-bottom: 2rem;
      .topic-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }
      h1 { margin-bottom: 0.5rem; }
      p { color: var(--text-secondary); }
    }
    .section-card { padding: 2rem; margin-bottom: 1.5rem; opacity: 0;
      h2 { font-size: 1.3rem; margin-bottom: 1rem; color: var(--accent-secondary); }
      .section-content { color: var(--text-secondary); line-height: 1.7; margin-bottom: 1.25rem; }
    }
    .key-points {
      h4 { font-size: 0.85rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.04em; margin-bottom: 0.75rem; }
      ul { display: flex; flex-direction: column; gap: 0.4rem; }
      li { padding-left: 1.5rem; position: relative; color: var(--text-secondary); font-size: 0.95rem; &::before { content: '▸'; position: absolute; left: 0; color: var(--accent-primary); font-weight: 700; } }
    }
    .example-box {
      margin-top: 1.25rem; padding: 1.25rem; background: var(--bg-glass); border-left: 3px solid var(--accent-primary); border-radius: 0 var(--radius-md) var(--radius-md) 0;
      h4 { margin-bottom: 0.5rem; font-size: 0.95rem; }
      p { color: var(--text-secondary); line-height: 1.6; white-space: pre-line; font-size: 0.9rem; }
    }
    .nav-links { display: flex; gap: 1rem; margin-top: 2rem; }
    .nav-card { flex: 1; text-decoration: none; color: inherit; padding: 1.25rem; display: flex; flex-direction: column; gap: 0.25rem;
      span { font-size: 0.8rem; color: var(--text-muted); }
      strong { color: var(--text-primary); }
      &.next { text-align: right; }
    }
    .not-found { text-align: center; padding: 3rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
  `]
})
export class LearnTopicComponent implements OnInit {
  private route = inject(ActivatedRoute);

  topic: LearningTopic | undefined;
  prevTopic: LearningTopic | undefined;
  nextTopic: LearningTopic | undefined;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('topic');
      const idx = LEARNING_TOPICS.findIndex(t => t.id === id);
      this.topic = idx >= 0 ? LEARNING_TOPICS[idx] : undefined;
      this.prevTopic = idx > 0 ? LEARNING_TOPICS[idx - 1] : undefined;
      this.nextTopic = idx < LEARNING_TOPICS.length - 1 ? LEARNING_TOPICS[idx + 1] : undefined;
    });
  }
}
