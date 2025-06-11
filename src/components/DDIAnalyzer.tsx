import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  AlertTriangle,
  Plus,
  X,
  Search,
  Activity,
  Shield,
  CheckCircle,
  XCircle,
  Info,
  Lock,
  Pill,
  FileText,
  Download,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface MockDrugInteraction {
  id: string;
  drug1: string;
  drug2: string;
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  effect: string;
  recommendation: string;
  mechanism?: string;
  clinicalSignificance: string;
}

interface SelectedMedication {
  id: string;
  name: string;
  dosage?: string;
  frequency?: string;
}

const DDIAnalyzer: React.FC = () => {
  const { user } = useAuth();
  const [selectedMedications, setSelectedMedications] = useState<SelectedMedication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<MockDrugInteraction[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [simulateMode, setSimulateMode] = useState(false);
  const [expandedInteractions, setExpandedInteractions] = useState<{ [key: string]: boolean }>({});

  // Mock medication database
  const mockMedications = [
    { id: '1', name: 'Aspirin', category: 'NSAID' },
    { id: '2', name: 'Ibuprofen', category: 'NSAID' },
    { id: '3', name: 'Metformin', category: 'Antidiabetic' },
    { id: '4', name: 'Insulin', category: 'Antidiabetic' },
    { id: '5', name: 'Warfarin', category: 'Anticoagulant' },
    { id: '6', name: 'Amiodarone', category: 'Antiarrhythmic' },
    { id: '7', name: 'Lisinopril', category: 'ACE Inhibitor' },
    { id: '8', name: 'Atorvastatin', category: 'Statin' },
    { id: '9', name: 'Sertraline', category: 'SSRI' },
    { id: '10', name: 'Omeprazole', category: 'PPI' },
    { id: '11', name: 'Digoxin', category: 'Cardiac Glycoside' },
    { id: '12', name: 'Phenytoin', category: 'Anticonvulsant' },
    { id: '13', name: 'Clopidogrel', category: 'Antiplatelet' },
    { id: '14', name: 'Simvastatin', category: 'Statin' },
    { id: '15', name: 'Tramadol', category: 'Opioid' }
  ];

  // Mock interaction database
  const mockInteractions: { [key: string]: MockDrugInteraction } = {
    'Aspirin|Ibuprofen': {
      id: '1',
      drug1: 'Aspirin',
      drug2: 'Ibuprofen',
      severity: 'High',
      effect: 'Increased risk of gastrointestinal bleeding and ulceration',
      recommendation: 'Avoid co-administration. Consider alternative pain management strategies.',
      mechanism: 'Additive inhibition of COX-1 enzyme',
      clinicalSignificance: 'Significantly increased bleeding risk, especially in elderly patients'
    },
    'Metformin|Insulin': {
      id: '2',
      drug1: 'Metformin',
      drug2: 'Insulin',
      severity: 'Moderate',
      effect: 'Increased risk of hypoglycemia',
      recommendation: 'Monitor blood glucose levels closely. Consider dose adjustments.',
      mechanism: 'Additive glucose-lowering effects',
      clinicalSignificance: 'Enhanced glycemic control but requires careful monitoring'
    },
    'Warfarin|Amiodarone': {
      id: '3',
      drug1: 'Warfarin',
      drug2: 'Amiodarone',
      severity: 'Critical',
      effect: 'Significantly increased anticoagulation effect',
      recommendation: 'Reduce warfarin dose by 25-50%. Monitor INR weekly initially.',
      mechanism: 'CYP2C9 inhibition by amiodarone',
      clinicalSignificance: 'Life-threatening bleeding risk if not properly managed'
    },
    'Lisinopril|Atorvastatin': {
      id: '4',
      drug1: 'Lisinopril',
      drug2: 'Atorvastatin',
      severity: 'Low',
      effect: 'Potential for increased muscle-related side effects',
      recommendation: 'Monitor for signs of myopathy. Generally safe combination.',
      mechanism: 'Possible pharmacokinetic interaction',
      clinicalSignificance: 'Low clinical significance, routine monitoring sufficient'
    },
    'Sertraline|Omeprazole': {
      id: '5',
      drug1: 'Sertraline',
      drug2: 'Omeprazole',
      severity: 'Moderate',
      effect: 'Increased sertraline levels and potential serotonergic effects',
      recommendation: 'Monitor for increased serotonergic side effects. Consider dose adjustment.',
      mechanism: 'CYP2C19 inhibition by omeprazole',
      clinicalSignificance: 'May require sertraline dose reduction in some patients'
    },
    'Digoxin|Amiodarone': {
      id: '6',
      drug1: 'Digoxin',
      drug2: 'Amiodarone',
      severity: 'High',
      effect: 'Increased digoxin levels leading to toxicity risk',
      recommendation: 'Reduce digoxin dose by 50%. Monitor digoxin levels closely.',
      mechanism: 'P-glycoprotein inhibition and renal clearance reduction',
      clinicalSignificance: 'High risk of digoxin toxicity requiring immediate dose adjustment'
    },
    'Warfarin|Aspirin': {
      id: '7',
      drug1: 'Warfarin',
      drug2: 'Aspirin',
      severity: 'High',
      effect: 'Dramatically increased bleeding risk',
      recommendation: 'Avoid combination unless absolutely necessary. Use lowest effective doses.',
      mechanism: 'Additive anticoagulant and antiplatelet effects',
      clinicalSignificance: 'Major bleeding risk, requires specialist supervision'
    },
    'Simvastatin|Amiodarone': {
      id: '8',
      drug1: 'Simvastatin',
      drug2: 'Amiodarone',
      severity: 'High',
      effect: 'Increased risk of myopathy and rhabdomyolysis',
      recommendation: 'Limit simvastatin dose to 20mg daily. Monitor CK levels.',
      mechanism: 'CYP3A4 inhibition by amiodarone',
      clinicalSignificance: 'Significant muscle toxicity risk requiring dose limitation'
    }
  };

  const filteredMedications = mockMedications.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedMedications.some(selected => selected.id === med.id)
  );

  const addMedication = (medication: typeof mockMedications[0]) => {
    if (selectedMedications.length >= 10) {
      alert('Maximum 10 medications allowed for analysis');
      return;
    }
    
    setSelectedMedications(prev => [...prev, {
      id: medication.id,
      name: medication.name
    }]);
    setSearchTerm('');
  };

  const removeMedication = (id: string) => {
    setSelectedMedications(prev => prev.filter(med => med.id !== id));
    setShowResults(false);
    setAnalysisResults([]);
  };

  const toggleInteractionExpansion = (interactionId: string) => {
    setExpandedInteractions(prev => ({
      ...prev,
      [interactionId]: !prev[interactionId]
    }));
  };

  const analyzeInteractions = async () => {
    if (selectedMedications.length < 2) {
      alert('Please select at least 2 medications for interaction analysis');
      return;
    }

    setIsAnalyzing(true);
    setShowResults(false);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, simulateMode ? 3000 : 1500));

    const interactions: MockDrugInteraction[] = [];

    // Check all medication pairs for interactions
    for (let i = 0; i < selectedMedications.length; i++) {
      for (let j = i + 1; j < selectedMedications.length; j++) {
        const med1 = selectedMedications[i].name;
        const med2 = selectedMedications[j].name;
        
        // Check both combinations
        const key1 = `${med1}|${med2}`;
        const key2 = `${med2}|${med1}`;
        
        const interaction = mockInteractions[key1] || mockInteractions[key2];
        
        if (interaction) {
          interactions.push(interaction);
        }
      }
    }

    setAnalysisResults(interactions);
    setShowResults(true);
    setIsAnalyzing(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />;
      case 'High':
        return <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />;
      case 'Moderate':
        return <Info className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />;
      case 'Low':
        return <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />;
      default:
        return <Info className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />;
    }
  };

  // Check if user has access
  const hasAccess = user?.role === 'admin' || user?.role === 'doctor';

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-md w-full">
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
              <Lock className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              Drug-Drug Interaction analysis is only available to Doctors and Administrators for clinical safety.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" />
                <p className="text-sm text-yellow-800">
                  <strong>Your Role:</strong> {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </p>
              </div>
            </div>
            <button
              onClick={() => window.history.back()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors w-full sm:w-auto"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Drug-Drug Interaction Analyzer</h1>
          <p className="text-gray-600 text-sm sm:text-base">Analyze potential interactions between medications</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={simulateMode}
                onChange={(e) => setSimulateMode(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
            <span className="ml-2 text-sm text-gray-600 hidden sm:inline">Simulate DrugBank API</span>
            <span className="ml-2 text-xs text-gray-600 sm:hidden">Simulate API</span>
          </div>
        </div>
      </div>

      {/* Access Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Shield className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            <strong>Clinical Access:</strong> You have authorized access to perform drug interaction analysis.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
        {/* Medication Selection */}
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Pill className="h-5 w-5 mr-2" />
                Select Medications
              </h2>
            </div>
            <div className="p-4 sm:p-6">
              {/* Search */}
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search medications..."
                />
              </div>

              {/* Medication Search Results */}
              {searchTerm && (
                <div className="mb-4 max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                  {filteredMedications.length > 0 ? (
                    filteredMedications.slice(0, 5).map((medication) => (
                      <button
                        key={medication.id}
                        onClick={() => addMedication(medication)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center justify-between"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="font-medium text-gray-900 block truncate">{medication.name}</span>
                          <span className="text-sm text-gray-500 block truncate">({medication.category})</span>
                        </div>
                        <Plus className="h-4 w-4 text-blue-500 flex-shrink-0 ml-2" />
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-gray-500 text-sm">No medications found</div>
                  )}
                </div>
              )}

              {/* Selected Medications */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Selected Medications ({selectedMedications.length}/10)
                </h3>
                {selectedMedications.length > 0 ? (
                  <div className="space-y-2">
                    {selectedMedications.map((medication) => (
                      <div
                        key={medication.id}
                        className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                      >
                        <span className="font-medium text-blue-900 truncate flex-1 mr-2">{medication.name}</span>
                        <button
                          onClick={() => removeMedication(medication.id)}
                          className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Pill className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="mb-1">No medications selected</p>
                    <p className="text-sm">Search and add medications to analyze interactions</p>
                  </div>
                )}
              </div>

              {/* Analyze Button */}
              <div className="mt-6">
                <button
                  onClick={analyzeInteractions}
                  disabled={selectedMedications.length < 2 || isAnalyzing}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      <span className="hidden sm:inline">
                        {simulateMode ? 'Connecting to DrugBank API...' : 'Analyzing Interactions...'}
                      </span>
                      <span className="sm:hidden">Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Activity className="h-5 w-5 mr-2" />
                      <span className="hidden sm:inline">Analyze Interactions</span>
                      <span className="sm:hidden">Analyze</span>
                    </>
                  )}
                </button>
                {selectedMedications.length < 2 && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Select at least 2 medications to analyze interactions
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Results */}
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span className="truncate">Interaction Analysis Results</span>
              </h2>
            </div>
            <div className="p-4 sm:p-6">
              {!showResults ? (
                <div className="text-center py-12 text-gray-500">
                  <Activity className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No Analysis Performed</p>
                  <p className="text-sm">Select medications and click "Analyze Interactions" to see results</p>
                </div>
              ) : analysisResults.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
                  <p className="text-lg font-medium text-green-800 mb-2">No Interactions Found</p>
                  <p className="text-sm text-green-600 mb-4">The selected medications appear to be safe to use together</p>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-xs text-green-700">
                      <strong>Note:</strong> This analysis is based on known drug interactions. Always consult clinical guidelines and consider patient-specific factors.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <span className="text-sm font-medium text-gray-700">
                      {analysisResults.length} interaction{analysisResults.length !== 1 ? 's' : ''} detected
                    </span>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center justify-center sm:justify-start">
                      <Download className="h-4 w-4 mr-1" />
                      Export Report
                    </button>
                  </div>

                  {analysisResults.map((interaction) => (
                    <div key={interaction.id} className={`border rounded-lg ${getSeverityColor(interaction.severity)}`}>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center min-w-0 flex-1">
                            {getSeverityIcon(interaction.severity)}
                            <div className="ml-3 min-w-0 flex-1">
                              <h3 className="font-semibold text-gray-900 break-words">
                                {interaction.drug1} + {interaction.drug2}
                              </h3>
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getSeverityColor(interaction.severity)}`}>
                                {interaction.severity.toUpperCase()} SEVERITY
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleInteractionExpansion(interaction.id)}
                            className="ml-2 p-1 text-gray-400 hover:text-gray-600 flex-shrink-0"
                          >
                            {expandedInteractions[interaction.id] ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </button>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium text-gray-800 mb-1">Clinical Effect:</h4>
                            <p className="text-sm text-gray-700 break-words">{interaction.effect}</p>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-gray-800 mb-1">Recommendation:</h4>
                            <p className="text-sm text-gray-700 break-words">{interaction.recommendation}</p>
                          </div>

                          {expandedInteractions[interaction.id] && (
                            <>
                              {interaction.mechanism && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-800 mb-1">Mechanism:</h4>
                                  <p className="text-sm text-gray-700 break-words">{interaction.mechanism}</p>
                                </div>
                              )}

                              <div>
                                <h4 className="text-sm font-medium text-gray-800 mb-1">Clinical Significance:</h4>
                                <p className="text-sm text-gray-700 break-words">{interaction.clinicalSignificance}</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Summary */}
                  <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Analysis Summary</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Medications:</span>
                        <span className="font-medium text-gray-900">{selectedMedications.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Interactions Found:</span>
                        <span className="font-medium text-gray-900">{analysisResults.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Highest Severity:</span>
                        <span className="font-medium text-gray-900">
                          {analysisResults.length > 0 
                            ? analysisResults.reduce((max, curr) => {
                                const severityOrder = { 'Low': 1, 'Moderate': 2, 'High': 3, 'Critical': 4 };
                                return severityOrder[curr.severity as keyof typeof severityOrder] > severityOrder[max.severity as keyof typeof severityOrder] ? curr : max;
                              }).severity
                            : 'None'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Analysis Date:</span>
                        <span className="font-medium text-gray-900">{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DDIAnalyzer;