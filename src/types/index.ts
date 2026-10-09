export type CategoryId = 
  | 'all'
  | 'seeds'
  | 'seedlings'
  | 'crops'
  | 'livestock'
  | 'aquaculture'
  | 'engineering'
  | 'fertilizers_protection';

export interface MarketItem {
  id: string;
  title: string;
  category: CategoryId;
  categoryName: string;
  subcategory: string;
  price: number;
  currency: string;
  unit: string;
  stock: number;
  location: string;
  region: string;
  sellerName: string;
  sellerPhone: string;
  sellerType: 'farmer' | 'breeder' | 'vendor' | 'nursery';
  rating: number;
  reviewsCount: number;
  badge?: string;
  description: string;
  specs: { [key: string]: string };
  isHalalLivestock?: boolean;
  featured?: boolean;
  iconName: string;
}

export interface CartItem {
  product: MarketItem;
  quantity: number;
}

export interface Specialist {
  id: string;
  name: string;
  title: string;
  discipline: 'veterinary' | 'agronomy' | 'aquaculture' | 'engineering';
  experienceYears: number;
  rating: number;
  consultationsCount: number;
  availableDays: string;
  feePerConsultation: number;
  avatarInitials: string;
  specialties: string[];
}

export interface ClinicDirectoryItem {
  id: string;
  name: string;
  type: 'veterinary' | 'agricultural' | 'lab';
  typeName: string;
  region: string;
  city: string;
  address: string;
  phone: string;
  mobile?: string;
  whatsapp: string;
  workingHours: string;
  services: string[];
  rating: number;
  reviewsCount: number;
  verified: boolean;
  lat: number;
  lng: number;
  notes?: string;
}

export interface ScientificArticle {
  id: string;
  title: string;
  category: 'agri_engineering' | 'livestock_best_practices' | 'aquaculture' | 'modern_farming' | 'pest_control';
  categoryName: string;
  authorName: string;
  authorTitle: string;
  readTimeMinutes: number;
  publishDate: string;
  summary: string;
  contentSections: {
    subtitle: string;
    body: string;
    keyTakeaways?: string[];
  }[];
  tags: string[];
}

export interface MarketRate {
  id: string;
  name: string;
  category: string;
  currentPrice: number;
  unit: string;
  changePercent: number;
  high24h: number;
  low24h: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

export interface PriceAlert {
  id: string;
  commodityName: string;
  targetPrice: number;
  condition: 'above' | 'below';
  currentPrice: number;
  userPhone: string;
  active: boolean;
  createdAt: string;
}

export interface WeatherAlert {
  id: string;
  title: string;
  region: string;
  severity: 'warning' | 'alert' | 'notice';
  weatherType: 'rain' | 'frost' | 'heatwave' | 'dust_wind';
  period: string;
  tempRange: string;
  expectedRainMm?: number;
  windSpeedKmh?: number;
  farmAdvice: string[];
  livestockAdvice: string[];
  aquacultureAdvice: string[];
}

export interface ConsultationBooking {
  id: string;
  clientName: string;
  clientPhone: string;
  specialistId: string;
  specialistName: string;
  consultationType: 'field_visit' | 'video_call' | 'written_report';
  farmLocation: string;
  problemSummary: string;
  scheduledDate: string;
  status: 'confirmed' | 'pending';
}

export interface FarmerDiaryTask {
  id: string;
  title: string;
  sector: 'crops' | 'livestock' | 'aquaculture' | 'engineering' | 'general';
  category: 'irrigation' | 'fertilization' | 'vaccination' | 'pest_control' | 'feeding' | 'harvest' | 'maintenance';
  targetName: string;
  dueDate: string;
  timeSlot?: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  completedAt?: string;
  notes: string;
  cost?: number; // in USD
}

// ==========================================
// إدارة ميزانية المحاصيل والمشاريع الزراعية
// ==========================================

export type BudgetCostCategory = 
  | 'seeds_seedlings'
  | 'fertilizers'
  | 'pest_control'
  | 'irrigation_energy'
  | 'labor'
  | 'feed_veterinary'
  | 'machinery_rent'
  | 'packaging_logistics'
  | 'other';

export interface BudgetItem {
  id: string;
  category: BudgetCostCategory;
  categoryName: string;
  description: string;
  plannedCost: number; // in USD
  actualCost: number;  // in USD
  status: 'planned' | 'paid' | 'pending';
  date: string;
}

export interface CropRevenueItem {
  id: string;
  productName: string;
  quantitySold: number;
  unit: string;
  pricePerUnit: number; // in USD
  totalRevenue: number; // in USD
  buyerName: string;
  saleDate: string;
  paymentStatus: 'received' | 'partial' | 'pending';
}

export interface CropSeasonBudget {
  id: string;
  seasonName: string; // e.g. "موسم القمح الشتوي 2026", "عروة الطماطم المحمية"
  cropOrSector: string;
  areaOrUnits: string;
  countryRegion: string;
  startDate: string;
  harvestOrEndDate: string;
  targetYield: string;
  costItems: BudgetItem[];
  revenueItems: CropRevenueItem[];
}

// ==========================================
// نماذج التسجيل المتوافقة مع الاختصاصات
// ==========================================

export interface AgronomyFieldRecord {
  id: string;
  cropName: string;
  variety: string;
  fieldPlot: string;
  areaSize: number;
  areaUnit: 'هكتار' | 'فدان' | 'دونم';
  irrigationType: 'drip' | 'pivot' | 'sprinkler' | 'flood';
  plantingDate: string;
  expectedHarvestDate: string;
  soilType: string;
  targetYieldTon: number;
  country: string;
  notes: string;
}

export interface LivestockHerdRecord {
  id: string;
  animalType: 'sheep' | 'cattle' | 'camel' | 'goat' | 'poultry';
  breed: string;
  headCount: number;
  purpose: 'meat_fattening' | 'dairy' | 'breeding';
  barnIdentifier: string;
  intakeDate: string;
  currentAvgWeightKg: number;
  targetWeightKg: number;
  vaccinationScheduleStatus: string;
  dailyFeedRationKg: number;
  country: string;
  notes: string;
}

export interface AquaculturePondRecord {
  id: string;
  pondIdentifier: string;
  fishSpecies: 'tilapia' | 'seabream' | 'seabass' | 'carp' | 'shrimp';
  pondVolumeM3: number;
  fingerlingCount: number;
  stockingDate: string;
  avgWeightGrams: number;
  targetHarvestWeightGrams: number;
  dissolvedOxygenMgL: number;
  phLevel: number;
  fcrRatio: number;
  expectedBiomassKg: number;
  country: string;
  notes: string;
}

export interface LabAnalysisRecord {
  id: string;
  sampleType: 'soil' | 'well_water' | 'feed' | 'plant_tissue';
  sampleCode: string;
  sourceLocation: string;
  collectionDate: string;
  ecSalinity: number; // dS/m
  phLevel: number;
  suitabilityStatus: 'ممتازة' | 'صالحة مع معالجة' | 'مرتفعة الملوحة' | 'غير صالحة';
  recommendations: string;
  country: string;
}

