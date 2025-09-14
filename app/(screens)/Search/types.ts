export interface SearchResult {
    id: string;
    title: string;
    type: string;
    description: string;
    rating?: number;
    reviews?: number;
    price?: number;
    instructor?: string;
    members?: number;
    comments?: number;
    author?: string;
    image: string;
  }
  
  export interface FilterState {
    type: string;
    sort: string;
    price: string;
    rating: string;
    freeOnly: boolean;
  }
  
  export const colorPalette = {
    primaryBlue: "#007AFF",
    secondaryPurple: "#5856D6",
    textBlack: "#000000",
    backgroundGray: "#F2F2F7",
    cardWhite: "#FFFFFF",
    borderLightGray: "#C6C6C8",
    textSecondaryGray: "#8E8E93",
    errorRed: "#FF3B30",
    successGreen: "#34C759",
  };
  
  export const FILTER_OPTIONS = {
    type: [
      { label: "جميع الأنواع", value: "all" },
      { label: "كورسات", value: "course" },
      { label: "مجموعات", value: "group" },
      { label: "مناقشات", value: "discussion" },
    ],
    sort: [
      { label: "الأكثر صلة", value: "relevance" },
      { label: "الأعلى تقييماً", value: "rating" },
      { label: "الأحدث", value: "newest" },
      { label: "السعر من الأقل للأعلى", value: "price_low" },
      { label: "السعر من الأعلى للأقل", value: "price_high" },
    ],
    price: [
      { label: "أي سعر", value: "any" },
      { label: "مجاني", value: "free" },
      { label: "مدفوع", value: "paid" },
    ],
    rating: [
      { label: "أي تقييم", value: "any" },
      { label: "4 نجوم وأكثر", value: "4" },
      { label: "3 نجوم وأكثر", value: "3" },
    ],
  };
  
  export const MOCK_SEARCH_RESULTS = [
    {
      id: "1",
      title: "مقدمة في البرمجة",
      type: "course",
      description: "دورة تعليمية للمبتدئين في عالم البرمجة",
      rating: 4.8,
      reviews: 125,
      price: 99,
      instructor: "أحمد محمد",
      image: "https://placehold.co/400x200/007AFF/white?text=Programming+Course",
    },
    // ... other mock data
  ];