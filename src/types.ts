export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type TransactionStatus = 'SAFE' | 'REVIEW' | 'BLOCKED' | 'INVESTIGATING';
export type CaseStatus = 'OPEN' | 'RESOLVED' | 'ESCALATED';
export type CaseVerdict = 'FRAUD' | 'REVIEW' | 'CLEAR';

export interface Location {
  city: string;
  country: string;
  lat: number;
  lng: number;
}

export interface AgentResult {
  agent: 'velocity' | 'geo' | 'behavior' | 'pattern';
  riskScore: number;
  confidence: number;
  verdict: 'HIGH' | 'MEDIUM' | 'LOW';
  headline: string;
  reasoning: string;
  flags: string[];
}

export interface Transaction {
  id: string;
  accountId: string;
  date: string;
  amount: number;
  currency: string;
  merchant: string;
  category: string;
  location: Location | null;
  deviceId: string | null;
  ipAddress: string | null;
  riskScore: number;
  riskLevel: RiskLevel;
  status: TransactionStatus;
  attackType: string | null;
  flagReasons: string[];
  agentResults: AgentResult[] | null;
  caseId: string | null;
  crossAccountFlags: string[];
}

export interface AccountProfile {
  avgTransactionAmount: number;
  avgDailyTransactions: number;
  knownMerchants: string[];
  typicalActiveHours: number[];
  homeCountry: string;
  knownDevices: string[];
}

export interface Account {
  id: string;
  bankName: string;
  accountNickname: string;
  lastFourDigits: string;
  color: string;
  currency: string;
  transactions: Transaction[];
  profile: AccountProfile;
  riskStatus: 'PROTECTED' | 'ALERT' | 'INVESTIGATING';
  addedAt: string;
}

export interface Evidence {
  id: number;
  title: string;
  description: string;
  source: string;
  confidence: number;
}

export interface InvestigationStep {
  step: number;
  type: 'thinking' | 'tool_call' | 'tool_result' | 'text_chunk';
  title: string;
  content: string;
  findings?: string[];
  tool?: string;
}

export interface CaseFile {
  id: string;
  createdAt: string;
  resolvedAt: string | null;
  status: CaseStatus;
  verdict: CaseVerdict;
  confidence: number;
  title: string;
  narrative: string;
  subject: { type: string; identifier: string };
  affectedTransactions: string[];
  affectedAccounts: string[];
  evidence: Evidence[];
  recommendedActions: { type: string; label: string; priority: 'URGENT' | 'RECOMMENDED' | 'OPTIONAL' }[];
  investigationSteps: InvestigationStep[];
  bankLetterDraft: string | null;
}
