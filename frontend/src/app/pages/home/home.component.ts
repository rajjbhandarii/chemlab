import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactionService } from '../../services/reaction.service';
import { ChemicalService } from '../../services/chemical.service';
import { PopularReaction } from '../../models/reaction.model';
import { CategoryCount } from '../../models/chemical.model';

@Component({
    selector: 'app-home',
    imports: [CommonModule, RouterLink],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private reactionService = inject(ReactionService);
  private chemicalService = inject(ChemicalService);

  popularReactions = signal<PopularReaction[]>([]);
  categories = signal<CategoryCount[]>([]);
  stats = signal<{ chemicals: number; reactions: number; quizzes: number }>({
    chemicals: 0, reactions: 0, quizzes: 0
  });

  steps = [
    { icon: '🧪', title: 'Choose Chemicals', desc: 'Search and select from our library of chemicals' },
    { icon: '⚡', title: 'Click React', desc: 'Combine your selected chemicals together' },
    { icon: '📊', title: 'View Results', desc: 'See products, equations, and observations' },
    { icon: '📚', title: 'Learn the Chemistry', desc: 'Understand why the reaction happens' }
  ];

  categoryIcons: Record<string, string> = {
    'Acids': '🧪',
    'Bases': '🧫',
    'Salts': '🧂',
    'Metals': '⚙️',
    'Non-metals': '💎',
    'Organic Compounds': '🌿',
    'Gases': '💨',
    'Oxidizing Agents': '⚡',
    'Reducing Agents': '🔋'
  };

  ngOnInit(): void {
    this.reactionService.getPopular().subscribe(reactions => {
      this.popularReactions.set(reactions);
    });

    this.chemicalService.getCategories().subscribe(cats => {
      this.categories.set(cats);
    });

    this.chemicalService.getStats().subscribe(stats => {
      this.stats.set(stats);
    });
  }

  getCategoryIcon(name: string): string {
    return this.categoryIcons[name] || '⚗️';
  }
}
