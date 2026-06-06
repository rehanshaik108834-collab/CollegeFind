import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const colleges = [
  {
    name: 'Indian Institute of Technology Bombay',
    slug: 'iit-bombay',
    location: 'Powai, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'Engineering',
    fees: 220000,
    rating: 4.9,
    established: 1958,
    description: 'IIT Bombay is one of the premier engineering institutions in India, known for its rigorous academic programs and cutting-edge research facilities.',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
    accreditation: 'NAAC A++',
    placements: { avgPackage: 2200000, highestPackage: 25000000, placementRate: 98, topRecruiters: ['Google', 'Microsoft', 'Goldman Sachs', 'McKinsey', 'Apple'] },
    facilities: ['World-class labs', 'Olympic pool', 'Hospital', 'Metro connectivity', 'Research centers'],
    highlights: ['QS World Ranking: 149', 'NIRF Rank: 3', '500+ startups founded', 'Nobel Prize alumni'],
    courses: [
      { name: 'B.Tech Computer Science', degree: 'B.Tech', duration: 4, seats: 120, fees: 220000 },
      { name: 'B.Tech Electrical Engineering', degree: 'B.Tech', duration: 4, seats: 90, fees: 220000 },
      { name: 'M.Tech Data Science', degree: 'M.Tech', duration: 2, seats: 60, fees: 65000 },
      { name: 'MBA', degree: 'MBA', duration: 2, seats: 60, fees: 350000 },
    ],
  },
  {
    name: 'Indian Institute of Technology Delhi',
    slug: 'iit-delhi',
    location: 'Hauz Khas, New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    type: 'Engineering',
    fees: 215000,
    rating: 4.8,
    established: 1961,
    description: 'IIT Delhi is a premier engineering institution located in the heart of India\'s capital, with excellent industry connections and research output.',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800',
    accreditation: 'NAAC A++',
    placements: { avgPackage: 2100000, highestPackage: 22000000, placementRate: 97, topRecruiters: ['Amazon', 'Google', 'DE Shaw', 'Flipkart', 'Microsoft'] },
    facilities: ['State-of-art labs', 'Indoor stadium', 'Health center', 'Metro access', 'Incubation center'],
    highlights: ['QS World Ranking: 185', 'NIRF Rank: 2', '300+ faculty members', 'Top research output'],
    courses: [
      { name: 'B.Tech Computer Science', degree: 'B.Tech', duration: 4, seats: 110, fees: 215000 },
      { name: 'B.Tech Mechanical Engineering', degree: 'B.Tech', duration: 4, seats: 100, fees: 215000 },
      { name: 'M.Tech AI & ML', degree: 'M.Tech', duration: 2, seats: 50, fees: 60000 },
    ],
  },
  {
    name: 'Indian Institute of Technology Madras',
    slug: 'iit-madras',
    location: 'Adyar, Chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    type: 'Engineering',
    fees: 200000,
    rating: 4.9,
    established: 1959,
    description: 'IIT Madras consistently ranked #1 in NIRF, offering exceptional programs across engineering, science, and humanities.',
    image: 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=800',
    accreditation: 'NAAC A++',
    placements: { avgPackage: 2300000, highestPackage: 28000000, placementRate: 99, topRecruiters: ['Google', 'Qualcomm', 'Samsung', 'Intel', 'Uber'] },
    facilities: ['Forest campus', 'Super-computing facility', 'Olympic athletics track', 'Medical center', 'Research parks'],
    highlights: ['NIRF Rank: 1 (5 consecutive years)', 'QS: 227', 'AI Deeptech hub', 'IIT Madras Research Park'],
    courses: [
      { name: 'B.Tech Computer Science', degree: 'B.Tech', duration: 4, seats: 115, fees: 200000 },
      { name: 'B.Tech Chemical Engineering', degree: 'B.Tech', duration: 4, seats: 80, fees: 200000 },
      { name: 'Ph.D Research', degree: 'Ph.D', duration: 5, seats: 200, fees: 30000 },
    ],
  },
  {
    name: 'BITS Pilani',
    slug: 'bits-pilani',
    location: 'Vidya Vihar, Pilani',
    city: 'Pilani',
    state: 'Rajasthan',
    type: 'Engineering',
    fees: 580000,
    rating: 4.7,
    established: 1964,
    description: 'BITS Pilani is a deemed university known for its practice school program, flexible academic curriculum, and strong alumni network.',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800',
    accreditation: 'NAAC A',
    placements: { avgPackage: 1800000, highestPackage: 18000000, placementRate: 95, topRecruiters: ['Microsoft', 'Goldman Sachs', 'Uber', 'Nutanix', 'Oracle'] },
    facilities: ['Desert campus', 'Medical college', 'Cricket ground', 'Library', 'Practice school'],
    highlights: ['Practice School unique curriculum', 'NIRF Rank: 19', 'Strong silicon valley alumni', 'Dual degree programs'],
    courses: [
      { name: 'B.E. Computer Science', degree: 'B.E.', duration: 4, seats: 200, fees: 580000 },
      { name: 'B.E. Electronics', degree: 'B.E.', duration: 4, seats: 160, fees: 580000 },
      { name: 'M.Sc. Mathematics', degree: 'M.Sc.', duration: 2, seats: 80, fees: 480000 },
    ],
  },
  {
    name: 'National Institute of Technology Trichy',
    slug: 'nit-trichy',
    location: 'Tanjore Main Road, Tiruchirappalli',
    city: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    type: 'Engineering',
    fees: 145000,
    rating: 4.5,
    established: 1964,
    description: 'NIT Trichy is consistently ranked as the top NIT in India, offering exceptional technical education with strong industry ties.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
    accreditation: 'NAAC A++',
    placements: { avgPackage: 1200000, highestPackage: 14000000, placementRate: 93, topRecruiters: ['TCS', 'Infosys', 'L&T', 'Samsung', 'Qualcomm'] },
    facilities: ['River-side campus', 'Sports complex', 'Central library', 'Computing center', 'Hospital'],
    highlights: ['Best NIT NIRF Rank: 7', 'NBA accredited programs', '5000+ student strength', 'Strong core engineering'],
    courses: [
      { name: 'B.Tech Civil Engineering', degree: 'B.Tech', duration: 4, seats: 150, fees: 145000 },
      { name: 'B.Tech Computer Science', degree: 'B.Tech', duration: 4, seats: 120, fees: 145000 },
      { name: 'M.Tech Structural Engineering', degree: 'M.Tech', duration: 2, seats: 40, fees: 50000 },
    ],
  },
  {
    name: 'Vellore Institute of Technology',
    slug: 'vit-vellore',
    location: 'Tiruvalam Road, Vellore',
    city: 'Vellore',
    state: 'Tamil Nadu',
    type: 'Engineering',
    fees: 380000,
    rating: 4.2,
    established: 1984,
    description: 'VIT Vellore is a deemed university known for its state-of-art infrastructure, diverse student population, and strong placement record.',
    image: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800',
    accreditation: 'NAAC A++',
    placements: { avgPackage: 800000, highestPackage: 9000000, placementRate: 89, topRecruiters: ['Wipro', 'TCS', 'Cognizant', 'Amazon', 'Deloitte'] },
    facilities: ['Wi-fi campus', 'Olympic swimming pool', 'Multi-cuisine food court', 'Air-conditioned classrooms', 'Innovation center'],
    highlights: ['NIRF Rank: 11', '20,000+ students', 'International collaborations', 'FFCS flexible timetable'],
    courses: [
      { name: 'B.Tech Computer Science', degree: 'B.Tech', duration: 4, seats: 500, fees: 380000 },
      { name: 'B.Tech Biomedical Engineering', degree: 'B.Tech', duration: 4, seats: 120, fees: 380000 },
      { name: 'MBA', degree: 'MBA', duration: 2, seats: 120, fees: 450000 },
    ],
  },
  {
    name: 'IIM Ahmedabad',
    slug: 'iim-ahmedabad',
    location: 'Vastrapur, Ahmedabad',
    city: 'Ahmedabad',
    state: 'Gujarat',
    type: 'Management',
    fees: 2400000,
    rating: 4.95,
    established: 1961,
    description: 'IIM Ahmedabad is India\'s most prestigious management school and ranks among the best business schools in Asia.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    accreditation: 'AACSB Accredited',
    placements: { avgPackage: 3500000, highestPackage: 85000000, placementRate: 100, topRecruiters: ['BCG', 'McKinsey', 'Bain', 'Goldman Sachs', 'P&G'] },
    facilities: ['Louis Kahn campus', 'Case study library', 'Executive education center', 'Swimming pool', 'IIMA Club'],
    highlights: ['FT Global MBA Rank: 26', 'NIRF Rank: 1 (Management)', 'Case study pedagogy', 'Top consulting recruiters'],
    courses: [
      { name: 'PGP (MBA)', degree: 'MBA', duration: 2, seats: 400, fees: 2400000 },
      { name: 'PGPX (Executive MBA)', degree: 'Executive MBA', duration: 1, seats: 80, fees: 3200000 },
      { name: 'Ph.D Management', degree: 'Ph.D', duration: 4, seats: 20, fees: 100000 },
    ],
  },
  {
    name: 'IIM Bangalore',
    slug: 'iim-bangalore',
    location: 'Bannerghatta Road, Bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    type: 'Management',
    fees: 2300000,
    rating: 4.9,
    established: 1973,
    description: 'IIM Bangalore is located in India\'s tech capital and is known for its strong ties with the startup ecosystem and global corporations.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    accreditation: 'AACSB Accredited',
    placements: { avgPackage: 3200000, highestPackage: 72000000, placementRate: 100, topRecruiters: ['Amazon', 'McKinsey', 'BCG', 'Flipkart', 'Google'] },
    facilities: ['Green campus', 'Sports complex', 'NSRCEL incubator', 'Library', 'Guest house'],
    highlights: ['NIRF Rank: 2 (Management)', 'NSE-IIMB Finance Lab', 'Bangalore tech ecosystem', 'Strong entrepreneurship culture'],
    courses: [
      { name: 'PGP (MBA)', degree: 'MBA', duration: 2, seats: 500, fees: 2300000 },
      { name: 'PGPEM (Weekend MBA)', degree: 'MBA', duration: 3, seats: 60, fees: 1800000 },
    ],
  },
  {
    name: 'AIIMS New Delhi',
    slug: 'aiims-delhi',
    location: 'Ansari Nagar, New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    type: 'Medical',
    fees: 6800,
    rating: 4.95,
    established: 1956,
    description: 'AIIMS Delhi is India\'s premier medical institution, providing world-class medical education and healthcare services.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
    accreditation: 'MCI Recognized',
    placements: { avgPackage: 1500000, highestPackage: 8000000, placementRate: 100, topRecruiters: ['AIIMS hospitals', 'Apollo', 'Fortis', 'Max Healthcare', 'WHO'] },
    facilities: ['2000-bed hospital', 'Trauma center', 'Research labs', 'Library', 'Hostel'],
    highlights: ['NIRF Rank: 1 (Medical)', 'Lowest fees in India', 'Apex trauma center', '10,000+ patients daily'],
    courses: [
      { name: 'MBBS', degree: 'MBBS', duration: 5, seats: 100, fees: 6800 },
      { name: 'M.D. General Medicine', degree: 'M.D.', duration: 3, seats: 30, fees: 10000 },
      { name: 'M.S. Surgery', degree: 'M.S.', duration: 3, seats: 25, fees: 10000 },
    ],
  },
  {
    name: 'Manipal Academy of Higher Education',
    slug: 'manipal-university',
    location: 'Madhav Nagar, Manipal',
    city: 'Manipal',
    state: 'Karnataka',
    type: 'Medical',
    fees: 1500000,
    rating: 4.3,
    established: 1953,
    description: 'Manipal is a well-known deemed university with strong medical, engineering and management programs and a vibrant campus life.',
    image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800',
    accreditation: 'NAAC A++',
    placements: { avgPackage: 900000, highestPackage: 7000000, placementRate: 85, topRecruiters: ['Manipal Hospitals', 'Apollo', 'Fortis', 'TCS', 'Infosys'] },
    facilities: ['University town', 'Kasturba Hospital', 'Beach proximity', 'Sports academy', 'International student support'],
    highlights: ['NIRF Rank: 7 (University)', '28,000+ students', '100+ nationalities', 'Strong alumni network'],
    courses: [
      { name: 'MBBS', degree: 'MBBS', duration: 5, seats: 250, fees: 1500000 },
      { name: 'B.Tech Computer Science', degree: 'B.Tech', duration: 4, seats: 300, fees: 480000 },
      { name: 'MBA', degree: 'MBA', duration: 2, seats: 200, fees: 850000 },
    ],
  },
  {
    name: 'Delhi University (DU)',
    slug: 'delhi-university',
    location: 'North Campus, Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    type: 'Arts & Science',
    fees: 15000,
    rating: 4.4,
    established: 1922,
    description: 'University of Delhi is one of India\'s largest and most prestigious central universities, offering programs across arts, science, commerce, and law.',
    image: 'https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=800',
    accreditation: 'NAAC A++',
    placements: { avgPackage: 600000, highestPackage: 5000000, placementRate: 75, topRecruiters: ['UPSC', 'Big 4', 'Banks', 'Media houses', 'NGOs'] },
    facilities: ['60+ colleges', 'North & South campus', 'Central library', 'Sports complex', 'Arts theater'],
    highlights: ['NIRF Rank: 11 (University)', 'Oldest central university', 'Miranda House #1 college', 'Strong humanities legacy'],
    courses: [
      { name: 'B.A. Economics (Hons)', degree: 'B.A.', duration: 3, seats: 80, fees: 15000 },
      { name: 'B.Sc. Computer Science', degree: 'B.Sc.', duration: 3, seats: 60, fees: 12000 },
      { name: 'LL.B. Law', degree: 'LL.B.', duration: 3, seats: 100, fees: 18000 },
    ],
  },
  {
    name: 'Indian Institute of Science',
    slug: 'iisc-bangalore',
    location: 'CV Raman Road, Bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    type: 'Engineering',
    fees: 35000,
    rating: 4.95,
    established: 1909,
    description: 'IISc is India\'s top research university, globally renowned for scientific research and postgraduate education.',
    image: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800',
    accreditation: 'NAAC A++',
    placements: { avgPackage: 2800000, highestPackage: 50000000, placementRate: 99, topRecruiters: ['Google Brain', 'DeepMind', 'Intel Labs', 'Qualcomm Research', 'ISRO'] },
    facilities: ['400-acre green campus', 'Supercomputer facility', 'Botanical garden', 'Observatory', '30+ research centers'],
    highlights: ['QS Rank: 225', 'NIRF Rank: 1 (Overall)', 'Only Indian QS top-100 research', 'Nobel Prize connections'],
    courses: [
      { name: 'B.Sc. Research', degree: 'B.Sc.', duration: 4, seats: 120, fees: 35000 },
      { name: 'M.Tech Computational Science', degree: 'M.Tech', duration: 2, seats: 40, fees: 35000 },
      { name: 'Ph.D Engineering', degree: 'Ph.D', duration: 5, seats: 500, fees: 35000 },
    ],
  },
  {
    name: 'Jadavpur University',
    slug: 'jadavpur-university',
    location: 'Raja Subodh Chandra Mallick Road, Kolkata',
    city: 'Kolkata',
    state: 'West Bengal',
    type: 'Engineering',
    fees: 12000,
    rating: 4.3,
    established: 1955,
    description: 'Jadavpur University is a premier state university in eastern India, known for its engineering, arts, and science faculties.',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
    accreditation: 'NAAC A',
    placements: { avgPackage: 900000, highestPackage: 8000000, placementRate: 85, topRecruiters: ['TCS', 'Wipro', 'Infosys', 'IBM', 'Cognizant'] },
    facilities: ['Main & Salt Lake campus', 'Research labs', 'Cultural center', 'Library', 'Sports ground'],
    highlights: ['NIRF Rank: 12', 'Lowest fees in India', 'Strong alumni in Silicon Valley', 'Active students union'],
    courses: [
      { name: 'B.E. Computer Science', degree: 'B.E.', duration: 4, seats: 120, fees: 12000 },
      { name: 'B.E. Electronics', degree: 'B.E.', duration: 4, seats: 100, fees: 12000 },
      { name: 'M.A. Comparative Literature', degree: 'M.A.', duration: 2, seats: 40, fees: 8000 },
    ],
  },
  {
    name: 'Christ University',
    slug: 'christ-university',
    location: 'Hosur Road, Bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    type: 'Arts & Science',
    fees: 180000,
    rating: 4.1,
    established: 1969,
    description: 'Christ University is a deemed university known for its holistic education, value-based learning, and strong liberal arts programs.',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800',
    accreditation: 'NAAC A++',
    placements: { avgPackage: 550000, highestPackage: 4500000, placementRate: 80, topRecruiters: ['Big 4', 'HDFC', 'Axis Bank', 'Times Group', 'CCD'] },
    facilities: ['Central campus', 'Chapel', 'Sports complex', 'Media lab', 'Incubation center'],
    highlights: ['NIRF Rank: 24', 'Holistic education approach', 'Strong media programs', '18,000+ students'],
    courses: [
      { name: 'B.Com (Hons)', degree: 'B.Com', duration: 3, seats: 300, fees: 180000 },
      { name: 'B.A. Media Studies', degree: 'B.A.', duration: 3, seats: 120, fees: 160000 },
      { name: 'MBA', degree: 'MBA', duration: 2, seats: 180, fees: 650000 },
    ],
  },
  {
    name: 'Amity University Noida',
    slug: 'amity-university-noida',
    location: 'Sector 125, Noida',
    city: 'Noida',
    state: 'Uttar Pradesh',
    type: 'Engineering',
    fees: 320000,
    rating: 3.9,
    established: 2005,
    description: 'Amity University is a large private university offering diverse programs with modern infrastructure and extensive industry connections.',
    image: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800',
    accreditation: 'NAAC A',
    placements: { avgPackage: 600000, highestPackage: 5000000, placementRate: 78, topRecruiters: ['TCS', 'Infosys', 'Wipro', 'HCL', 'Accenture'] },
    facilities: ['Smart classrooms', 'Innovation hub', 'Food court', 'Sports facilities', 'Hostel'],
    highlights: ['25,000+ students', 'Multiple campuses', 'Industry-linked curriculum', 'International tie-ups'],
    courses: [
      { name: 'B.Tech Computer Science', degree: 'B.Tech', duration: 4, seats: 400, fees: 320000 },
      { name: 'BBA', degree: 'BBA', duration: 3, seats: 200, fees: 250000 },
      { name: 'MBA', degree: 'MBA', duration: 2, seats: 200, fees: 550000 },
    ],
  },
  {
    name: 'SRM Institute of Science and Technology',
    slug: 'srm-university',
    location: 'Kattankulathur, Chengalpattu',
    city: 'Chennai',
    state: 'Tamil Nadu',
    type: 'Engineering',
    fees: 340000,
    rating: 4.0,
    established: 1985,
    description: 'SRM is a large private deemed university known for its engineering programs and research initiatives.',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800',
    accreditation: 'NAAC A++',
    placements: { avgPackage: 720000, highestPackage: 7000000, placementRate: 82, topRecruiters: ['Amazon', 'TCS', 'Wipro', 'Zoho', 'Infosys'] },
    facilities: ['700-acre campus', 'Hospital', 'Research park', 'Stadium', 'Multiple hostels'],
    highlights: ['NIRF Rank: 31', '50,000+ students', 'Strong research output', 'International collaborations'],
    courses: [
      { name: 'B.Tech Computer Science', degree: 'B.Tech', duration: 4, seats: 600, fees: 340000 },
      { name: 'B.Tech AI & ML', degree: 'B.Tech', duration: 4, seats: 240, fees: 380000 },
      { name: 'M.Tech Software Engineering', degree: 'M.Tech', duration: 2, seats: 80, fees: 200000 },
    ],
  },
  {
    name: 'Symbiosis International University',
    slug: 'symbiosis-pune',
    location: 'Lavale, Pune',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'Management',
    fees: 820000,
    rating: 4.2,
    established: 2002,
    description: 'Symbiosis is a multi-disciplinary deemed university known for its management, law, and design programs.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    accreditation: 'NAAC A',
    placements: { avgPackage: 1100000, highestPackage: 9000000, placementRate: 91, topRecruiters: ['Amazon', 'Deloitte', 'KPMG', 'Bosch', 'L\'Oreal'] },
    facilities: ['Hill-top campus', 'International student center', 'Sports facilities', 'Medical center', 'Cafeteria'],
    highlights: ['NIRF Rank: 19', '30,000+ students', 'International diversity', 'SNAP entrance'],
    courses: [
      { name: 'MBA', degree: 'MBA', duration: 2, seats: 180, fees: 820000 },
      { name: 'BBA', degree: 'BBA', duration: 3, seats: 200, fees: 480000 },
      { name: 'B.A. LLB', degree: 'B.A. LLB', duration: 5, seats: 120, fees: 550000 },
    ],
  },
  {
    name: 'Pune University (SPPU)',
    slug: 'pune-university',
    location: 'Ganeshkhind Road, Pune',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'Arts & Science',
    fees: 28000,
    rating: 4.0,
    established: 1948,
    description: 'Savitribai Phule Pune University is one of Maharashtra\'s largest universities with a vast network of affiliated colleges.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
    accreditation: 'NAAC A',
    placements: { avgPackage: 500000, highestPackage: 4000000, placementRate: 72, topRecruiters: ['Infosys', 'TCS', 'Wipro', 'HDFC', 'L&T'] },
    facilities: ['500-acre campus', 'Botanical garden', 'Cultural center', 'Gym', 'Library'],
    highlights: ['NIRF Rank: 44', '600+ affiliated colleges', 'Strong research', 'Cultural diversity'],
    courses: [
      { name: 'B.E. Computer Engineering', degree: 'B.E.', duration: 4, seats: 150, fees: 28000 },
      { name: 'B.Sc. IT', degree: 'B.Sc.', duration: 3, seats: 100, fees: 22000 },
      { name: 'M.B.A.', degree: 'MBA', duration: 2, seats: 80, fees: 75000 },
    ],
  },
  {
    name: 'Osmania University',
    slug: 'osmania-university',
    location: 'Amberpet, Hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    type: 'Arts & Science',
    fees: 22000,
    rating: 3.9,
    established: 1918,
    description: 'Osmania University is one of the oldest and most prestigious universities in south-central India, known for arts and science programs.',
    image: 'https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=800',
    accreditation: 'NAAC A',
    placements: { avgPackage: 450000, highestPackage: 3500000, placementRate: 68, topRecruiters: ['TCS', 'Infosys', 'State government', 'Banks', 'DRDO'] },
    facilities: ['Heritage buildings', 'Museum', 'Sports', 'Library', 'Research centers'],
    highlights: ['NIRF Rank: 52', 'Historical campus', 'Strong alumni in government', '200+ affiliated colleges'],
    courses: [
      { name: 'B.E. Civil Engineering', degree: 'B.E.', duration: 4, seats: 120, fees: 22000 },
      { name: 'B.A. Political Science', degree: 'B.A.', duration: 3, seats: 80, fees: 15000 },
      { name: 'M.Sc. Chemistry', degree: 'M.Sc.', duration: 2, seats: 50, fees: 18000 },
    ],
  },
];

const reviewTemplates = [
  { comment: 'Excellent faculty and world-class infrastructure. The placements are outstanding.', rating: 5, year: 2023 },
  { comment: 'Great learning environment with abundant research opportunities and industry exposure.', rating: 4.5, year: 2023 },
  { comment: 'The campus life is vibrant and the peer learning environment is exceptional.', rating: 4, year: 2022 },
  { comment: 'Fees are high but the ROI is definitely worth it given the placement packages.', rating: 4, year: 2022 },
  { comment: 'Faculty is knowledgeable but workload can be intense. Good for serious students.', rating: 3.5, year: 2023 },
];

const authorNames = ['Rahul Sharma', 'Priya Nair', 'Amit Singh', 'Sneha Reddy', 'Arjun Mehta', 'Pooja Iyer', 'Vikram Patel'];

// ──── Predictor cutoff data ────

interface CutoffEntry {
  slug: string;
  exam: string;
  categories: { category: string; openingRank: number; closingRank: number }[];
}

const cutoffData: CutoffEntry[] = [
  // JEE Engineering Colleges
  {
    slug: 'iit-bombay', exam: 'JEE',
    categories: [
      { category: 'General', openingRank: 1, closingRank: 1200 },
      { category: 'OBC', openingRank: 1, closingRank: 2000 },
      { category: 'SC', openingRank: 1, closingRank: 5000 },
      { category: 'ST', openingRank: 1, closingRank: 8000 },
      { category: 'EWS', openingRank: 1, closingRank: 1800 },
    ],
  },
  {
    slug: 'iit-delhi', exam: 'JEE',
    categories: [
      { category: 'General', openingRank: 100, closingRank: 2500 },
      { category: 'OBC', openingRank: 100, closingRank: 4000 },
      { category: 'SC', openingRank: 100, closingRank: 7000 },
      { category: 'ST', openingRank: 100, closingRank: 12000 },
      { category: 'EWS', openingRank: 100, closingRank: 3500 },
    ],
  },
  {
    slug: 'iit-madras', exam: 'JEE',
    categories: [
      { category: 'General', openingRank: 50, closingRank: 2000 },
      { category: 'OBC', openingRank: 50, closingRank: 3500 },
      { category: 'SC', openingRank: 50, closingRank: 6500 },
      { category: 'ST', openingRank: 50, closingRank: 10000 },
      { category: 'EWS', openingRank: 50, closingRank: 3000 },
    ],
  },
  {
    slug: 'bits-pilani', exam: 'JEE',
    categories: [
      { category: 'General', openingRank: 500, closingRank: 8000 },
      { category: 'OBC', openingRank: 500, closingRank: 12000 },
      { category: 'SC', openingRank: 500, closingRank: 18000 },
      { category: 'ST', openingRank: 500, closingRank: 25000 },
      { category: 'EWS', openingRank: 500, closingRank: 10000 },
    ],
  },
  {
    slug: 'nit-trichy', exam: 'JEE',
    categories: [
      { category: 'General', openingRank: 3000, closingRank: 12000 },
      { category: 'OBC', openingRank: 3000, closingRank: 18000 },
      { category: 'SC', openingRank: 3000, closingRank: 30000 },
      { category: 'ST', openingRank: 3000, closingRank: 45000 },
      { category: 'EWS', openingRank: 3000, closingRank: 15000 },
    ],
  },
  {
    slug: 'vit-vellore', exam: 'JEE',
    categories: [
      { category: 'General', openingRank: 5000, closingRank: 50000 },
      { category: 'OBC', openingRank: 5000, closingRank: 65000 },
      { category: 'SC', openingRank: 5000, closingRank: 80000 },
      { category: 'ST', openingRank: 5000, closingRank: 100000 },
      { category: 'EWS', openingRank: 5000, closingRank: 60000 },
    ],
  },
  {
    slug: 'iisc-bangalore', exam: 'JEE',
    categories: [
      { category: 'General', openingRank: 10, closingRank: 800 },
      { category: 'OBC', openingRank: 10, closingRank: 1500 },
      { category: 'SC', openingRank: 10, closingRank: 4000 },
      { category: 'ST', openingRank: 10, closingRank: 6000 },
      { category: 'EWS', openingRank: 10, closingRank: 1200 },
    ],
  },
  {
    slug: 'jadavpur-university', exam: 'JEE',
    categories: [
      { category: 'General', openingRank: 8000, closingRank: 25000 },
      { category: 'OBC', openingRank: 8000, closingRank: 35000 },
      { category: 'SC', openingRank: 8000, closingRank: 50000 },
      { category: 'ST', openingRank: 8000, closingRank: 70000 },
      { category: 'EWS', openingRank: 8000, closingRank: 30000 },
    ],
  },
  {
    slug: 'amity-university-noida', exam: 'JEE',
    categories: [
      { category: 'General', openingRank: 20000, closingRank: 80000 },
      { category: 'OBC', openingRank: 20000, closingRank: 100000 },
      { category: 'SC', openingRank: 20000, closingRank: 120000 },
      { category: 'ST', openingRank: 20000, closingRank: 150000 },
      { category: 'EWS', openingRank: 20000, closingRank: 90000 },
    ],
  },
  {
    slug: 'srm-university', exam: 'JEE',
    categories: [
      { category: 'General', openingRank: 10000, closingRank: 60000 },
      { category: 'OBC', openingRank: 10000, closingRank: 75000 },
      { category: 'SC', openingRank: 10000, closingRank: 90000 },
      { category: 'ST', openingRank: 10000, closingRank: 110000 },
      { category: 'EWS', openingRank: 10000, closingRank: 70000 },
    ],
  },
  {
    slug: 'pune-university', exam: 'JEE',
    categories: [
      { category: 'General', openingRank: 15000, closingRank: 55000 },
      { category: 'OBC', openingRank: 15000, closingRank: 70000 },
      { category: 'SC', openingRank: 15000, closingRank: 85000 },
      { category: 'ST', openingRank: 15000, closingRank: 100000 },
      { category: 'EWS', openingRank: 15000, closingRank: 65000 },
    ],
  },
  {
    slug: 'osmania-university', exam: 'JEE',
    categories: [
      { category: 'General', openingRank: 18000, closingRank: 65000 },
      { category: 'OBC', openingRank: 18000, closingRank: 80000 },
      { category: 'SC', openingRank: 18000, closingRank: 95000 },
      { category: 'ST', openingRank: 18000, closingRank: 120000 },
      { category: 'EWS', openingRank: 18000, closingRank: 75000 },
    ],
  },
  // NEET Medical Colleges
  {
    slug: 'aiims-delhi', exam: 'NEET',
    categories: [
      { category: 'General', openingRank: 1, closingRank: 100 },
      { category: 'OBC', openingRank: 1, closingRank: 250 },
      { category: 'SC', openingRank: 1, closingRank: 1500 },
      { category: 'ST', openingRank: 1, closingRank: 3000 },
      { category: 'EWS', openingRank: 1, closingRank: 200 },
    ],
  },
  {
    slug: 'manipal-university', exam: 'NEET',
    categories: [
      { category: 'General', openingRank: 5000, closingRank: 30000 },
      { category: 'OBC', openingRank: 5000, closingRank: 45000 },
      { category: 'SC', openingRank: 5000, closingRank: 60000 },
      { category: 'ST', openingRank: 5000, closingRank: 80000 },
      { category: 'EWS', openingRank: 5000, closingRank: 40000 },
    ],
  },
];

// ──── Sample discussion threads ────
const sampleThreads = [
  {
    title: 'How to prepare for JEE Advanced in the last 3 months?',
    body: 'I have my JEE Advanced coming up in 3 months. Currently scoring around 150/360 in mock tests. What should be my strategy to improve? Which topics should I focus on for maximum score gain?',
    category: 'Exams',
    answers: [
      { body: 'Focus on your strong subjects first. In Physics, revise Mechanics and Electrodynamics thoroughly. In Maths, Calculus and Coordinate Geometry have the highest weightage. For Chemistry, Organic reactions and Periodic properties are must-dos. Do at least 2 mock tests per week.', isAccepted: true },
      { body: 'I was in a similar position last year. What worked for me was solving previous year papers (2015-2023) topic-wise. You\'ll notice patterns in the type of questions asked. Also, don\'t ignore Physical Chemistry - it\'s the easiest to score in.', isAccepted: false },
    ],
  },
  {
    title: 'IIT Bombay vs IIT Delhi for Computer Science?',
    body: 'I have got ranks that can get me CS at both IITs. Which one should I choose? I\'m particularly interested in AI/ML research and startups. Would love to hear from current students or alumni.',
    category: 'Admissions',
    collegeSlug: 'iit-bombay',
    answers: [
      { body: 'IIT Bombay has a stronger startup ecosystem and is arguably better for CS in terms of peer group and coding culture. The placement packages are slightly higher too. However, IIT Delhi has amazing AI/ML labs and Prof. Mausam\'s group is world-renowned.', isAccepted: false },
      { body: 'Both are equally good. Choose based on city preference. Mumbai offers more industry exposure while Delhi has government and policy connections. I chose IITB and have no regrets - the energy here is unmatched.', isAccepted: true },
      { body: 'As an IITD alumni, I\'d say both are excellent. IITD\'s Bharti School of Telecom is great for systems research. But honestly, at this level, your individual effort matters more than the institute name.', isAccepted: false },
    ],
  },
  {
    title: 'Campus life at BITS Pilani — What to expect?',
    body: 'I just got admitted to BITS Pilani for B.E. Computer Science through BITSAT. I\'m excited but also nervous. What\'s the campus life really like? How are the hostels, food, clubs, and overall vibe?',
    category: 'Campus Life',
    collegeSlug: 'bits-pilani',
    answers: [
      { body: 'Congrats! BITS Pilani has one of the most vibrant campus lives in India. The fest culture is amazing - OASIS and APOGEE are legendary. Hostels are decent, food is okay (you\'ll get used to it). The best part is the freedom - no attendance, flexible timetable, and amazing clubs.', isAccepted: true },
      { body: 'The Practice School program is unique to BITS and it\'s incredible for industry exposure. You\'ll get to work at top companies for 6 months. The Pilani campus is in the desert so summers are hot, but winters are pleasant. Make sure to join at least 2-3 clubs!', isAccepted: false },
    ],
  },
  {
    title: 'NEET preparation strategy for Biology?',
    body: 'I\'m scoring well in Physics and Chemistry but struggling in Biology. My NEET is in 6 months. How should I approach NCERT for Biology? Any specific chapters that are high-yield?',
    category: 'Exams',
    answers: [
      { body: 'Biology in NEET is 90% NCERT. Read NCERT line by line, literally. Focus on: Human Physiology (especially Digestion, Excretion, Nervous System), Genetics (Mendelian and Molecular), Ecology, and Plant Physiology. These chapters alone can give you 250+ marks in Biology.', isAccepted: true },
      { body: 'Make diagrams for every chapter. Visual memory helps a lot in Biology. Also, solve MTG and Disha publications for extra practice. For Botany, focus on Plant Kingdom and Morphology of Flowering Plants.', isAccepted: false },
    ],
  },
  {
    title: 'Placement stats reality check — Are packages inflated?',
    body: 'I see colleges advertising 1 Crore+ packages but I\'m skeptical. How much do average students actually earn after graduation? I\'m looking at NITs specifically. Would appreciate honest answers from recent graduates.',
    category: 'Placements',
    collegeSlug: 'nit-trichy',
    answers: [
      { body: 'Great question. The "highest package" numbers often include international offers (converted to INR), stock options, and signing bonuses. The median package is a better metric. For NIT Trichy CS, the median is around 14-16 LPA which is still excellent. Non-CS branches see 8-12 LPA median.', isAccepted: false },
      { body: 'As a 2023 NIT Trichy graduate, here\'s the reality: top 10% get 20+ LPA, middle 50% get 10-18 LPA, and bottom 30% get 6-10 LPA. Your package depends heavily on your skills, not just the college name. Focus on DSA, projects, and internships.', isAccepted: true },
    ],
  },
  {
    title: 'Is it worth taking a drop year for JEE?',
    body: 'I scored 89 percentile in JEE Mains this year. I have an option to join VIT Vellore or take a drop and try again. My parents are supportive either way. What would you advise?',
    category: 'General',
    answers: [
      { body: 'It depends on your potential. If you genuinely feel you underperformed and can improve significantly, a drop year can be worth it. But be honest with yourself - many students score the same or even lower after a drop. VIT is a solid college with good placements.', isAccepted: false },
      { body: 'I took a drop and improved from 88 to 99.2 percentile. The key was joining a proper coaching and being disciplined. However, I\'ve also seen friends who didn\'t improve. My advice: if you have a clear strategy and strong discipline, go for it. Otherwise, VIT is great.', isAccepted: false },
    ],
  },
];

async function main() {
  console.log('🌱 Starting seed...');

  // Clear all data in correct order
  await prisma.answerVote.deleteMany();
  await prisma.threadVote.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.thread.deleteMany();
  await prisma.predictorCutoff.deleteMany();
  await prisma.savedCollege.deleteMany();
  await prisma.review.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Create colleges
  const collegeMap: Record<string, string> = {};

  for (const collegeData of colleges) {
    const { courses, ...data } = collegeData;

    const college = await prisma.college.create({
      data: {
        ...data,
        courses: {
          create: courses,
        },
        reviews: {
          create: reviewTemplates.slice(0, 3).map((r, i) => ({
            ...r,
            author: authorNames[i % authorNames.length],
          })),
        },
      },
    });

    collegeMap[college.slug] = college.id;
    console.log(`✅ Created: ${college.name}`);
  }

  // Create demo user
  const bcrypt = require('bcrypt');
  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@college.in',
      name: 'Demo User',
      passwordHash: await bcrypt.hash('demo1234', 10),
    },
  });

  console.log('👤 Created demo user: demo@college.in / demo1234');

  // Create additional users for discussions
  const user2 = await prisma.user.create({
    data: {
      email: 'rahul@example.com',
      name: 'Rahul Sharma',
      passwordHash: await bcrypt.hash('pass1234', 10),
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'priya@example.com',
      name: 'Priya Nair',
      passwordHash: await bcrypt.hash('pass1234', 10),
    },
  });

  const discussionUsers = [demoUser, user2, user3];

  // Seed predictor cutoffs
  for (const entry of cutoffData) {
    const collegeId = collegeMap[entry.slug];
    if (!collegeId) {
      console.log(`⚠️  Skipping cutoff for ${entry.slug} — college not found`);
      continue;
    }

    for (const cat of entry.categories) {
      await prisma.predictorCutoff.create({
        data: {
          exam: entry.exam,
          category: cat.category,
          openingRank: cat.openingRank,
          closingRank: cat.closingRank,
          collegeId,
          year: 2024,
        },
      });
    }
    console.log(`📊 Cutoff seeded: ${entry.slug} (${entry.exam})`);
  }

  // Seed discussion threads
  for (let i = 0; i < sampleThreads.length; i++) {
    const threadData = sampleThreads[i];
    const author = discussionUsers[i % discussionUsers.length];
    const collegeId = threadData.collegeSlug ? collegeMap[threadData.collegeSlug] : null;

    const thread = await prisma.thread.create({
      data: {
        title: threadData.title,
        body: threadData.body,
        category: threadData.category,
        authorId: author.id,
        collegeId: collegeId || undefined,
        upvotes: Math.floor(Math.random() * 25) + 3,
        views: Math.floor(Math.random() * 200) + 20,
      },
    });

    // Create answers
    for (let j = 0; j < threadData.answers.length; j++) {
      const answerData = threadData.answers[j];
      const answerAuthor = discussionUsers[(i + j + 1) % discussionUsers.length];
      await prisma.answer.create({
        data: {
          body: answerData.body,
          threadId: thread.id,
          authorId: answerAuthor.id,
          isAccepted: answerData.isAccepted,
          upvotes: answerData.isAccepted ? Math.floor(Math.random() * 15) + 5 : Math.floor(Math.random() * 10),
        },
      });
    }

    console.log(`💬 Thread seeded: ${threadData.title.substring(0, 50)}...`);
  }

  console.log(`✨ Seed complete! ${colleges.length} colleges, ${cutoffData.length} cutoff sets, ${sampleThreads.length} threads created.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
