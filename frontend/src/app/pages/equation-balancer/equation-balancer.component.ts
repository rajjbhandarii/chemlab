import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { balanceEquation } from '../../utils/equation-balancer';

@Component({
  selector: 'app-equation-balancer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './equation-balancer.component.html',
  styleUrl: './equation-balancer.component.scss'
})
export class EquationBalancerComponent {
  input = signal('');
  result = signal<{ balanced: string; coefficients: number[]; success: boolean } | null>(null);
  error = signal('');

  examples = [
    'Fe + O2 = Fe2O3',
    'H2 + O2 = H2O',
    'CH4 + O2 = CO2 + H2O',
    'Al + HCl = AlCl3 + H2',
    'C3H8 + O2 = CO2 + H2O',
    'KMnO4 + HCl = KCl + MnCl2 + Cl2 + H2O',
    'Na + H2O = NaOH + H2',
    'Ca(OH)2 + H3PO4 = Ca3(PO4)2 + H2O'
  ];

  balance(): void {
    const eq = this.input().trim();
    if (!eq) {
      this.error.set('Please enter a chemical equation.');
      this.result.set(null);
      return;
    }

    try {
      const res = balanceEquation(eq);
      if (res.success) {
        this.result.set(res);
        this.error.set('');
      } else {
        this.error.set('Could not balance this equation. Please check the format.');
        this.result.set(null);
      }
    } catch {
      this.error.set('Invalid equation format. Use format: Fe + O2 = Fe2O3');
      this.result.set(null);
    }
  }

  loadExample(eq: string): void {
    this.input.set(eq);
    this.balance();
  }
}
