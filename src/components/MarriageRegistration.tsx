import React from 'react';

const MarriageRegistration: React.FC = () => {
    return (
        <div>
            <h1>Marriage Registration</h1>
            <form>
                <div>
                    <label htmlFor="husbandName">Husband's Name:</label>
                    <input type="text" id="husbandName" name="husbandName" required />
                </div>
                <div>
                    <label htmlFor="wifeName">Wife's Name:</label>
                    <input type="text" id="wifeName" name="wifeName" required />
                </div>
                <div>
                    <label htmlFor="marriageDate">Marriage Date:</label>
                    <input type="date" id="marriageDate" name="marriageDate" required />
                </div>
                <div>
                    <label htmlFor="location">Location:</label>
                    <input type="text" id="location" name="location" required />
                </div>
                <button type="submit">Register Marriage</button>
            </form>
        </div>
    );
};

export default MarriageRegistration;