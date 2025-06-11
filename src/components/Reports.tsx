import React, { useState, useEffect } from 'react';
import { usePatients } from '../hooks/usePatients';
import { useDrugInteractions } from '../hooks/useDrugInteractions';
import { useAuth } from '../context/AuthContext';
import { hasPermission } from '../utils/rbac';
import {
  FileText,
  Download,
  Search,
  Calendar,
  User,
  AlertTriangle,
  BarChart3,
  Filter,
  PieChart,
  Lock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { InteractionReport } from '../types';

const Reports: React.FC = () => {
  const { user } = useAuth();
  const { patients } = usePatients();
  const { analyzeDrugInteractions } = useDrugInteractions();
  const [reports, setReports] = useState<InteractionReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [generating, setGenerating] = useState(false);
  const [expandedReports, setExpandedReports] = useState<{ [key: string]: boolean }>({});

  const canWriteReports = hasPermission(user?.role || 'nurse', 'reports', 'write');
  const canExecuteReports = hasPermission(user?.role || 'nurse', 'reports', 'execute');

  useEffect(() => {
    // Mock reports data
    const mockReports: InteractionReport[] = [
      {
        id: '1',
        patientId: '1',
        patientName: 'John Anderson',
        generatedBy: user?.name || 'Unknown',
        generatedAt: new Date().toISOString(),
        interactions: [
          {
            id: '1',
            drug1: 'Lisinopril',
            drug2: 'Atorvastatin',
            severity: 'moderate',
            description: 'ACE inhibitors may increase the risk of myopathy when used with statins.',
            clinicalEffect: 'Increased risk of muscle pain and weakness',
            recommendation: 'Monitor patient for signs of myopathy. Consider dose adjustment.',
            mechanism: 'Both drugs are metabolized by CYP3A4 enzyme system'
          }
        ],
        medications: [
          {
            id: '1',
            name: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once daily',
            startDate: '2024-01-01',
            prescribedBy: 'Dr. Sarah Smith',
            indication: 'Hypertension'
          }
        ],
        riskLevel: 'medium',
        recommendations: [
          'Monitor patient for signs of myopathy',
          'Consider dose adjustment if necessary',
          'Schedule follow-up in 2 weeks'
        ]
      },
      {
        id: '2',
        patientId: '2',
        patientName: 'Maria Rodriguez',
        generatedBy: user?.name || 'Unknown',
        generatedAt: new Date(Date.now() - 86400000).toISOString(),
        interactions: [],
        medications: [
          {
            id: '4',
            name: 'Sertraline',
            dosage: '50mg',
            frequency: 'Once daily',
            startDate: '2024-01-10',
            prescribedBy: 'Dr. Sarah Smith',
            indication: 'Depression'
          }
        ],
        riskLevel: 'low',
        recommendations: ['Continue current medication regimen', 'Regular monitoring as scheduled']
      }
    ];

    setReports(mockReports);
  }, [user]);

  const generateNewReport = async () => {
    if (!canExecuteReports) return;
    
    setGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demo, we'll generate a report for the first patient
    if (patients.length > 0) {
      const patient = patients[0];
      const interactions = await analyzeDrugInteractions(patient.currentMedications);
      
      const newReport: InteractionReport = {
        id: Date.now().toString(),
        patientId: patient.id,
        patientName: patient.name,
        generatedBy: user?.name || 'Unknown',
        generatedAt: new Date().toISOString(),
        interactions,
        medications: patient.currentMedications,
        riskLevel: interactions.some(i => i.severity === 'major') ? 'high' : 
                  interactions.some(i => i.severity === 'moderate') ? 'medium' : 'low',
        recommendations: [
          'Review medication interactions',
          'Monitor patient closely',
          'Consider alternative therapies if needed'
        ]
      };
      
      setReports(prev => [newReport, ...prev]);
    }
    
    setGenerating(false);
  };

  const toggleReportExpansion = (reportId: string) => {
    setExpandedReports(prev => ({
      ...prev,
      [reportId]: !prev[reportId]
    }));
  };

  const filteredReports = reports.filter(report =>
    report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.generatedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Interaction Reports</h1>
          <p className="text-gray-600 text-sm sm:text-base">Generate and manage drug interaction analysis reports</p>
        </div>
        <div className="flex space-x-3">
          {canExecuteReports ? (
            <button 
              onClick={generateNewReport}
              disabled={generating}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center transition-colors w-full sm:w-auto justify-center"
            >
              {generating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span className="hidden sm:inline">Generating...</span>
                  <span className="sm:hidden">Generating...</span>
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline">Generate Report</span>
                  <span className="sm:hidden">Generate</span>
                </>
              )}
            </button>
          ) : (
            <div className="bg-gray-100 text-gray-500 px-4 py-2 rounded-lg flex items-center w-full sm:w-auto justify-center">
              <Lock className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">View Only Access</span>
              <span className="sm:hidden">View Only</span>
            </div>
          )}
        </div>
      </div>

      {/* Role-based access notice */}
      {!canExecuteReports && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">
              <strong>Limited Access:</strong> You can view existing reports but cannot generate new ones. Contact a doctor to request new reports.
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search reports..."
            />
          </div>
          <div>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="all">All time</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">Showing {filteredReports.length} reports</span>
          </div>
        </div>
      </div>

      {/* Reports Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="ml-3 sm:ml-4 min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-600 truncate">Total Reports</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{reports.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
            </div>
            <div className="ml-3 sm:ml-4 min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-600 truncate">High Risk</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {reports.filter(r => r.riskLevel === 'high').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
            </div>
            <div className="ml-3 sm:ml-4 min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-600 truncate">Medium Risk</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {reports.filter(r => r.riskLevel === 'medium').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <PieChart className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div className="ml-3 sm:ml-4 min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-600 truncate">Low Risk</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {reports.filter(r => r.riskLevel === 'low').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredReports.map((report) => (
            <div key={report.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 break-words">{report.patientName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(report.riskLevel)} flex-shrink-0`}>
                      {report.riskLevel.toUpperCase()} RISK
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">Generated: {new Date(report.generatedAt).toLocaleDateString()}</span>
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        By: {report.generatedBy}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Medications: {report.medications.length}
                      </p>
                      <p className="text-sm text-gray-600">
                        Interactions: {report.interactions.length}
                      </p>
                    </div>
                  </div>

                  {/* Expandable Interactions Summary */}
                  {report.interactions.length > 0 && (
                    <div className="mb-4">
                      <button
                        onClick={() => toggleReportExpansion(report.id)}
                        className="flex items-center text-sm font-medium text-gray-900 mb-2 hover:text-gray-700"
                      >
                        <span>Detected Interactions:</span>
                        {expandedReports[report.id] ? (
                          <ChevronUp className="h-4 w-4 ml-1" />
                        ) : (
                          <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </button>
                      {expandedReports[report.id] && (
                        <div className="space-y-2">
                          {report.interactions.map((interaction) => (
                            <div key={interaction.id} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                                <span className="text-sm font-medium text-gray-900 break-words">
                                  {interaction.drug1} + {interaction.drug2}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(interaction.severity)} flex-shrink-0`}>
                                  {interaction.severity.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 break-words">{interaction.description}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Recommendations */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Recommendations:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {report.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                          <span className="break-words">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="ml-4 sm:ml-6 flex flex-col space-y-2 flex-shrink-0">
                  <button className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
                    <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">Download</span>
                  </button>
                  <button className="bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                    <span className="hidden sm:inline">View Details</span>
                    <span className="sm:hidden">Details</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;