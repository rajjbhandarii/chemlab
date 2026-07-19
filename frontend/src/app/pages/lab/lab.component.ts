import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs/operators';
import { ReactionService } from '../../services/reaction.service';
import { ChemicalService } from '../../services/chemical.service';
import { ReactionResult, PopularReaction } from '../../models/reaction.model';
import { ChemicalSearchResult } from '../../models/chemical.model';
import { SafetyBadgeComponent } from '../../components/safety-badge/safety-badge.component';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';

interface ChemicalInput {
  id: number;
  query: string;
  selectedFormula: string;
  selectedName: string;
  suggestions: ChemicalSearchResult[];
  showSuggestions: boolean;
}

@Component({
    selector: 'app-lab',
    imports: [CommonModule, FormsModule, SafetyBadgeComponent, LoadingSpinnerComponent],
    templateUrl: './lab.component.html',
    styleUrl: './lab.component.scss'
})
export class LabComponent implements OnInit {
  private reactionService = inject(ReactionService);
  private chemicalService = inject(ChemicalService);
  private route = inject(ActivatedRoute);

  inputs = signal<ChemicalInput[]>([
    this.createInput(1),
    this.createInput(2)
  ]);

  result = signal<ReactionResult | null>(null);
  loading = signal(false);
  popularReactions = signal<PopularReaction[]>([]);
  showResult = signal(false);
  nextId = 3;

  private searchSubjects: Map<number, Subject<string>> = new Map();

  ngOnInit(): void {
    this.reactionService.getPopular().subscribe(rxns => {
      this.popularReactions.set(rxns);
    });

    // Check for query params (from popular reaction cards)
    this.route.queryParams.subscribe(params => {
      if (params['r1']) {
        const currentInputs = this.inputs();
        currentInputs[0].query = params['r1'];
        currentInputs[0].selectedFormula = params['r1'];
        currentInputs[0].selectedName = params['r1'];
        if (params['r2']) {
          currentInputs[1].query = params['r2'];
          currentInputs[1].selectedFormula = params['r2'];
          currentInputs[1].selectedName = params['r2'];
        }
        this.inputs.set([...currentInputs]);
      }
    });
  }

  createInput(id: number): ChemicalInput {
    return {
      id,
      query: '',
      selectedFormula: '',
      selectedName: '',
      suggestions: [],
      showSuggestions: false
    };
  }

  onSearchInput(input: ChemicalInput, query: string): void {
    input.query = query;
    input.selectedFormula = '';
    input.selectedName = '';

    if (query.length < 2) {
      input.suggestions = [];
      input.showSuggestions = false;
      return;
    }

    let subject = this.searchSubjects.get(input.id);
    if (!subject) {
      subject = new Subject<string>();
      this.searchSubjects.set(input.id, subject);
      subject.pipe(
        debounceTime(250),
        distinctUntilChanged(),
        filter(q => q.length >= 2),
        switchMap(q => this.chemicalService.search(q, 8))
      ).subscribe(results => {
        input.suggestions = results;
        input.showSuggestions = results.length > 0;
      });
    }
    subject.next(query);
  }

  selectSuggestion(input: ChemicalInput, suggestion: ChemicalSearchResult): void {
    input.query = `${suggestion.name} (${suggestion.formula})`;
    input.selectedFormula = suggestion.formula;
    input.selectedName = suggestion.name;
    input.showSuggestions = false;
    input.suggestions = [];
  }

  addInput(): void {
    this.inputs.update(inputs => [...inputs, this.createInput(this.nextId++)]);
  }

  removeInput(id: number): void {
    this.inputs.update(inputs => inputs.filter(i => i.id !== id));
  }

  canReact(): boolean {
    const selected = this.inputs().filter(i => i.selectedFormula);
    return selected.length >= 2;
  }

  react(): void {
    const formulas = this.inputs()
      .filter(i => i.selectedFormula)
      .map(i => i.selectedFormula);

    if (formulas.length < 2) return;

    this.loading.set(true);
    this.showResult.set(false);

    this.reactionService.simulate(formulas).subscribe({
      next: (res) => {
        this.result.set(res);
        this.loading.set(false);
        this.showResult.set(true);
      },
      error: () => {
        this.result.set({ found: false, message: 'An error occurred while simulating the reaction.' });
        this.loading.set(false);
        this.showResult.set(true);
      }
    });
  }

  loadPopularReaction(rxn: PopularReaction): void {
    const newInputs: ChemicalInput[] = rxn.reactants.map((formula, i) => ({
      id: i + 1,
      query: `${rxn.reactantNames?.[i] || formula} (${formula})`,
      selectedFormula: formula,
      selectedName: rxn.reactantNames?.[i] || formula,
      suggestions: [],
      showSuggestions: false
    }));
    this.nextId = newInputs.length + 1;
    this.inputs.set(newInputs);
    this.showResult.set(false);
    this.result.set(null);
  }

  clearAll(): void {
    this.inputs.set([this.createInput(1), this.createInput(2)]);
    this.nextId = 3;
    this.result.set(null);
    this.showResult.set(false);
  }

  getDangerClass(level: string): string {
    switch (level) {
      case 'Safe': return 'danger-safe';
      case 'Caution': return 'danger-caution';
      case 'Unsafe': return 'danger-unsafe';
      case 'Highly Dangerous': return 'danger-critical';
      default: return 'danger-caution';
    }
  }

  hideSuggestions(input: ChemicalInput): void {
    setTimeout(() => { input.showSuggestions = false; }, 200);
  }
}
