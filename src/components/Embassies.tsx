import { useState, useEffect } from "react";
import axios from "axios";
import { MapPin, Phone, Mail } from "lucide-react";

// Interface Segregation Principle: Define specific interfaces
interface ContactInformation {
  address: string;
  phone: string;
  email: string;
}

interface EmbassyLocation {
  country: string;
  city: string;
  location_coordinates: string;
}

interface WorkingHours {
  working_hours: string;
}

interface Embassy extends ContactInformation, EmbassyLocation, WorkingHours {
  embassy_id: number;
  embassy_name: string;
}

// Single Responsibility Principle: Separate data fetching into a service
const embassyService = {
  fetchEmbassies: async (): Promise<Embassy[]> => {
    const response = await axios.get<Embassy[]>("YOUR_API_ENDPOINT_HERE");
    return response.data;
  },
};

// Single Responsibility Principle: Custom hook for data management
const useEmbassies = () => {
  const [embassies, setEmbassies] = useState<Embassy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEmbassies = async () => {
      try {
        const data = await embassyService.fetchEmbassies();
        setEmbassies(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadEmbassies();
  }, []);

  return { embassies, loading, error };
};

// Open/Closed Principle: Reusable ContactInfo component can be extended without modification
const ContactInfo = ({ icon: Icon, value }: { icon: React.ElementType; value: string }) => (
  <div className="flex items-center mt-1">
    <Icon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
    <p className="text-sm text-gray-700 dark:text-gray-300">{value}</p>
  </div>
);

// Single Responsibility Principle: Dedicated component for embassy cards
const EmbassyCard = ({ embassy }: { embassy: Embassy }) => (
  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
    <h2 className="text-lg font-semibold mb-2">{embassy.embassy_name}</h2>
    <p className="text-gray-600 dark:text-gray-300">
      {embassy.country}, {embassy.city}
    </p>
    
    <ContactInfo icon={MapPin} value={embassy.address} />
    <ContactInfo icon={Phone} value={embassy.phone} />
    <ContactInfo icon={Mail} value={embassy.email} />
    
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
      Working Hours: {embassy.working_hours}
    </p>
  </div>
);

// Main component focused on composition
const Embassies = () => {
  const { embassies, loading, error } = useEmbassies();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Embassies</h1>
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : (
        <EmbassyGrid embassies={embassies} />
      )}
    </div>
  );
};

// Dedicated presentation components
const LoadingState = () => <div className="p-4">Loading embassies...</div>;

const ErrorState = ({ error }: { error: string }) => (
  <div className="p-4 text-red-500">Error: {error}</div>
);

const EmbassyGrid = ({ embassies }: { embassies: Embassy[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {embassies.map((embassy) => (
      <EmbassyCard key={embassy.embassy_id} embassy={embassy} />
    ))}
  </div>
);

export default Embassies;