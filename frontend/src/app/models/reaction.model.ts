export interface ReactionProduct {
  name: string;
  formula: string;
  physicalState: string;
  color: string;
}

export interface SafetyWarning {
  type: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
}

export interface Reaction {
  _id: string;
  reactants: string[];
  reactantNames: string[];
  products: ReactionProduct[];
  balancedEquation: string;
  reactionType: string;
  energy: 'Exothermic' | 'Endothermic' | 'Neutral';
  observations: string[];
  conditions: {
    required: boolean;
    details: string[];
  };
  explanation: string;
  dangerLevel: 'Safe' | 'Caution' | 'Unsafe' | 'Highly Dangerous';
  safetyWarnings: SafetyWarning[];
  funFact: string;
  isPopular: boolean;
}

export interface ReactionResult {
  found: boolean;
  reaction?: Reaction;
  message?: string;
}

export interface PopularReaction {
  _id: string;
  reactants: string[];
  reactantNames: string[];
  balancedEquation: string;
  reactionType: string;
  products: ReactionProduct[];
}
