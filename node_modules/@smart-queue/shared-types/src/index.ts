export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'ADMIN' 
  | 'HOD' 
  | 'DOCTOR' 
  | 'NURSE' 
  | 'STAFF' 
  | 'CITIZEN';

export type TokenStatus = 
  | 'WAITING' 
  | 'TRIAGED' 
  | 'CALLED' 
  | 'IN_SERVICE' 
  | 'TRANSFERRED' 
  | 'COMPLETED' 
  | 'NO_SHOW' 
  | 'CANCELLED';

export type PriorityType = 
  | 'NORMAL' 
  | 'EMERGENCY' 
  | 'SENIOR_CITIZEN' 
  | 'DIFFERENTLY_ABLED' 
  | 'PREGNANT' 
  | 'PRE_BOOKED';

export type TriageLevel = 
  | 'RED_CRITICAL' 
  | 'YELLOW_URGENT' 
  | 'GREEN_STABLE';

export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  role: UserRole;
  departmentId?: string;
  branchId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientVitals {
  id: string;
  tokenId: string;
  nurseId: string;
  systolicBp?: number;
  diastolicBp?: number;
  pulseRate?: number;
  spo2Percent?: number;
  tempFahrenheit?: number;
  triageRisk: TriageLevel;
  notes?: string;
  recordedAt: string;
}

export interface KioskTerminal {
  id: string;
  branchId: string;
  terminalCode: string;
  location: string;
  paperRollPercent: number;
  status: 'ONLINE' | 'LOW_PAPER' | 'OUT_OF_PAPER' | 'MAINTENANCE';
  lastHeartbeatAt: string;
}

export interface EmergencySurgePlan {
  id: string;
  branchId: string;
  disasterLevel: 'LEVEL_1_ELEVATED' | 'LEVEL_2_MASS_CASUALTY' | 'LEVEL_3_CRITICAL_ICU';
  reallocatedCountersCount: number;
  broadcastAlertText: string;
  isActive: boolean;
  activatedAt: string;
}

export interface Token {
  id: string;
  tokenNumber: number;
  displayCode: string;
  patientName: string;
  patientPhone: string;
  abhaId?: string;
  healthSchemeNo?: string;
  serviceId: string;
  departmentId: string;
  branchId: string;
  counterId?: string;
  status: TokenStatus;
  priorityType: PriorityType;
  triageLevel: TriageLevel;
  priorityScore: number;
  joinedAt: string;
  calledAt?: string;
  inServiceAt?: string;
  completedAt?: string;
  estimatedWaitMinutes: number;
  predictedWaitMinutes?: number;
  teleConsultUrl?: string;
  vitals?: PatientVitals;
}

export interface AuditLog {
  id: string;
  action: string;
  actorId: string;
  actorName: string;
  details: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
