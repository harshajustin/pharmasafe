import { useState } from 'react';
import { DrugInteraction, Medication } from '../types';

// Mock drug interaction data
const mockInteractions: DrugInteraction[] = [
  {
    id: '1',
    drug1: 'Lisinopril',
    drug2: 'Atorvastatin',
    severity: 'moderate',
    description: 'ACE inhibitors may increase the risk of myopathy when used with statins.',
    clinicalEffect: 'Increased risk of muscle pain and weakness',
    recommendation: 'Monitor patient for signs of myopathy. Consider dose adjustment.',
    mechanism: 'Both drugs are metabolized by CYP3A4 enzyme system'
  },
  {
    id: '2',
    drug1: 'Sertraline',
    drug2: 'Omeprazole',
    severity: 'minor',
    description: 'Proton pump inhibitors may slightly increase sertraline levels.',
    clinicalEffect: 'Minimal increase in sertraline concentration',
    recommendation: 'Monitor for increased serotonergic effects. No dose adjustment typically needed.',
    mechanism: 'CYP2C19 inhibition by omeprazole'
  },
  {
    id: '3',
    drug1: 'Warfarin',
    drug2: 'Amiodarone',
    severity: 'major',
    description: 'Amiodarone significantly increases warfarin effects.',
    clinicalEffect: 'Increased risk of bleeding',
    recommendation: 'Reduce warfarin dose by 25-50%. Monitor INR closely.',
    mechanism: 'CYP2C9 and CYP3A4 inhibition'
  }
];

export const useDrugInteractions = () => {
  const [loading, setLoading] = useState(false);

  const analyzeDrugInteractions = async (medications: Medication[]): Promise<DrugInteraction[]> => {
    setLoading(true);
    
    // Simulate API call to DrugBank
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const interactions: DrugInteraction[] = [];
    
    // Check all medication pairs for interactions
    for (let i = 0; i < medications.length; i++) {
      for (let j = i + 1; j < medications.length; j++) {
        const med1 = medications[i];
        const med2 = medications[j];
        
        // Find matching interactions (simplified mock logic)
        const interaction = mockInteractions.find(
          int => 
            (int.drug1 === med1.name && int.drug2 === med2.name) ||
            (int.drug1 === med2.name && int.drug2 === med1.name)
        );
        
        if (interaction) {
          interactions.push(interaction);
        }
      }
    }
    
    setLoading(false);
    return interactions;
  };

  const getDrugInfo = async (drugName: string) => {
    // Simulate DrugBank API call for drug information
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setLoading(false);
    
    // Mock drug info
    return {
      name: drugName,
      description: `${drugName} is a medication used for various therapeutic purposes.`,
      indications: ['Primary indication', 'Secondary indication'],
      contraindications: ['Contraindication 1', 'Contraindication 2'],
      sideEffects: ['Common side effect', 'Less common side effect'],
    };
  };

  return {
    analyzeDrugInteractions,
    getDrugInfo,
    loading,
  };
};