import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-safety-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="safety-badge" [ngClass]="'severity-' + severity.toLowerCase()">
      <span class="badge-icon">{{ getIcon() }}</span>
      {{ label }}
    </span>
  `,
  styles: [`
    .safety-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      font-size: 0.78rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .badge-icon { font-size: 0.85rem; }

    .severity-low {
      background: rgba(0, 230, 118, 0.12);
      color: #00e676;
      border: 1px solid rgba(0, 230, 118, 0.2);
    }

    .severity-medium {
      background: rgba(255, 215, 64, 0.12);
      color: #ffd740;
      border: 1px solid rgba(255, 215, 64, 0.2);
    }

    .severity-high {
      background: rgba(255, 109, 0, 0.12);
      color: #ff6d00;
      border: 1px solid rgba(255, 109, 0, 0.2);
    }

    .severity-critical {
      background: rgba(255, 23, 68, 0.12);
      color: #ff1744;
      border: 1px solid rgba(255, 23, 68, 0.2);
    }
  `]
})
export class SafetyBadgeComponent {
  @Input() label = '';
  @Input() severity: 'Low' | 'Medium' | 'High' | 'Critical' = 'Medium';
  @Input() type = '';

  getIcon(): string {
    const typeLC = this.type.toLowerCase();
    if (typeLC.includes('corrosive')) return '🧪';
    if (typeLC.includes('flammable') || typeLC.includes('fire')) return '🔥';
    if (typeLC.includes('toxic') || typeLC.includes('poison')) return '☠️';
    if (typeLC.includes('explosive') || typeLC.includes('explosion')) return '💥';
    if (typeLC.includes('oxidiz')) return '⚡';
    if (typeLC.includes('irritant')) return '⚠️';
    if (typeLC.includes('exothermic') || typeLC.includes('heat')) return '🌡️';
    if (typeLC.includes('stain')) return '🎨';
    return '⚠️';
  }
}
