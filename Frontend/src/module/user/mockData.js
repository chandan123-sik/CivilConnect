// ─── CivilConnect Client Panel — Mock Data ───────────────────────────────────

// 7 Service Categories (admin-defined)
// 7 Service Categories (admin-defined) with Sub-categories logic
export const mockCategories = [
  { 
    id: 'contractor', label: 'Contractor', icon: '🏗️', color: '#F5F3FF', accent: '#7C3AED',
    subCategories: [
      { id: 'civil', label: 'Civil Contractor' },
      { id: 'interior', label: 'Interior Contractor' },
      { id: 'road', label: 'Road Contractor' },
      { id: 'electrical_c', label: 'Electrical Contractor' }
    ]
  },
  { 
    id: 'engineer', label: 'Engineer', icon: '⚙️', color: '#F5F3FF', accent: '#8B5CF6',
    subCategories: [
      { id: 'structural', label: 'Structural Engineer' },
      { id: 'site_eng', label: 'Site Engineer' },
      { id: 'civil_eng', label: 'Civil Engineer' }
    ]
  },
  { 
    id: 'architect', label: 'Architect', icon: '📐', color: '#F5F3FF', accent: '#A78BFA',
    subCategories: [
      { id: 'residential', label: 'Residential Architect' },
      { id: 'commercial', label: 'Commercial Architect' },
      { id: 'landscape', label: 'Landscape Designer' }
    ]
  },
  { 
    id: 'plumber', label: 'Plumber', icon: '🔧', color: '#F5F3FF', accent: '#C4B5FD',
    subCategories: [
      { id: 'fitting', label: 'Pipe Fitting' },
      { id: 'maintenance', label: 'Repairs & Maintenance' }
    ]
  },
  { 
    id: 'electrician', label: 'Electrician', icon: '⚡', color: '#F5F3FF', accent: '#8B5CF6',
    subCategories: [
      { id: 'wiring', label: 'Full Wiring' },
      { id: 'solar', label: 'Solar Installation' }
    ]
  },
  { 
    id: 'labour', label: 'Labour', icon: '👷', color: '#F5F3FF', accent: '#7C3AED',
    subCategories: [
      { id: 'skilled', label: 'Skilled Mason' },
      { id: 'unskilled', label: 'Helpers/Unskilled' }
    ]
  },
  { 
    id: 'vehicle', label: 'Vehicle Provider', icon: '🚛', color: '#F5F3FF', accent: '#A78BFA',
    subCategories: [
      { id: 'tipper', label: 'Dumper/Tipper' },
      { id: 'crane', label: 'Crane Services' },
      { id: 'jcb', label: 'Excavators/JCB' }
    ]
  },
];

// 12 Mock Providers (Updated with sub-categories)
export const mockProviders = [
  {
    id: 'p1', categoryId: 'contractor', subCategoryId: 'civil',
    name: 'Ramesh Sharma', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
    role: 'General Contractor', experience: 12, location: 'Pune, MH',
    skills: ['Civil Work', 'RCC', 'Flooring'],
    pricing: '₹1200/day', pricingNote: 'Project-based pricing available',
    availability: 'available', rating: 4.8,
    bio: 'Experienced contractor with 12+ years in residential and commercial construction. Specialize in complete civil construction and project management.',
    portfolio: [
      { id: 'pp1', image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&q=80', desc: '3BHK construction in Kothrud, Pune' },
      { id: 'pp2', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80', desc: 'Commercial office building, Wakad' },
    ],
  },
  {
    id: 'p2', categoryId: 'contractor', subCategoryId: 'interior',
    name: 'Suresh Patil', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    role: 'Interior Contractor', experience: 8, location: 'Mumbai, MH',
    skills: ['Tiling', 'Painting', 'POP Work'],
    pricing: '₹900/day', pricingNote: 'Includes materials on request',
    availability: 'busy', rating: 4.5,
    bio: 'Interior finishing specialist. Completed 200+ residential interiors across Mumbai and Pune.',
    portfolio: [
      { id: 'pp4', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80', desc: 'Full home interior finish, Andheri' },
    ],
  },
  {
    id: 'p3', categoryId: 'engineer', subCategoryId: 'structural',
    name: 'Anjali Mehta', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    role: 'Civil Engineer', experience: 6, location: 'Nagpur, MH',
    skills: ['Structural Design', 'AutoCAD', 'Site Supervision'],
    pricing: '₹2500/visit', pricingNote: 'Monthly retainer available',
    availability: 'available', rating: 4.9,
    bio: 'Civil engineer with expertise in structural design and site supervision for residential projects.',
    portfolio: [
      { id: 'pp6', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=80', desc: 'Structural design - G+2 building' },
    ],
  },
  {
    id: 'p4', categoryId: 'architect', subCategoryId: 'residential',
    name: 'Priya Desai', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    role: 'Architect', experience: 9, location: 'Pune, MH',
    skills: ['3D Design', 'SketchUp', 'Vastu Planning'],
    pricing: '₹15,000/project', pricingNote: 'Per project basis',
    availability: 'available', rating: 4.7,
    bio: 'Creative architect blending modern aesthetics with vastu principles for residential and commercial spaces.',
    portfolio: [
      { id: 'pp7', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80', desc: 'Modern villa design, Baner Pune' },
    ],
  },
  {
    id: 'p5', categoryId: 'plumber', subCategoryId: 'fitting',
    name: 'Manoj Yadav', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    role: 'Plumbing Expert', experience: 10, location: 'Nashik, MH',
    skills: ['Pipe Fitting', 'Drainage', 'Sanitation'],
    pricing: '₹600/day', pricingNote: 'Emergency service +₹200',
    availability: 'available', rating: 4.6,
    bio: 'Certified plumber with 10 years of experience in residential and industrial plumbing solutions.',
    portfolio: [
      { id: 'pp9', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', desc: 'Full bathroom plumbing setup' },
    ],
  },
  {
    id: 'p6', categoryId: 'electrician', subCategoryId: 'wiring',
    name: 'Raju Waghmare', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    role: 'Electrical Contractor', experience: 7, location: 'Pune, MH',
    skills: ['Wiring', 'Panel Setup', 'Solar Fitting'],
    pricing: '₹700/day', pricingNote: 'Material cost extra',
    availability: 'available', rating: 4.3,
    bio: 'Licensed electrician specializing in full home wiring, solar panel installation and panel setup.',
    portfolio: [
      { id: 'pp10', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80', desc: 'Solar panel installation, Hinjewadi' },
    ],
  },
  {
    id: 'p7', categoryId: 'labour', subCategoryId: 'skilled',
    name: 'Vijay Kamble', avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80',
    role: 'General Labour', experience: 5, location: 'Pune, MH',
    skills: ['Masonry', 'Concrete', 'Excavation'],
    pricing: '₹450/day', pricingNote: 'Group of 5 available',
    availability: 'available', rating: 4.0,
    bio: 'Skilled mason and labour team leader. Available with a group of 4 additional workers.',
    portfolio: [],
  },
  {
    id: 'p8', categoryId: 'vehicle', subCategoryId: 'tipper',
    name: 'Santosh Bhosale', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
    role: 'Transport Provider', experience: 4, location: 'Mumbai, MH',
    skills: ['Heavy Transport', 'Material Delivery', 'Crane Op.'],
    pricing: '₹3500/trip', pricingNote: 'Loading/unloading included',
    availability: 'busy', rating: 4.1,
    bio: 'Provides trucks, tippers and cranes for construction material transport across Maharashtra.',
    portfolio: [],
  },
];

// 15 Mock Materials (view-only)
export const mockMaterials = [
  { id: 'm1', name: 'Cement (OPC 53 Grade)', image: 'https://images.unsplash.com/photo-1517646272422-94420349666f?w=400&q=80', price: '₹420', unit: 'per bag (50kg)', category: 'Basic' },
  { id: 'm2', name: 'TMT Steel Rods (12mm)', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80', price: '₹58/kg', unit: 'per kg', category: 'Steel' },
  { id: 'm3', name: 'Premium Red Bricks', image: 'https://images.unsplash.com/photo-1590069230002-70cc8a49c958?w=400&q=80', price: '₹9', unit: 'per piece', category: 'Masonry' },
  { id: 'm4', name: 'Coarse River Sand', image: 'https://images.unsplash.com/photo-1589939705384-5185138a19af?w=400&q=80', price: '₹55/cft', unit: 'per cft', category: 'Basic' },
  { id: 'm5', name: 'Crushed Metal (20mm)', image: 'https://images.unsplash.com/photo-1576409890483-37651c6b1a3e?w=400&q=80', price: '₹48/cft', unit: 'per cft', category: 'Basic' },
  { id: 'm6', name: 'Lightweight AAC Blocks', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80', price: '₹45', unit: 'per block', category: 'Masonry' },
  { id: 'm7', name: 'White Portland Cement', image: 'https://images.unsplash.com/photo-1589308454676-928ca94896eb?w=400&q=80', price: '₹22/kg', unit: 'per kg', category: 'Basic' },
  { id: 'm8', name: 'CPVC Water Pipes', image: 'https://images.unsplash.com/photo-1542013936693-884638332954?w=400&q=80', price: '₹310', unit: 'per length', category: 'Plumbing' },
  { id: 'm9', name: 'Flame Retardant Wire', image: 'https://images.unsplash.com/photo-1558444479-27519c3d228c?w=400&q=80', price: '₹1450', unit: 'per 90m bundle', category: 'Electrical' },
  { id: 'm10', name: 'Anti-skid Floor Tiles', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=80', price: '₹42/sqft', unit: 'per sqft', category: 'Flooring' },
  { id: 'm11', name: 'Double Charge Vitrified', image: 'https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=400&q=80', price: '₹65/sqft', unit: 'per sqft', category: 'Flooring' },
  { id: 'm12', name: 'Exterior Emulsion (Top)', image: 'https://images.unsplash.com/photo-1562591176-7ec93c403328?w=400&q=80', price: '₹3200', unit: 'per 20L', category: 'Finishing' },
  { id: 'm13', name: 'Corrugated GI Sheets', image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&q=80', price: '₹920', unit: 'per sheet', category: 'Steel' },
  { id: 'm14', name: 'Gurjan Marine Plywood', image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400&q=80', price: '₹1850', unit: 'per sheet', category: 'Wood' },
  { id: 'm15', name: 'Rapid SBR Waterproof', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80', price: '₹450', unit: 'per 5L', category: 'Finishing' },
];
