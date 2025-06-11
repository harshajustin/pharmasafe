import React, { useState } from 'react';
import { usePatients } from '../hooks/usePatients';
import { useDrugInteractions } from '../hooks/useDrugInteractions';
import { useAuth } from '../context/AuthContext';
import { hasPermission } from '../utils/rbac';
import { 
  Search, 
  Plus, 
  User, 
  Calendar, 
  AlertTriangle, 
  Pill,
  FileText,
  Edit,
  Eye,
  Lock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Patient, DrugInteraction } from '../types';

const PatientList: React.FC = () => {
  const { user } = useAuth();
  const { patients, loading } = usePatients();
  const { analyzeDrugInteractions } = useDrugInteractions();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [interactions, setInteractions] = useState<DrugInteraction[]>([]);
  const [analyzingInteractions, setAnalyzingInteractions] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    medications: true,
    interactions: true
  });

  const canWritePatients = hasPermission(user?.role || 'nurse', 'patients', 'write');
  const canExecuteAnalysis = hasPermission(user?.role || 'nurse', 'interactions', 'execute');

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.medicalId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePatientSelect = async (patient: Patient) => {
    setSelectedPatient(patient);
    if (patient.currentMedications.length > 1 && canExecuteAnalysis) {
      setAnalyzingInteractions(true);
      const patientInteractions = await analyzeDrugInteractions(patient.currentMedications);
      setInteractions(patientInteractions);
      setAnalyzingInteractions(false);
    } else {
      setInteractions([]);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'major':
        return 'bg-red-100 text-red-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'minor':
        return 'bg-blue-100 text-blue-800';
      case 'contraindicated':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Patient Management</h1>
          <p className="text-gray-600 text-sm sm:text-base">Monitor patient medications and drug interactions</p>
        </div>
        {canWritePatients ? (
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors w-full sm:w-auto justify-center">
            <Plus className="h-5 w-5 mr-2" />
            Add Patient
          </button>
        ) : (
          <div className="bg-gray-100 text-gray-500 px-4 py-2 rounded-lg flex items-center w-full sm:w-auto justify-center">
            <Lock className="h-5 w-5 mr-2" />
            Read Only Access
          </div>
        )}
      </div>

      {/* Role-based access notice */}
      {!canExecuteAnalysis && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">
              <strong>Limited Access:</strong> You can view patient data but cannot perform drug interaction analysis. Contact a doctor for analysis requests.
            </p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search patients by name or medical ID..."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Patient List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Patients ({filteredPatients.length})</h2>
            </div>
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => handlePatientSelect(patient)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedPatient?.id === patient.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-100 rounded-full p-2 flex-shrink-0">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {patient.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">ID: {patient.medicalId}</p>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-1 flex-shrink-0" />
                        <span className="text-xs text-gray-500">{patient.age} years old</span>
                      </div>
                    </div>
                    {patient.currentMedications.length > 1 && canExecuteAnalysis && (
                      <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Patient Details */}
        <div className="lg:col-span-2">
          {selectedPatient ? (
            <div className="space-y-4 sm:space-y-6">
              {/* Patient Info */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <h2 className="text-lg font-semibold text-gray-900">Patient Details</h2>
                  <div className="flex space-x-2">
                    {canWritePatients ? (
                      <>
                        <button className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50">
                          <Edit className="h-5 w-5" />
                        </button>
                        <button className="text-green-600 hover:text-green-700 p-2 rounded-lg hover:bg-green-50">
                          <FileText className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center text-gray-500 text-sm">
                        <Lock className="h-4 w-4 mr-1" />
                        View Only
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Name</label>
                      <p className="text-gray-900 break-words">{selectedPatient.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Medical ID</label>
                      <p className="text-gray-900 break-words">{selectedPatient.medicalId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Age</label>
                      <p className="text-gray-900">{selectedPatient.age} years</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Gender</label>
                      <p className="text-gray-900 capitalize">{selectedPatient.gender}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-600">Allergies</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedPatient.allergies.map((allergy, index) => (
                        <span
                          key={index}
                          className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full"
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Medications */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                  <button
                    onClick={() => toggleSection('medications')}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Pill className="h-5 w-5 mr-2" />
                      Current Medications ({selectedPatient.currentMedications.length})
                    </h2>
                    {expandedSections.medications ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {expandedSections.medications && (
                  <div className="p-4 sm:p-6">
                    <div className="space-y-4">
                      {selectedPatient.currentMedications.map((medication) => (
                        <div key={medication.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium text-gray-900 break-words">{medication.name}</h3>
                              <p className="text-sm text-gray-600 break-words">
                                {medication.dosage} - {medication.frequency}
                              </p>
                              <p className="text-sm text-gray-500 mt-1 break-words">
                                For: {medication.indication}
                              </p>
                            </div>
                            <div className="text-left sm:text-right flex-shrink-0">
                              <p className="text-sm text-gray-600">Prescribed by</p>
                              <p className="text-sm font-medium text-gray-900 break-words">{medication.prescribedBy}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Drug Interactions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                  <button
                    onClick={() => toggleSection('interactions')}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Drug Interactions
                      {!canExecuteAnalysis && (
                        <Lock className="h-4 w-4 ml-2 text-gray-400" />
                      )}
                    </h2>
                    {expandedSections.interactions ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {expandedSections.interactions && (
                  <div className="p-4 sm:p-6">
                    {!canExecuteAnalysis ? (
                      <div className="text-center py-8">
                        <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">
                          You don't have permission to perform drug interaction analysis.
                        </p>
                        <p className="text-sm text-gray-500">
                          Contact a doctor to request interaction analysis for this patient.
                        </p>
                      </div>
                    ) : analyzingInteractions ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
                        <span className="text-gray-600">Analyzing interactions...</span>
                      </div>
                    ) : interactions.length > 0 ? (
                      <div className="space-y-4">
                        {interactions.map((interaction) => (
                          <div key={interaction.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                              <div className="min-w-0 flex-1">
                                <h3 className="font-medium text-gray-900 break-words">
                                  {interaction.drug1} + {interaction.drug2}
                                </h3>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getSeverityColor(interaction.severity)}`}>
                                  {interaction.severity.toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2 break-words">{interaction.description}</p>
                            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-2">
                              <p className="text-sm font-medium text-yellow-800">Clinical Effect:</p>
                              <p className="text-sm text-yellow-700 break-words">{interaction.clinicalEffect}</p>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded p-3">
                              <p className="text-sm font-medium text-blue-800">Recommendation:</p>
                              <p className="text-sm text-blue-700 break-words">{interaction.recommendation}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : selectedPatient.currentMedications.length > 1 ? (
                      <p className="text-gray-600 text-center py-8">No interactions detected</p>
                    ) : (
                      <p className="text-gray-600 text-center py-8">Patient needs at least 2 medications to check for interactions</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Select a patient to view details</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientList;