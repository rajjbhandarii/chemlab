export interface LearningTopic {
  id: string;
  title: string;
  icon: string;
  description: string;
  sections: TopicSection[];
}

export interface TopicSection {
  title: string;
  content: string;
  keyPoints?: string[];
  example?: string;
}

export const LEARNING_TOPICS: LearningTopic[] = [
  {
    id: 'periodic-table', title: 'Periodic Table', icon: '📋',
    description: 'Explore the organization of elements and their properties',
    sections: [
      { title: 'Introduction', content: 'The periodic table organizes all known chemical elements by their atomic number, electron configuration, and recurring chemical properties. Elements are arranged in rows (periods) and columns (groups).', keyPoints: ['118 confirmed elements', 'Arranged by increasing atomic number', 'Elements in the same group share similar properties', 'Metals on the left, non-metals on the right'] },
      { title: 'Groups and Periods', content: 'Groups (columns) contain elements with the same number of valence electrons. Period (rows) indicate the energy level of the outermost electrons.', keyPoints: ['Group 1: Alkali metals (Li, Na, K)', 'Group 17: Halogens (F, Cl, Br, I)', 'Group 18: Noble gases (He, Ne, Ar)', 'Transition metals occupy Groups 3-12'], example: 'Sodium (Na) and Potassium (K) are both in Group 1. They both react vigorously with water and form +1 ions.' },
      { title: 'Trends', content: 'Several properties show predictable trends across the periodic table.', keyPoints: ['Atomic radius increases down a group, decreases across a period', 'Ionization energy increases across a period, decreases down a group', 'Electronegativity increases across a period (F is the most electronegative)', 'Metallic character increases down a group and decreases across a period'] }
    ]
  },
  {
    id: 'chemical-bonding', title: 'Chemical Bonding', icon: '🔗',
    description: 'Understand how atoms connect to form molecules',
    sections: [
      { title: 'Introduction', content: 'Chemical bonds form when atoms share or transfer electrons to achieve a more stable electron configuration, typically a full outer shell (octet rule).', keyPoints: ['Three main types: ionic, covalent, metallic', 'Bonds involve valence electrons', 'Bond strength determines molecule stability'] },
      { title: 'Ionic Bonds', content: 'Formed when electrons are transferred from a metal to a non-metal, creating oppositely charged ions that attract each other.', keyPoints: ['Metal loses electrons → cation (+)', 'Non-metal gains electrons → anion (-)', 'High melting points, conduct electricity when dissolved', 'Example: NaCl (Na⁺ and Cl⁻)'], example: 'Na → Na⁺ + e⁻, then Cl + e⁻ → Cl⁻. The Na⁺ and Cl⁻ ions attract, forming NaCl.' },
      { title: 'Covalent Bonds', content: 'Formed when two non-metal atoms share electron pairs.', keyPoints: ['Single bond: 1 shared pair', 'Double bond: 2 shared pairs', 'Triple bond: 3 shared pairs', 'Polar covalent: unequal sharing (H-Cl)', 'Non-polar covalent: equal sharing (H-H)'], example: 'In water (H₂O), oxygen shares electrons with two hydrogen atoms. The unequal sharing makes it polar.' },
      { title: 'Metallic Bonds', content: 'In metals, valence electrons are delocalized, forming a "sea of electrons" around positive metal ions.', keyPoints: ['Explains electrical conductivity', 'Explains malleability and ductility', 'Explains metallic luster'] }
    ]
  },
  {
    id: 'acids-and-bases', title: 'Acids and Bases', icon: '⚗️',
    description: 'Learn about pH, neutralization, and acid-base chemistry',
    sections: [
      { title: 'Definitions', content: 'Acids produce H⁺ ions in water; bases produce OH⁻ ions. The Brønsted-Lowry definition: acids donate protons, bases accept protons.', keyPoints: ['Arrhenius: acids produce H⁺, bases produce OH⁻', 'Brønsted-Lowry: proton donors and acceptors', 'Lewis: electron pair acceptors (acids) and donors (bases)'] },
      { title: 'pH Scale', content: 'The pH scale measures how acidic or basic a solution is, ranging from 0 to 14.', keyPoints: ['pH < 7: acidic', 'pH = 7: neutral', 'pH > 7: basic/alkaline', 'pH = -log[H⁺]', 'Each pH unit = 10× difference in H⁺ concentration'], example: 'Stomach acid has pH ~1.5, blood has pH ~7.4, bleach has pH ~12.5.' },
      { title: 'Neutralization', content: 'When an acid reacts with a base, they form water and a salt. This is called neutralization.', keyPoints: ['Acid + Base → Salt + Water', 'HCl + NaOH → NaCl + H₂O', 'Exothermic reaction', 'Used in antacids and titrations'], example: 'When you take an antacid tablet (base like CaCO₃) for heartburn, it neutralizes excess stomach acid (HCl).' }
    ]
  },
  {
    id: 'organic-chemistry', title: 'Organic Chemistry', icon: '🌿',
    description: 'Study carbon-based compounds and functional groups',
    sections: [
      { title: 'Introduction', content: 'Organic chemistry studies carbon-containing compounds. Carbon can form 4 bonds, creating an enormous variety of molecules.', keyPoints: ['Carbon forms 4 covalent bonds', 'Chains, branches, and rings', 'Millions of known organic compounds', 'Essential for life: proteins, DNA, fats, carbohydrates'] },
      { title: 'Hydrocarbons', content: 'The simplest organic compounds contain only carbon and hydrogen.', keyPoints: ['Alkanes: single bonds (CH₄, C₂H₆) — saturated', 'Alkenes: double bonds (C₂H₄) — unsaturated', 'Alkynes: triple bonds (C₂H₂)', 'Aromatic: benzene ring (C₆H₆)'], example: 'Methane (CH₄) is the simplest alkane and the main component of natural gas.' },
      { title: 'Functional Groups', content: 'Functional groups are specific arrangements of atoms that determine the compound\'s properties.', keyPoints: ['Alcohols: -OH (ethanol CH₃CH₂OH)', 'Carboxylic acids: -COOH (acetic acid CH₃COOH)', 'Amines: -NH₂ (methylamine CH₃NH₂)', 'Esters: -COO- (ethyl acetate)', 'Aldehydes: -CHO, Ketones: -CO-'] }
    ]
  },
  {
    id: 'reaction-types', title: 'Reaction Types', icon: '⚡',
    description: 'Classify and understand different types of chemical reactions',
    sections: [
      { title: 'Overview', content: 'Chemical reactions can be classified into several main types based on how reactants transform into products.' },
      { title: 'Main Types', content: 'The five main types of chemical reactions:', keyPoints: ['Synthesis (Combination): A + B → AB', 'Decomposition: AB → A + B', 'Single Displacement: A + BC → AC + B', 'Double Displacement: AB + CD → AD + CB', 'Combustion: Fuel + O₂ → CO₂ + H₂O'], example: 'Rusting: 4Fe + 3O₂ → 2Fe₂O₃ (synthesis/oxidation)\nAntacid: HCl + NaOH → NaCl + H₂O (double displacement/neutralization)' },
      { title: 'Redox Reactions', content: 'Reactions involving the transfer of electrons. Oxidation is loss of electrons; reduction is gain.', keyPoints: ['OIL RIG: Oxidation Is Loss, Reduction Is Gain', 'Oxidizing agent: gets reduced, causes oxidation', 'Reducing agent: gets oxidized, causes reduction', 'Example: Zn + Cu²⁺ → Zn²⁺ + Cu'] }
    ]
  },
  {
    id: 'states-of-matter', title: 'States of Matter', icon: '🌡️',
    description: 'Explore solids, liquids, gases, and phase transitions',
    sections: [
      { title: 'Three States', content: 'Matter exists primarily in three states: solid, liquid, and gas. Each has distinct properties.', keyPoints: ['Solid: fixed shape, fixed volume, particles vibrate in place', 'Liquid: no fixed shape, fixed volume, particles flow', 'Gas: no fixed shape, no fixed volume, particles move freely', 'Plasma: ionized gas (stars, lightning)'] },
      { title: 'Phase Transitions', content: 'Energy changes cause matter to transition between states.', keyPoints: ['Melting: solid → liquid (absorbs heat)', 'Boiling: liquid → gas (absorbs heat)', 'Condensation: gas → liquid (releases heat)', 'Freezing: liquid → solid (releases heat)', 'Sublimation: solid → gas (dry ice)'] },
      { title: 'Gas Laws', content: 'The behavior of gases is described by several laws.', keyPoints: ['Boyle\'s Law: P₁V₁ = P₂V₂ (at constant T)', 'Charles\'s Law: V₁/T₁ = V₂/T₂ (at constant P)', 'Ideal Gas Law: PV = nRT', 'R = 0.08206 L·atm/(mol·K)'] }
    ]
  },
  {
    id: 'solutions', title: 'Solutions', icon: '🧊',
    description: 'Understand mixtures, solubility, and concentration',
    sections: [
      { title: 'Basics', content: 'A solution is a homogeneous mixture of a solute dissolved in a solvent.', keyPoints: ['Solute: substance being dissolved', 'Solvent: substance doing the dissolving (often water)', 'Aqueous solutions: water is the solvent', '"Like dissolves like": polar dissolves polar, nonpolar dissolves nonpolar'] },
      { title: 'Concentration', content: 'Concentration describes how much solute is in a solution.', keyPoints: ['Molarity (M) = moles solute / liters solution', 'Molality (m) = moles solute / kg solvent', 'Mass percent = (mass solute / mass solution) × 100', 'Parts per million (ppm) for very dilute solutions'], example: 'A 1 M NaCl solution has 1 mole (58.44 g) of NaCl per liter of solution.' },
      { title: 'Dilution', content: 'Adding more solvent decreases concentration: M₁V₁ = M₂V₂', keyPoints: ['M₁V₁ = M₂V₂ (moles of solute stay constant)', 'Used to prepare standard solutions', 'Always add acid to water, never water to acid'] }
    ]
  },
  {
    id: 'stoichiometry', title: 'Stoichiometry', icon: '📐',
    description: 'Master the mathematics of chemical reactions',
    sections: [
      { title: 'The Mole', content: 'The mole is the chemist\'s counting unit. One mole = 6.022 × 10²³ particles (Avogadro\'s number).', keyPoints: ['1 mole of C-12 = exactly 12 grams', 'Molar mass: mass of one mole (g/mol)', 'Moles = mass / molar mass', 'Connects microscopic (atoms) to macroscopic (grams)'] },
      { title: 'Mole Ratios', content: 'Balanced equations give the mole ratios between reactants and products.', keyPoints: ['Coefficients = mole ratios', '2H₂ + O₂ → 2H₂O means 2 mol H₂ reacts with 1 mol O₂', 'Use ratios to convert between substances'], example: 'How many grams of H₂O from 4 g H₂?\n4 g H₂ × (1 mol/2 g) × (2 mol H₂O/2 mol H₂) × (18 g/mol) = 36 g H₂O' },
      { title: 'Limiting Reagent', content: 'The reactant that runs out first limits the amount of product formed.', keyPoints: ['Calculate moles of each reactant', 'Divide by coefficient to find limiting reagent', 'Use limiting reagent to calculate theoretical yield', 'Excess reagent: what\'s left over'] }
    ]
  },
  {
    id: 'thermodynamics', title: 'Thermodynamics', icon: '🔥',
    description: 'Explore energy changes in chemical reactions',
    sections: [
      { title: 'Energy in Reactions', content: 'Every chemical reaction involves an energy change. The study of these energy changes is thermodynamics.', keyPoints: ['Exothermic: releases energy (ΔH < 0)', 'Endothermic: absorbs energy (ΔH > 0)', 'Enthalpy (H): heat content at constant pressure', 'Measured in kJ/mol'] },
      { title: 'Laws of Thermodynamics', content: 'Three fundamental laws govern energy in chemistry.', keyPoints: ['1st Law: Energy cannot be created or destroyed', '2nd Law: Entropy of the universe always increases', '3rd Law: Entropy of a perfect crystal at 0 K is zero', 'Gibbs Free Energy: ΔG = ΔH - TΔS'] },
      { title: 'Spontaneity', content: 'A reaction is spontaneous if ΔG < 0 (Gibbs free energy is negative).', keyPoints: ['ΔG < 0: spontaneous', 'ΔG > 0: non-spontaneous', 'ΔG = 0: equilibrium', 'Exothermic + increase in entropy → always spontaneous'], example: 'Ice melting at room temperature: endothermic but entropy increases enough to make ΔG negative.' }
    ]
  }
];
