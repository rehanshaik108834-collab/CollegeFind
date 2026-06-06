export interface College {
  id: string;
  name: string;
  slug: string;
  location: string;
  city: string;
  state: string;
  type: string;
  fees: number;
  rating: number;
  established: number;
  description: string;
  image: string;
  accreditation: string;
  website?: string;
  phone?: string;
  placements: Placements;
  facilities: string[];
  highlights: string[];
  courses?: Course[];
  reviews?: Review[];
  _count?: { savedBy: number; reviews?: number };
}

export interface Placements {
  avgPackage: number;
  highestPackage: number;
  placementRate: number;
  topRecruiters: string[];
}

export interface Course {
  id: string;
  name: string;
  degree: string;
  duration: number;
  seats: number;
  fees: number;
  collegeId: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  author: string;
  year: number;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface CollegesResponse {
  data: College[];
  meta: PaginationMeta;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface FiltersData {
  states: string[];
  types: string[];
  feesRange: { min: number; max: number };
}

export interface CollegeQuery {
  search?: string;
  state?: string;
  type?: string;
  minFees?: number;
  maxFees?: number;
  minRating?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// ──── Predictor ────

export interface PredictorResult {
  college: College;
  matchLevel: 'Excellent' | 'Good' | 'Possible';
  score: number;
  openingRank: number;
  closingRank: number;
  exam: string;
  category: string;
  year: number;
}

// ──── Discussions ────

export interface ThreadAuthor {
  id: string;
  name: string;
}

export interface ThreadCollege {
  id: string;
  name: string;
  slug: string;
}

export interface DiscussionThread {
  id: string;
  title: string;
  body: string;
  category: string;
  upvotes: number;
  views: number;
  college?: ThreadCollege | null;
  collegeId?: string | null;
  author: ThreadAuthor;
  _count: { answers: number };
  hasVoted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DiscussionAnswer {
  id: string;
  body: string;
  upvotes: number;
  isAccepted: boolean;
  author: ThreadAuthor;
  hasVoted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ThreadDetail extends DiscussionThread {
  answers: DiscussionAnswer[];
}

export interface ThreadsResponse {
  data: DiscussionThread[];
  meta: PaginationMeta;
}

export interface ThreadQuery {
  search?: string;
  category?: string;
  sort?: 'newest' | 'votes';
  page?: number;
  limit?: number;
}

