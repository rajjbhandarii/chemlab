/**
 * Chemical Equation Balancer
 * Parses chemical formulas, builds an element matrix, and solves
 * for balancing coefficients using Gaussian elimination.
 */

interface ParsedFormula {
  elements: Map<string, number>;
  original: string;
}

export function parseFormula(formula: string): Map<string, number> {
  const elements = new Map<string, number>();
  const cleaned = formula.replace(/[↑↓]/g, '').trim();
  let i = 0;

  function parseGroup(): Map<string, number> {
    const group = new Map<string, number>();
    while (i < cleaned.length) {
      if (cleaned[i] === '(') {
        i++;
        const inner = parseGroup();
        let num = '';
        while (i < cleaned.length && /\d/.test(cleaned[i])) { num += cleaned[i]; i++; }
        const multiplier = num ? parseInt(num) : 1;
        inner.forEach((count, el) => {
          group.set(el, (group.get(el) || 0) + count * multiplier);
        });
      } else if (cleaned[i] === ')') {
        i++;
        return group;
      } else if (/[A-Z]/.test(cleaned[i])) {
        let element = cleaned[i]; i++;
        while (i < cleaned.length && /[a-z]/.test(cleaned[i])) { element += cleaned[i]; i++; }
        let num = '';
        while (i < cleaned.length && /\d/.test(cleaned[i])) { num += cleaned[i]; i++; }
        const count = num ? parseInt(num) : 1;
        group.set(element, (group.get(element) || 0) + count);
      } else {
        i++;
      }
    }
    return group;
  }

  const result = parseGroup();
  result.forEach((v, k) => elements.set(k, v));
  return elements;
}

export function balanceEquation(equation: string): { balanced: string; coefficients: number[]; success: boolean } {
  // Normalize: replace various arrow/equal signs
  const normalized = equation
    .replace(/→|➜|➔|->|=>|⟶/g, '=')
    .replace(/\s+/g, ' ')
    .trim();

  const sides = normalized.split('=').map(s => s.trim());
  if (sides.length !== 2) {
    return { balanced: equation, coefficients: [], success: false };
  }

  const reactantStrs = sides[0].split('+').map(s => s.trim()).filter(s => s);
  const productStrs = sides[1].split('+').map(s => s.trim()).filter(s => s);
  const allFormulas = [...reactantStrs, ...productStrs];

  // Parse all formulas
  const parsed: ParsedFormula[] = allFormulas.map(f => ({
    elements: parseFormula(f),
    original: f
  }));

  // Collect unique elements
  const elementSet = new Set<string>();
  parsed.forEach(p => p.elements.forEach((_, el) => elementSet.add(el)));
  const elementsList = Array.from(elementSet);

  const n = allFormulas.length;
  const m = elementsList.length;

  // Build matrix: each row is an element, each column is a compound
  // Reactants positive, products negative
  const matrix: number[][] = [];
  for (let row = 0; row < m; row++) {
    const el = elementsList[row];
    const rowData: number[] = [];
    for (let col = 0; col < n; col++) {
      const count = parsed[col].elements.get(el) || 0;
      // Products get negative sign
      const sign = col < reactantStrs.length ? 1 : -1;
      rowData.push(count * sign);
    }
    matrix.push(rowData);
  }

  // Gaussian elimination to find null space
  const augmented = matrix.map(row => [...row, 0]);
  const rows = augmented.length;
  const cols = augmented[0].length;
  let pivotRow = 0;

  for (let col = 0; col < cols - 1 && pivotRow < rows; col++) {
    // Find pivot
    let maxRow = pivotRow;
    for (let row = pivotRow + 1; row < rows; row++) {
      if (Math.abs(augmented[row][col]) > Math.abs(augmented[maxRow][col])) {
        maxRow = row;
      }
    }
    if (Math.abs(augmented[maxRow][col]) < 1e-10) continue;

    [augmented[pivotRow], augmented[maxRow]] = [augmented[maxRow], augmented[pivotRow]];

    const pivotVal = augmented[pivotRow][col];
    for (let j = col; j < cols; j++) {
      augmented[pivotRow][j] /= pivotVal;
    }

    for (let row = 0; row < rows; row++) {
      if (row === pivotRow) continue;
      const factor = augmented[row][col];
      for (let j = col; j < cols; j++) {
        augmented[row][j] -= factor * augmented[pivotRow][j];
      }
    }
    pivotRow++;
  }

  // Extract coefficients from null space
  const coefficients = new Array(n).fill(1);

  // Set the free variable(s) to 1 and back-substitute
  // Find pivot columns
  const pivotCols: number[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < n; col++) {
      if (Math.abs(augmented[row][col] - 1) < 1e-10) {
        let isPivot = true;
        for (let r2 = 0; r2 < rows; r2++) {
          if (r2 !== row && Math.abs(augmented[r2][col]) > 1e-10) {
            isPivot = false;
            break;
          }
        }
        if (isPivot) {
          pivotCols.push(col);
          break;
        }
      }
    }
  }

  const freeCols = [];
  for (let col = 0; col < n; col++) {
    if (!pivotCols.includes(col)) freeCols.push(col);
  }

  if (freeCols.length > 0) {
    // Set free variable to 1
    const freeCol = freeCols[0];
    coefficients[freeCol] = 1;

    // Back-substitute
    for (let row = rows - 1; row >= 0; row--) {
      let pivotCol = -1;
      for (let col = 0; col < n; col++) {
        if (Math.abs(augmented[row][col] - 1) < 1e-10) {
          pivotCol = col;
          break;
        }
      }
      if (pivotCol === -1) continue;

      let val = 0;
      for (let col = 0; col < n; col++) {
        if (col !== pivotCol) {
          val -= augmented[row][col] * coefficients[col];
        }
      }
      coefficients[pivotCol] = val;
    }
  }

  // Make all positive and find common multiplier to get integers
  const minCoeff = Math.min(...coefficients.filter(c => c !== 0).map(Math.abs));
  let intCoeffs = coefficients.map(c => Math.abs(c) / minCoeff);

  // Multiply to clear fractions
  for (let mult = 1; mult <= 100; mult++) {
    const test = intCoeffs.map(c => c * mult);
    if (test.every(c => Math.abs(c - Math.round(c)) < 0.01)) {
      intCoeffs = test.map(c => Math.round(c));
      break;
    }
  }

  // Ensure no zeros
  intCoeffs = intCoeffs.map(c => c === 0 ? 1 : c);

  // Build balanced equation string
  const reactantParts = reactantStrs.map((f, i) => {
    return intCoeffs[i] === 1 ? f : `${intCoeffs[i]}${f}`;
  });
  const productParts = productStrs.map((f, i) => {
    const idx = i + reactantStrs.length;
    return intCoeffs[idx] === 1 ? f : `${intCoeffs[idx]}${f}`;
  });

  const balanced = `${reactantParts.join(' + ')} → ${productParts.join(' + ')}`;

  return { balanced, coefficients: intCoeffs, success: true };
}
