/**
 * Chemistry Calculator Utilities
 * Atomic mass lookup table and formula parser for molar mass calculations.
 */

export const ATOMIC_MASSES: Record<string, number> = {
  H: 1.008, He: 4.003, Li: 6.941, Be: 9.012, B: 10.81, C: 12.011, N: 14.007,
  O: 15.999, F: 18.998, Ne: 20.180, Na: 22.990, Mg: 24.305, Al: 26.982,
  Si: 28.086, P: 30.974, S: 32.065, Cl: 35.453, Ar: 39.948, K: 39.098,
  Ca: 40.078, Sc: 44.956, Ti: 47.867, V: 50.942, Cr: 51.996, Mn: 54.938,
  Fe: 55.845, Co: 58.933, Ni: 58.693, Cu: 63.546, Zn: 65.380, Ga: 69.723,
  Ge: 72.640, As: 74.922, Se: 78.960, Br: 79.904, Kr: 83.798, Rb: 85.468,
  Sr: 87.620, Y: 88.906, Zr: 91.224, Nb: 92.906, Mo: 95.960, Ru: 101.07,
  Rh: 102.91, Pd: 106.42, Ag: 107.87, Cd: 112.41, In: 114.82, Sn: 118.71,
  Sb: 121.76, Te: 127.60, I: 126.90, Xe: 131.29, Cs: 132.91, Ba: 137.33,
  La: 138.91, Ce: 140.12, Pr: 140.91, Nd: 144.24, Sm: 150.36, Eu: 151.96,
  Gd: 157.25, Tb: 158.93, Dy: 162.50, Ho: 164.93, Er: 167.26, Tm: 168.93,
  Yb: 173.05, Lu: 174.97, Hf: 178.49, Ta: 180.95, W: 183.84, Re: 186.21,
  Os: 190.23, Ir: 192.22, Pt: 195.08, Au: 196.97, Hg: 200.59, Tl: 204.38,
  Pb: 207.20, Bi: 208.98, Th: 232.04, Pa: 231.04, U: 238.03
};

export function calculateMolarMass(formula: string): { mass: number; breakdown: { element: string; count: number; mass: number }[] } {
  const elements = parseFormulaToMap(formula);
  const breakdown: { element: string; count: number; mass: number }[] = [];
  let total = 0;

  elements.forEach((count, element) => {
    const atomicMass = ATOMIC_MASSES[element] || 0;
    const mass = atomicMass * count;
    total += mass;
    breakdown.push({ element, count, mass });
  });

  return { mass: Math.round(total * 1000) / 1000, breakdown };
}

function parseFormulaToMap(formula: string): Map<string, number> {
  const elements = new Map<string, number>();
  let i = 0;
  const cleaned = formula.replace(/[₀-₉]/g, c => String.fromCharCode(c.charCodeAt(0) - 8272 + 48));

  function parseGroup(): Map<string, number> {
    const group = new Map<string, number>();
    while (i < cleaned.length) {
      if (cleaned[i] === '(') {
        i++;
        const inner = parseGroup();
        let num = '';
        while (i < cleaned.length && /\d/.test(cleaned[i])) { num += cleaned[i]; i++; }
        const mult = num ? parseInt(num) : 1;
        inner.forEach((c, el) => group.set(el, (group.get(el) || 0) + c * mult));
      } else if (cleaned[i] === ')') {
        i++;
        return group;
      } else if (/[A-Z]/.test(cleaned[i])) {
        let el = cleaned[i]; i++;
        while (i < cleaned.length && /[a-z]/.test(cleaned[i])) { el += cleaned[i]; i++; }
        let num = '';
        while (i < cleaned.length && /\d/.test(cleaned[i])) { num += cleaned[i]; i++; }
        group.set(el, (group.get(el) || 0) + (num ? parseInt(num) : 1));
      } else { i++; }
    }
    return group;
  }

  const result = parseGroup();
  result.forEach((v, k) => elements.set(k, v));
  return elements;
}

// Molarity: M = mol / L
export function calcMolarity(moles: number, liters: number): number {
  return moles / liters;
}

// Dilution: M1V1 = M2V2
export function calcDilution(m1: number, v1: number, m2?: number, v2?: number): number {
  if (m2 !== undefined && v2 === undefined) return (m1 * v1) / m2;
  if (v2 !== undefined && m2 === undefined) return (m1 * v1) / v2;
  return 0;
}

// Ideal Gas Law: PV = nRT
export function calcIdealGas(known: { P?: number; V?: number; n?: number; T?: number }): { P: number; V: number; n: number; T: number; solveFor: string } {
  const R = 0.08206; // L·atm/(mol·K)
  const { P, V, n, T } = known;
  if (P === undefined && V !== undefined && n !== undefined && T !== undefined) {
    return { P: (n * R * T) / V, V, n, T, solveFor: 'P' };
  }
  if (V === undefined && P !== undefined && n !== undefined && T !== undefined) {
    return { P, V: (n * R * T) / P, n, T, solveFor: 'V' };
  }
  if (n === undefined && P !== undefined && V !== undefined && T !== undefined) {
    return { P, V, n: (P * V) / (R * T), T, solveFor: 'n' };
  }
  if (T === undefined && P !== undefined && V !== undefined && n !== undefined) {
    return { P, V, n, T: (P * V) / (n * R), solveFor: 'T' };
  }
  return { P: 0, V: 0, n: 0, T: 0, solveFor: '' };
}

// pH calculator
export function calcPH(hConc: number): { pH: number; pOH: number; ohConc: number } {
  const pH = -Math.log10(hConc);
  const pOH = 14 - pH;
  const ohConc = Math.pow(10, -pOH);
  return { pH: Math.round(pH * 1000) / 1000, pOH: Math.round(pOH * 1000) / 1000, ohConc };
}

// Reaction yield
export function calcYield(actual: number, theoretical: number): number {
  return (actual / theoretical) * 100;
}
