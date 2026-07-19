import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { calculateMolarMass, calcMolarity, calcDilution, calcIdealGas, calcPH, calcYield } from '../../utils/calculator-utils';

@Component({
  selector: 'app-calculators',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calculators.component.html',
  styleUrl: './calculators.component.scss'
})
export class CalculatorsComponent {
  activeTab = signal(0);

  tabs = [
    { icon: '⚖️', name: 'Molar Mass' },
    { icon: '🧪', name: 'Molarity' },
    { icon: '💧', name: 'Dilution' },
    { icon: '📐', name: 'Stoichiometry' },
    { icon: '📊', name: '% Composition' },
    { icon: '🌡️', name: 'Ideal Gas' },
    { icon: '🔬', name: 'pH' },
    { icon: '📈', name: 'Yield' }
  ];

  // Molar Mass
  mmFormula = ''; mmResult: any = null;
  calcMolarMass(): void {
    if (!this.mmFormula) return;
    this.mmResult = calculateMolarMass(this.mmFormula);
  }

  // Molarity
  molMoles = 0; molLiters = 0; molResult: number | null = null;
  calcMolarity(): void { this.molResult = Math.round(calcMolarity(this.molMoles, this.molLiters) * 10000) / 10000; }

  // Dilution
  dilM1 = 0; dilV1 = 0; dilM2 = 0; dilV2Result: number | null = null;
  calcDilution(): void { this.dilV2Result = Math.round(calcDilution(this.dilM1, this.dilV1, this.dilM2) * 10000) / 10000; }

  // Stoichiometry
  stoichGiven = 0; stoichMmGiven = 0; stoichMmProduct = 0; stoichCoeffGiven = 1; stoichCoeffProduct = 1; stoichResult: number | null = null;
  calcStoich(): void {
    const molesGiven = this.stoichGiven / this.stoichMmGiven;
    const molesProduct = molesGiven * (this.stoichCoeffProduct / this.stoichCoeffGiven);
    this.stoichResult = Math.round(molesProduct * this.stoichMmProduct * 10000) / 10000;
  }

  // % Composition
  compFormula = ''; compResult: any = null;
  calcComposition(): void {
    if (!this.compFormula) return;
    const mm = calculateMolarMass(this.compFormula);
    this.compResult = { total: mm.mass, elements: mm.breakdown.map(b => ({ ...b, percentage: Math.round((b.mass / mm.mass) * 10000) / 100 })) };
  }

  // Ideal Gas
  igP: any = ''; igV: any = ''; igN: any = ''; igT: any = ''; igResult: any = null;
  calcIdealGas(): void {
    const known: any = {};
    if (this.igP !== '') known.P = parseFloat(this.igP);
    if (this.igV !== '') known.V = parseFloat(this.igV);
    if (this.igN !== '') known.n = parseFloat(this.igN);
    if (this.igT !== '') known.T = parseFloat(this.igT);
    this.igResult = calcIdealGas(known);
  }

  // pH
  phInput = 0; phResult: any = null;
  calcPH(): void { this.phResult = calcPH(this.phInput); }

  // Yield
  yieldActual = 0; yieldTheoretical = 0; yieldResult: number | null = null;
  calcYield(): void { this.yieldResult = Math.round(calcYield(this.yieldActual, this.yieldTheoretical) * 100) / 100; }
}
