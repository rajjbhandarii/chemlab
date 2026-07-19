export interface Chemical {
  _id: string;
  name: string;
  formula: string;
  category: string;
  molarMass: number;
  density: { value: number; unit: string };
  meltingPoint: { value: number; unit: string };
  boilingPoint: { value: number; unit: string };
  color: string;
  physicalState: string;
  odor: string;
  solubility: string;
  casNumber?: string;
  uses: string[];
  industrialUses: string[];
  labUses: string[];
  hazards: string[];
  storageInstructions: string;
  facts: string[];
  commonReactions: CommonReaction[];
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CommonReaction {
  equation: string;
  description: string;
}

export interface ChemicalListItem {
  _id: string;
  name: string;
  formula: string;
  category: string;
  color: string;
  physicalState: string;
  molarMass?: number;
  hazards?: string[];
  imageUrl?: string;
}

export interface ChemicalSearchResult {
  _id: string;
  name: string;
  formula: string;
  category: string;
  physicalState: string;
  color: string;
}

export interface CategoryCount {
  name: string;
  count: number;
}

export interface StatsResponse {
  chemicals: number;
  reactions: number;
  quizzes: number;
}

export interface ChemicalPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ChemicalListResponse {
  chemicals: ChemicalListItem[];
  pagination: ChemicalPagination;
}
