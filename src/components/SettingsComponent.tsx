// filepath: /abroad/abroad/src/components/Settings.tsx
import React from 'react';
import Embassies from './Embassies';

const SettingsComponent: React.FC = () => {
  return (
    <div>
      <h1>Settings</h1>
      <p>Manage your application settings here.</p>
      {/* Add more settings options as needed */}
      <Embassies />
    </div>
  );
};

export default SettingsComponent;