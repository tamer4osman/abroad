import { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Globe, X, Plus } from "lucide-react";

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

// Mock data to use while no API is available
const MOCK_EMBASSIES: Embassy[] = [
  {
    embassy_id: 1,
    embassy_name: "السفارة الليبية في الولايات المتحدة",
    country: "الولايات المتحدة",
    city: "واشنطن",
    address: "1460 Dahlia St NW, Washington, DC 20012",
    phone: "+1 202-555-0123",
    email: "contact@libyaembassy-usa.gov.ly",
    location_coordinates: "38.9897,-77.0353",
    working_hours: "الإثنين - الجمعة: 9:00 - 16:00"
  },
  {
    embassy_id: 2,
    embassy_name: "السفارة الليبية في المملكة المتحدة",
    country: "المملكة المتحدة",
    city: "لندن",
    address: "15 Knightsbridge, London SW1X 7LY",
    phone: "+44 20-7589-6120",
    email: "info@libyanembassy.org.uk",
    location_coordinates: "51.5074,-0.1278",
    working_hours: "الإثنين - الجمعة: 10:00 - 15:00"
  },
  {
    embassy_id: 3,
    embassy_name: "السفارة الليبية في فرنسا",
    country: "فرنسا",
    city: "باريس",
    address: "6-8 Rue Chasseloup Laubat, 75015 Paris",
    phone: "+33 1-4567-3400",
    email: "contact@ambalibyeparis.fr",
    location_coordinates: "48.8566,2.3522",
    working_hours: "الإثنين - الجمعة: 9:30 - 15:30"
  },
  {
    embassy_id: 4,
    embassy_name: "السفارة الليبية في مصر",
    country: "مصر",
    city: "القاهرة",
    address: "7 شارع عبد الرحمن فهمي، جاردن سيتي، القاهرة",
    phone: "+20 2-2792-7904",
    email: "info@libyaembassycairo.org",
    location_coordinates: "30.0444,31.2357",
    working_hours: "الأحد - الخميس: 8:30 - 14:30"
  },
  {
    embassy_id: 5,
    embassy_name: "السفارة الليبية في الإمارات",
    country: "الإمارات العربية المتحدة",
    city: "أبو ظبي",
    address: "شارع الكرامة، فيلا 47، أبو ظبي",
    phone: "+971 2-446-5200",
    email: "info@libya-embassy.ae",
    location_coordinates: "24.4539,54.3773",
    working_hours: "الأحد - الخميس: 9:00 - 15:00"
  },
  {
    embassy_id: 6,
    embassy_name: "السفارة الليبية في تونس",
    country: "تونس",
    city: "تونس",
    address: "15 نهج البرازيل، تونس 1002",
    phone: "+216 71-830-642",
    email: "contact@ambassadelibya-tn.org",
    location_coordinates: "36.8065,10.1815",
    working_hours: "الإثنين - الجمعة: 8:30 - 14:30"
  }
];

// Modal component for adding a new embassy
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (embassy: Omit<Embassy, "embassy_id">) => void;
}

const AddEmbassyModal: React.FC<ModalProps> = ({ isOpen, onClose, onSave }) => {
  const [newEmbassy, setNewEmbassy] = useState<Omit<Embassy, "embassy_id">>({
    embassy_name: "",
    country: "",
    city: "",
    address: "",
    phone: "",
    email: "",
    location_coordinates: "",
    working_hours: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEmbassy(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(newEmbassy);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">إضافة سفارة جديدة</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                اسم السفارة
              </label>
              <input
                type="text"
                name="embassy_name"
                value={newEmbassy.embassy_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                البلد
              </label>
              <input
                type="text"
                name="country"
                value={newEmbassy.country}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                المدينة
              </label>
              <input
                type="text"
                name="city"
                value={newEmbassy.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                العنوان
              </label>
              <input
                type="text"
                name="address"
                value={newEmbassy.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                رقم الهاتف
              </label>
              <input
                type="tel"
                name="phone"
                value={newEmbassy.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                name="email"
                value={newEmbassy.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                الإحداثيات الجغرافية
              </label>
              <input
                type="text"
                name="location_coordinates"
                value={newEmbassy.location_coordinates}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="مثال: 38.9897,-77.0353"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ساعات العمل
              </label>
              <input
                type="text"
                name="working_hours"
                value={newEmbassy.working_hours}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="مثال: الإثنين - الجمعة: 9:00 - 16:00"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 space-x-reverse pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-700 flex items-center"
            >
              <Plus className="h-4 w-4 ml-2" />
              إضافة السفارة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Single Responsibility Principle: Custom hook for data management
const useEmbassies = () => {
  const [embassies, setEmbassies] = useState<Embassy[]>(MOCK_EMBASSIES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate API loading for UI demonstration
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Simulate network delay and random error possibility
    const timer = setTimeout(() => {
      // Simulate occasional error (10% chance)
      if (Math.random() < 0.1) {
        setError("فشل في الاتصال بالخادم. يرجى المحاولة مرة أخرى.");
      } else {
        setEmbassies(MOCK_EMBASSIES);
      }
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const addEmbassy = (newEmbassy: Omit<Embassy, "embassy_id">) => {
    // Generate a new ID based on the current highest ID + 1
    const newId = Math.max(...embassies.map(e => e.embassy_id)) + 1;
    const embassyWithId = { ...newEmbassy, embassy_id: newId };
    
    setEmbassies(prevEmbassies => [...prevEmbassies, embassyWithId]);
    
    // In a real application, we would also make an API call to save the embassy
    return embassyWithId;
  };

  return { embassies, loading, error, addEmbassy };
};

// Open/Closed Principle: Reusable ContactInfo component can be extended without modification
const ContactInfo = ({ icon: Icon, value }: { icon: React.ElementType; value: string }) => (
  <div className="flex items-center mt-1">
    <Icon className="h-4 w-4 ml-2 text-gray-500 dark:text-gray-400" />
    <p className="text-sm text-gray-700 dark:text-gray-300">{value}</p>
  </div>
);

// Single Responsibility Principle: Dedicated component for embassy cards
const EmbassyCard = ({ embassy }: { embassy: Embassy }) => (
  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
    <h2 className="text-lg font-semibold mb-2">{embassy.embassy_name}</h2>
    <p className="text-gray-600 dark:text-gray-300">
      {embassy.country}، {embassy.city}
    </p>
    
    <div className="mt-3">
      <ContactInfo icon={MapPin} value={embassy.address} />
      <ContactInfo icon={Phone} value={embassy.phone} />
      <ContactInfo icon={Mail} value={embassy.email} />
    </div>
    
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
      ساعات العمل: {embassy.working_hours}
    </p>
  </div>
);

// Embassy management controls
const EmbassyControls = ({ onAddClick }: { onAddClick: () => void }) => (
  <div className="flex justify-between items-center mb-5">
    <div className="flex space-x-2">
      <button 
        onClick={onAddClick}
        className="px-3 py-1.5 bg-red-800 text-white rounded-md hover:bg-red-700 transition flex items-center"
      >
        <Globe className="h-4 w-4 ml-2" />
        <span>إضافة سفارة جديدة</span>
      </button>
    </div>
    <div>
      <input
        type="text"
        placeholder="بحث في السفارات..."
        className="px-3 py-1.5 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />
    </div>
  </div>
);

// Main component focused on composition
const Embassies = () => {
  const { embassies, loading, error, addEmbassy } = useEmbassies();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddEmbassy = (embassy: Omit<Embassy, "embassy_id">) => {
    addEmbassy(embassy);
    setIsModalOpen(false);
    // In a real app, you might show a success message here
  };

  return (
    <div className="container mx-auto">
      <EmbassyControls onAddClick={() => setIsModalOpen(true)} />
      
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : (
        <EmbassyGrid embassies={embassies} />
      )}
      
      <AddEmbassyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddEmbassy}
      />
    </div>
  );
};

// Dedicated presentation components
const LoadingState = () => (
  <div className="p-4 text-center">
    <div className="animate-spin h-8 w-8 border-4 border-red-800 border-t-transparent rounded-full mx-auto"></div>
    <p className="mt-2 text-gray-600 dark:text-gray-400">جاري تحميل بيانات السفارات...</p>
  </div>
);

const ErrorState = ({ error }: { error: string }) => (
  <div className="p-4 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
    <p className="font-bold">حدث خطأ:</p>
    <p>{error}</p>
  </div>
);

const EmbassyGrid = ({ embassies }: { embassies: Embassy[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {embassies.map((embassy) => (
      <EmbassyCard key={embassy.embassy_id} embassy={embassy} />
    ))}
  </div>
);

export default Embassies;