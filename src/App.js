import React, { useState } from 'react';
import DoctorantTable from './components/DoctorantTable';
import ThesesView from './components/ThesesView';
import DashboardView from './components/DashboardView'; // Importer DashboardView
import DocumentsView from './components/DocumentsView';
import AdminNotifications from './components/AdminNotifications';
import DoctorantNotifications from './components/DoctorantNotifications';
import AdminDocuments from './components/AdminDocuments';
import { 
  User, 
  FileText, 
  Bell, 
  BarChart, 
  LogOut 
} from 'lucide-react';

// Mock authentication context (would be replaced with real authentication)
const AuthContext = React.createContext(null);

// Main Application Component
const PhDManagementApp = () => {
  const [user, setUser ] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');

  const handleLogin = (userData) => {
    console.log('Logged in user:', userData); // Check the structure of userData
    console.log('User  role:', userData.user.role);
    setUser (userData.user);
    console.log(user.role);
  };

  const handleLogout = () => {
    setUser (null);
  };

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
      <div className="flex h-screen bg-gray-100">
        {user ? (
          <div className="flex w-full">
            <Sidebar 
              activeView={activeView} 
              setActiveView={setActiveView} 
              handleLogout={handleLogout}
              userRole={user.role} // Pass the user role to the Sidebar
            />
            <MainContent activeView={activeView} user={user} />
          </div>
        ) : (
          <LoginPage onLogin={handleLogin} />
        )}
      </div>
    </AuthContext.Provider>
  );
};
// Sidebar Component
const Sidebar = ({ activeView, setActiveView, handleLogout, userRole }) => {
  const adminMenuItems = [
    { icon: <BarChart />, label: 'Dashboard', view: 'dashboard' },
    { icon: <User  />, label: 'Doctoral Profiles', view: 'profiles' },
    { icon: <FileText />, label: 'Thesis Management', view: 'theses' },
    { icon: <Bell />, label: 'Notifications', view: 'notifications' },
    { icon: <FileText />, label: 'Documents', view: 'documents' },

  ];

  const doctorantMenuItems = [
    { icon: <Bell />, label: 'Notifications', view: 'notifications' },
    { icon: <FileText />, label: 'Documents', view: 'documents' }, // New Documents page
  ];

  const menuItems = userRole === 'admin' ? adminMenuItems : doctorantMenuItems;

  return (
    <div className="w-64 bg-white shadow-md flex flex-col justify-between">
      <div>
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">PhD Manager</h1>
        </div>
        <nav className="mt-4">
          {menuItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setActiveView(item.view)}
              className={`w-full flex items-center p-4 hover:bg-gray-100 ${
                activeView === item.view ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="w-full flex items-center p-4 text-red-500 hover:bg-gray-100"
      >
        <LogOut />
        <span className="ml-3">Logout</span>
      </button>
    </div>
  );
};
// Login Page Component
const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
  
    if (!email.includes('@')) {
      setError('Adresse email invalide.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        onLogin(data); // This should include the user object
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors de la connexion');
      }
    } catch (err) {
      setError('Erreur réseau. Impossible de se connecter au serveur.');
    }
    
  };
  

  return (
    <div className="flex items-center justify-center w-full bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">PhD Management</h2>
          <p className="text-gray-500">Connectez-vous à votre compte</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500">{error}</p>}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md"
              placeholder="you@university.edu"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Connexion
          </button>
        </form>
      </div>
    </div>
  );
};


// Main Content Area Component
const MainContent = ({ activeView, user }) => {
  console.log(user.role);
  const renderView = () => {
    if (user.role === 'admin') {
      switch (activeView) {
        case 'dashboard':
          return <DashboardView />;
        case 'profiles':
          return <DoctorantTable />;
        case 'theses':
          return <ThesesView />;
        case 'notifications':
          return <AdminNotifications />;
        
        case 'documents':
            return <AdminDocuments />;
        default:
          return <DashboardView />;
      }
    } else if (user.role === 'doctorant') {
      switch (activeView) {
        case 'notifications':
          return <DoctorantNotifications user={user}/>;
        case 'documents':
          return <DocumentsView user={user} />;
        default:
          return <DoctorantNotifications user={user} />; // Default view for doctorants
      }
    }
  };

  return (
    <main className="flex-grow p-8 overflow-y-auto bg-gray-100">
      {renderView()}
    </main>
  );
};
// 
// Placeholder components for other views



export default PhDManagementApp;