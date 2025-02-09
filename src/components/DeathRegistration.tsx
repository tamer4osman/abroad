// filepath: /abroad/src/components/DeathRegistration.tsx
import React from 'react';

const DeathRegistration: React.FC = () => {
    return (
        <div>
            <h1>Death Registration</h1>
            <form>
                <div>
                    <label htmlFor="deceasedName">Name of Deceased:</label>
                    <input type="text" id="deceasedName" name="deceasedName" required />
                </div>
                <div>
                    <label htmlFor="dateOfDeath">Date of Death:</label>
                    <input type="date" id="dateOfDeath" name="dateOfDeath" required />
                </div>
                <div>
                    <label htmlFor="placeOfDeath">Place of Death:</label>
                    <input type="text" id="placeOfDeath" name="placeOfDeath" required />
                </div>
                <div>
                    <label htmlFor="registeredBy">Registered By:</label>
                    <input type="text" id="registeredBy" name="registeredBy" required />
                </div>
                <button type="submit">Register Death</button>
            </form>
        </div>
    );
};

export default DeathRegistration;