import { useState, useEffect } from 'react';
import { Patient } from '../types';

// Mock patient data
const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'John Anderson',
    age: 67,
    gender: 'male',
    medicalId: 'MID-001',
    allergies: ['Penicillin', 'Aspirin'],
    currentMedications: [
      {
        id: '1',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        startDate: '2024-01-01',
        prescribedBy: 'Dr. Sarah Smith',
        indication: 'Hypertension',
        drugId: 'DB00722'
      },
      {
        id: '2',
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        startDate: '2024-01-15',
        prescribedBy: 'Dr. Sarah Smith',
        indication: 'Type 2 Diabetes',
        drugId: 'DB00331'
      },
      {
        id: '3',
        name: 'Atorvastatin',
        dosage: '20mg',
        frequency: 'Once daily',
        startDate: '2024-02-01',
        prescribedBy: 'Dr. Sarah Smith',
        indication: 'High Cholesterol',
        drugId: 'DB01076'
      }
    ],
    medicalHistory: ['Hypertension', 'Type 2 Diabetes', 'Hyperlipidemia'],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-02-01T14:30:00Z'
  },
  {
    id: '2',
    name: 'Maria Rodriguez',
    age: 45,
    gender: 'female',
    medicalId: 'MID-002',
    allergies: ['Codeine'],
    currentMedications: [
      {
        id: '4',
        name: 'Sertraline',
        dosage: '50mg',
        frequency: 'Once daily',
        startDate: '2024-01-10',
        prescribedBy: 'Dr. Sarah Smith',
        indication: 'Depression',
        drugId: 'DB01104'
      },
      {
        id: '5',
        name: 'Omeprazole',
        dosage: '20mg',
        frequency: 'Once daily',
        startDate: '2024-01-20',
        prescribedBy: 'Dr. Sarah Smith',
        indication: 'GERD',
        drugId: 'DB00338'
      }
    ],
    medicalHistory: ['Depression', 'GERD'],
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-20T11:45:00Z'
  }
];

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPatients(mockPatients);
      setLoading(false);
    }, 500);
  }, []);

  const addPatient = (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPatient: Patient = {
      ...patient,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPatients(prev => [...prev, newPatient]);
    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev =>
      prev.map(patient =>
        patient.id === id
          ? { ...patient, ...updates, updatedAt: new Date().toISOString() }
          : patient
      )
    );
  };

  const getPatient = (id: string) => {
    return patients.find(patient => patient.id === id);
  };

  return {
    patients,
    loading,
    addPatient,
    updatePatient,
    getPatient,
  };
};