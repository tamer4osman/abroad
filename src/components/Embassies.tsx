import { useState, useEffect } from "react";
import axios from "axios";
import { MapPin, Phone, Mail } from "lucide-react";

interface Embassy {
  embassy_id: number;
  embassy_name: string;
  country: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  working_hours: string;
  location_coordinates: string;
}

const Embassies = () => {
  const [embassies, setEmbassies] = useState<Embassy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmbassies = async () => {
      try {
        const response = await axios.get<Embassy[]>("YOUR_API_ENDPOINT_HERE"); // Replace with your actual API endpoint
        setEmbassies(response.data);
        setLoading(false);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchEmbassies();
  }, []);

  if (loading) {
    return <div className="p-4">Loading embassies...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Embassies</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {embassies.map((embassy) => (
          <div
            key={embassy.embassy_id}
            className="bg-white dark:bg-gray-800 shadow rounded-lg p-4"
          >
            <h2 className="text-lg font-semibold mb-2">
              {embassy.embassy_name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {embassy.country}, {embassy.city}
            </p>
            <div className="flex items-center mt-2">
              <MapPin className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {embassy.address}
              </p>
            </div>
            <div className="flex items-center mt-1">
              <Phone className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {embassy.phone}
              </p>
            </div>
            <div className="flex items-center mt-1">
              <Mail className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {embassy.email}
              </p>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Working Hours: {embassy.working_hours}
            </p>
            {/* You can add a link to a map using location_coordinates if it's in a suitable format */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Embassies;
