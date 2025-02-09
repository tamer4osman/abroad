// filepath: /abroad/abroad/src/components/BirthRegistration.tsx
import React from 'react';

const BirthRegistration: React.FC = () => {
  return (
    <div>
      <h1>Birth Registration</h1>
      <form>
        <div>
          <label htmlFor="childName">Child's Name:</label>
          <input type="text" id="childName" name="childName" required />
        </div>
        <div>
          <label htmlFor="dateOfBirth">Date of Birth:</label>
          <input type="date" id="dateOfBirth" name="dateOfBirth" required />
        </div>
        <div>
          <label htmlFor="parentsNames">Parents' Names:</label>
          <input type="text" id="parentsNames" name="parentsNames" required />
        </div>
        <button type="submit">Register Birth</button>
      </form>
    </div>
  );
};

export default BirthRegistration;