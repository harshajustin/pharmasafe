# PharmaSafe - Healthcare Drug-Drug Interaction (DDI) System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-38B2AC.svg)](https://tailwindcss.com/)

A comprehensive healthcare management system designed to analyze drug-drug interactions, manage patient records, and provide clinical decision support for healthcare professionals.

## 🚀 Features

### 🔬 Drug-Drug Interaction Analysis
- **Real-time DDI Analysis**: Analyze potential interactions between multiple medications
- **Severity Classification**: Categorizes interactions as Low, Moderate, High, or Critical
- **Clinical Recommendations**: Provides actionable recommendations for healthcare providers
- **Simulation Mode**: Test medication combinations in a safe environment

### 👥 Patient Management
- **Comprehensive Patient Records**: Manage patient demographics, medical history, and current medications
- **Allergy Tracking**: Monitor patient allergies and contraindications
- **Medication History**: Track current and historical medication regimens

### 🛡️ Role-Based Access Control (RBAC)
- **Multi-Role Support**: Admin, Doctor, and Nurse roles with specific permissions
- **Secure Authentication**: Protected routes and role-based access to features
- **Audit Logging**: Track user actions and system access

### 📊 Analytics & Reporting
- **Dashboard Analytics**: Real-time insights into system usage and patient data
- **Custom Reports**: Generate detailed reports on DDI analysis and patient care
- **System Monitoring**: Track critical alerts and system performance

### 🔧 System Administration
- **User Management**: Admin tools for managing healthcare staff accounts
- **System Settings**: Configure system parameters and preferences
- **Audit Logs**: Comprehensive logging for compliance and security

## 🛠️ Technology Stack

- **Frontend**: React 18.3.1 with TypeScript
- **Styling**: Tailwind CSS 3.4.1
- **Build Tool**: Vite 5.4.2
- **Routing**: React Router DOM 6.26.1
- **Icons**: Lucide React
- **Linting**: ESLint 9.9.1

## 📦 Installation

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/harshajustin/pharmasafe.git
   cd pharmasafe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── AuditLogs.tsx   # System audit logging
│   ├── Dashboard.tsx   # Main dashboard
│   ├── DDIAnalyzer.tsx # Drug interaction analyzer
│   ├── Layout.tsx      # Application layout
│   ├── LoginForm.tsx   # Authentication form
│   ├── PatientList.tsx # Patient management
│   ├── Reports.tsx     # Report generation
│   ├── Settings.tsx    # System settings
│   └── UserManagement.tsx # User administration
├── context/            # React context providers
│   └── AuthContext.tsx # Authentication context
├── hooks/              # Custom React hooks
│   ├── useDrugInteractions.ts
│   └── usePatients.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── rbac.ts         # Role-based access control
└── App.tsx             # Main application component
```

## 👤 User Roles & Permissions

### 🔑 Admin
- Full system access
- User management and administration
- System configuration and settings
- Complete audit log access

### 👨‍⚕️ Doctor
- Patient record management
- DDI analysis and clinical decision support
- Report generation
- Limited administrative functions

### 👩‍⚕️ Nurse
- Patient care documentation
- Basic DDI analysis
- Read-only access to patient records
- Limited reporting capabilities

## 🔐 Security Features

- **Authentication**: Secure login system with role-based access
- **Authorization**: Granular permissions based on user roles
- **Audit Trail**: Comprehensive logging of all user actions
- **Data Protection**: Secure handling of sensitive patient information

## 🧪 Testing

The system includes simulation modes for safe testing of:
- Drug interaction scenarios
- Patient management workflows
- User permission testing
- System configuration changes

## 📈 Future Enhancements

- [ ] Integration with external drug databases
- [ ] Real-time notifications for critical interactions
- [ ] Mobile application support
- [ ] API integration for EHR systems
- [ ] Advanced analytics and machine learning
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

## 🙏 Acknowledgments

- Healthcare professionals who provided domain expertise
- Open-source community for the amazing tools and libraries
- React and TypeScript communities for excellent documentation

---

**⚠️ Disclaimer**: This system is designed for educational and demonstration purposes. For production use in healthcare environments, ensure compliance with relevant regulations (HIPAA, FDA, etc.) and conduct thorough testing and validation.
