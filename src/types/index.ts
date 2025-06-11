export interface User {
  id: string;
  email: string;
  name: string;
  role: 'doctor' | 'nurse';
  department?: string;
  createdAt: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  medicalId: string;
  allergies: string[];
  currentMedications: Medication[];
  medicalHistory: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  indication: string;
  drugId?: string;
}

export interface DrugInteraction {
  id: string;
  drug1: string;
  drug2: string;
  severity: 'minor' | 'moderate' | 'major' | 'contraindicated';
  description: string;
  clinicalEffect: string;
  recommendation: string;
  mechanism?: string;
}

export interface InteractionReport {
  id: string;
  patientId: string;
  patientName: string;
  generatedBy: string;
  generatedAt: string;
  interactions: DrugInteraction[];
  medications: Medication[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}