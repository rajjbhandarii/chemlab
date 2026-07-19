import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactionService } from '../../services/reaction.service';
import { ChemicalService } from '../../services/chemical.service';
import { ReactionResult } from '../../models/reaction.model';
import { ChemicalSearchResult } from '../../models/chemical.model';
import { SafetyBadgeComponent } from '../../components/safety-badge/safety-badge.component';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { Subject, debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-safety-checker',
  standalone: true,
  imports: [CommonModule, FormsModule, SafetyBadgeComponent, LoadingSpinnerComponent],
  template: `
    <div class="page safety-page">
      <div class="container narrow">
        <div class="page-header"><h1>Safety <span class="text-gradient">Checker</span></h1><p>Check if your chemical combination is safe</p></div>

        <div class="checker-form glass">
          @for (input of inputs(); track input.id; let i = $index) {
            <div class="input-row">
              <label class="form-label">Chemical {{ i + 1 }}</label>
              <div class="autocomplete-wrapper">
                <input type="text" class="form-control" placeholder="Type chemical name or formula..." [value]="input.query"
                  (input)="onSearch(input, $any($event.target).value)" (blur)="hideSuggestions(input)"/>
                @if (input.showSuggestions && input.suggestions.length > 0) {
                  <div class="suggestions-dropdown">
                    @for (s of input.suggestions; track s._id) {
                      <button class="suggestion-item" (mousedown)="selectSuggestion(input, s)">
                        <span class="sug-formula">{{ s.formula }}</span>
                        <span class="sug-name">{{ s.name }}</span>
                      </button>
                    }
                  </div>
                }
              </div>
              @if (inputs().length > 2) {
                <button class="btn-remove-sm" (click)="removeInput(input.id)">✕</button>
              }
            </div>
          }
          <button class="btn btn-secondary btn-sm" (click)="addInput()">+ Add Chemical</button>
          <button class="btn btn-primary btn-lg" [disabled]="!canCheck() || loading()" (click)="check()">🛡️ Check Safety</button>
        </div>

        @if (loading()) { <app-loading-spinner></app-loading-spinner> }

        @if (showResult() && result()) {
          @if (result()!.found && result()!.reaction; as rxn) {
            <div class="safety-result glass animate-fade-in-up">
              <div class="danger-level" [ngClass]="'level-' + rxn.dangerLevel.toLowerCase().replace(' ', '-')">
                <span class="danger-icon">{{ getDangerIcon(rxn.dangerLevel) }}</span>
                <h2>{{ rxn.dangerLevel }}</h2>
              </div>

              <div class="equation-display">{{ rxn.balancedEquation }}</div>

              @if (rxn.safetyWarnings.length) {
                <div class="warnings-section">
                  <h3>⚠️ Warnings</h3>
                  @for (w of rxn.safetyWarnings; track w.type) {
                    <div class="warning-row">
                      <app-safety-badge [label]="w.type" [severity]="w.severity" [type]="w.type"></app-safety-badge>
                      <p>{{ w.description }}</p>
                    </div>
                  }
                </div>
              }

              @if (rxn.observations.length) {
                <div class="observations-section">
                  <h3>👁️ What You'll Observe</h3>
                  <ul>@for (obs of rxn.observations; track obs) { <li>{{ obs }}</li> }</ul>
                </div>
              }

              <div class="precautions glass">
                <h3>🧤 Precautions</h3>
                <ul>
                  <li>Wear appropriate PPE (gloves, goggles, lab coat)</li>
                  <li>Work in a well-ventilated area or fume hood</li>
                  <li>Have neutralizing agents ready</li>
                  <li>Know the location of safety equipment</li>
                </ul>
              </div>
            </div>
          } @else {
            <div class="no-data glass animate-fade-in">
              <span>🔬</span><h3>No data found</h3>
              <p>{{ result()!.message || 'This combination is not in our database.' }}</p>
            </div>
          }
        }
      </div>
    </div>
  `,
  styleUrl: './safety-checker.component.scss'
})
export class SafetyCheckerComponent {
  private reactionService = inject(ReactionService);
  private chemicalService = inject(ChemicalService);

  inputs = signal<any[]>([{ id: 1, query: '', formula: '', suggestions: [], showSuggestions: false }, { id: 2, query: '', formula: '', suggestions: [], showSuggestions: false }]);
  result = signal<ReactionResult | null>(null);
  loading = signal(false);
  showResult = signal(false);
  private nextId = 3;
  private searchSubjects = new Map<number, Subject<string>>();

  onSearch(input: any, q: string): void {
    input.query = q; input.formula = '';
    if (q.length < 2) { input.suggestions = []; input.showSuggestions = false; return; }
    let sub = this.searchSubjects.get(input.id);
    if (!sub) {
      sub = new Subject<string>();
      this.searchSubjects.set(input.id, sub);
      sub.pipe(debounceTime(250), distinctUntilChanged(), filter(v => v.length >= 2), switchMap(v => this.chemicalService.search(v, 6)))
        .subscribe(r => { input.suggestions = r; input.showSuggestions = r.length > 0; });
    }
    sub.next(q);
  }

  selectSuggestion(input: any, s: ChemicalSearchResult): void {
    input.query = `${s.name} (${s.formula})`; input.formula = s.formula; input.showSuggestions = false;
  }

  hideSuggestions(input: any): void { setTimeout(() => input.showSuggestions = false, 200); }
  addInput(): void { this.inputs.update(i => [...i, { id: this.nextId++, query: '', formula: '', suggestions: [], showSuggestions: false }]); }
  removeInput(id: number): void { this.inputs.update(i => i.filter(x => x.id !== id)); }
  canCheck(): boolean { return this.inputs().filter(i => i.formula).length >= 2; }

  check(): void {
    const formulas = this.inputs().filter(i => i.formula).map(i => i.formula);
    this.loading.set(true); this.showResult.set(false);
    this.reactionService.simulate(formulas).subscribe({
      next: r => { this.result.set(r); this.loading.set(false); this.showResult.set(true); },
      error: () => { this.result.set({ found: false, message: 'Error checking safety.' }); this.loading.set(false); this.showResult.set(true); }
    });
  }

  getDangerIcon(level: string): string {
    switch (level) { case 'Safe': return '✅'; case 'Caution': return '⚠️'; case 'Unsafe': return '🚫'; case 'Highly Dangerous': return '☠️'; default: return '⚠️'; }
  }
}
