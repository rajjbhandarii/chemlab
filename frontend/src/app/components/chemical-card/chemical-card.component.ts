import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ChemicalListItem } from '../../models/chemical.model';

@Component({
    selector: 'app-chemical-card',
    imports: [CommonModule, RouterLink],
    templateUrl: './chemical-card.component.html',
    styleUrl: './chemical-card.component.scss'
})
export class ChemicalCardComponent {
  @Input({ required: true }) chemical!: ChemicalListItem;

  getCategoryClass(): string {
    return 'badge-' + this.chemical.category.toLowerCase().replace(/[\s-]+/g, '-');
  }

  getStateIcon(): string {
    switch (this.chemical.physicalState) {
      case 'Solid': return '�ite';
      case 'Liquid': return '💧';
      case 'Gas': return '💨';
      case 'Aqueous': return '🌊';
      default: return '⚗️';
    }
  }

  getStateEmoji(): string {
    switch (this.chemical.physicalState) {
      case 'Solid': return '♦';
      case 'Liquid': return '💧';
      case 'Gas': return '☁';
      case 'Aqueous': return '〰';
      default: return '⚗';
    }
  }
}
