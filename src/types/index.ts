export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'doctor' | 'nurse';
  department?: string;
  createdAt: string;
  isActive: boolean;
  permissions?: string[];
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
  createdBy: string;
  lastModifiedBy: string;
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

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

// RBAC Types
export type UserRole = 'admin' | 'doctor' | 'nurse';

export interface RolePermissions {
  [key: string]: {
    read: boolean;
    write: boolean;
    delete: boolean;
    execute?: boolean;
  };
}

export interface RBACConfig {
  admin: RolePermissions;
  doctor: RolePermissions;
  nurse: RolePermissions;
}