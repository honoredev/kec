export interface NewsStory {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    bio: string;
  };
  category: string;
  publishedAt: string;
  readTime: string;
  imageUrl?: string;
  videoUrl?: string;
  youtubeUrl?: string;
  audioUrl?: string;
  featured: boolean;
  breaking: boolean;
  trending: boolean;
  views: number;
  likes: number;
  comments: number;
  shareCount: number;
  tags: string[];
  pullQuotes?: string[];
  gallery?: string[];
  location?: string;
  contentType: 'article' | 'video' | 'audio' | 'gallery';
}

export const hardcodedNews: NewsStory[] = [
  {
    id: "rwanda-economy-growth-2024",
    title: "Rwanda's Economy Shows Strong Growth in Q4 2024",
    excerpt: "Rwanda's GDP grew by 8.2% in the fourth quarter, driven by strong performance in services and manufacturing sectors.",
    content: `<p>Rwanda's economy demonstrated remarkable resilience and growth in the fourth quarter of 2024, with GDP expanding by 8.2% year-over-year. This growth was primarily driven by robust performance in the services sector, which grew by 12%, and manufacturing, which expanded by 9.5%.</p>
    
    <blockquote>"This growth reflects our commitment to economic transformation and the success of our Vision 2050 strategy," said Finance Minister Uzziel Ndagijimana.</blockquote>
    
    <p>The services sector, particularly ICT and financial services, continued to be a major driver of economic growth. The manufacturing sector benefited from increased investment in local production and export-oriented industries.</p>`,
    author: {
      name: "Jean Baptiste Uwimana",
      bio: "Economic correspondent covering Rwanda's financial markets and policy developments."
    },
    category: "Economics",
    publishedAt: "2024-12-15T10:00:00Z",
    readTime: "4 min read",
    imageUrl: "/image (1).jpeg",
    featured: true,
    breaking: true,
    trending: true,
    views: 15420,
    likes: 342,
    comments: 89,
    shareCount: 156,
    tags: ["Economy", "GDP", "Growth", "Rwanda"],
    pullQuotes: ["This growth reflects our commitment to economic transformation"],
    location: "Kigali, Rwanda",
    contentType: "article"
  },
  {
    id: "kigali-smart-city-initiative",
    title: "Kigali Launches Smart City Initiative with AI Traffic Management",
    excerpt: "The capital city introduces AI-powered traffic management system as part of its smart city transformation.",
    content: `<p>Kigali has officially launched its smart city initiative with the deployment of an AI-powered traffic management system across major intersections. The system uses machine learning algorithms to optimize traffic flow and reduce congestion.</p>
    
    <p>The initiative includes smart traffic lights, real-time monitoring systems, and mobile apps for citizens to report traffic issues. Early results show a 30% reduction in average commute times during peak hours.</p>`,
    author: {
      name: "Marie Claire Mukamana",
      bio: "Technology reporter specializing in smart city developments and digital transformation."
    },
    category: "Technology",
    publishedAt: "2024-12-14T14:30:00Z",
    readTime: "3 min read",
    imageUrl: "/image (2).jpeg",
    videoUrl: "/videp (1).mp4",
    featured: true,
    breaking: false,
    trending: true,
    views: 8930,
    likes: 234,
    comments: 67,
    shareCount: 123,
    tags: ["Technology", "Smart City", "AI", "Kigali"],
    contentType: "video"
  },
  {
    id: "amavubi-afcon-qualification",
    title: "Amavubi Secures AFCON 2025 Qualification with Victory Over Libya",
    excerpt: "Rwanda's national football team qualifies for AFCON 2025 after a decisive 2-1 victory against Libya in Kigali.",
    content: `<p>The Amavubi Stars have secured their place in the 2025 Africa Cup of Nations after defeating Libya 2-1 at the Amahoro Stadium. Goals from Innocent Nshuti and Djihad Bizimana sealed the historic qualification.</p>
    
    <p>This marks Rwanda's first AFCON qualification since 2004, bringing joy to millions of football fans across the country. The team's journey to qualification has been marked by consistent improvement under coach Torsten Spittler.</p>`,
    author: {
      name: "Patrick Nzeyimana",
      bio: "Sports journalist covering Rwandan football and regional sports developments."
    },
    category: "Sports",
    publishedAt: "2024-12-13T20:15:00Z",
    readTime: "5 min read",
    imageUrl: "/image (3).jpeg",
    featured: true,
    breaking: true,
    trending: true,
    views: 25670,
    likes: 892,
    comments: 234,
    shareCount: 445,
    tags: ["Sports", "Football", "AFCON", "Amavubi"],
    gallery: ["/image (4).jpeg", "/image (5).jpeg", "/image (6).jpeg"],
    contentType: "gallery"
  },
  {
    id: "rwanda-green-energy-milestone",
    title: "Rwanda Achieves 95% Clean Energy Milestone",
    excerpt: "The country reaches a historic milestone with 95% of its electricity now coming from renewable sources.",
    content: `<p>Rwanda has achieved a remarkable milestone in sustainable development, with 95% of its electricity now generated from renewable sources. This achievement positions Rwanda as a global leader in clean energy transition.</p>
    
    <p>The milestone was reached through strategic investments in hydroelectric power, solar energy, and methane gas extraction from Lake Kivu. The government's commitment to environmental sustainability has been a key driver of this success.</p>`,
    author: {
      name: "Esperance Nyirasafari",
      bio: "Environmental correspondent covering sustainability and climate change issues."
    },
    category: "Environment",
    publishedAt: "2024-12-12T09:45:00Z",
    readTime: "4 min read",
    imageUrl: "/image (7).jpeg",
    featured: false,
    breaking: false,
    trending: true,
    views: 12340,
    likes: 456,
    comments: 78,
    shareCount: 234,
    tags: ["Environment", "Clean Energy", "Sustainability"],
    contentType: "article"
  },
  {
    id: "kigali-fashion-week-2024",
    title: "Kigali Fashion Week 2024 Showcases African Creativity",
    excerpt: "Designers from across Africa gather in Kigali to showcase the latest in African fashion and textile innovation.",
    content: `<p>The 2024 Kigali Fashion Week concluded with spectacular shows featuring over 50 designers from 15 African countries. The event highlighted the growing influence of African fashion on the global stage.</p>
    
    <p>This year's theme, "Heritage Meets Innovation," showcased how traditional African textiles and designs are being reimagined for contemporary fashion. The event attracted international buyers and fashion influencers.</p>`,
    author: {
      name: "Grace Uwimana",
      bio: "Fashion and lifestyle journalist covering African fashion trends and cultural events."
    },
    category: "Entertainment",
    publishedAt: "2024-12-11T16:20:00Z",
    readTime: "3 min read",
    imageUrl: "/mtn.jpg",
    featured: false,
    breaking: false,
    trending: false,
    views: 7890,
    likes: 234,
    comments: 45,
    shareCount: 89,
    tags: ["Fashion", "Culture", "Entertainment"],
    contentType: "article"
  },
  {
    id: "rwanda-healthcare-digital-transformation",
    title: "Rwanda's Digital Health Revolution: Telemedicine Reaches Rural Areas",
    excerpt: "New telemedicine program brings specialist healthcare to remote communities across Rwanda.",
    content: `<p>Rwanda's Ministry of Health has launched an ambitious telemedicine program that connects rural health centers with specialist doctors in Kigali. The program uses high-speed internet and video conferencing technology to provide remote consultations.</p>
    
    <p>The initiative has already served over 10,000 patients in its first three months, significantly reducing the need for expensive and time-consuming travel to urban hospitals.</p>`,
    author: {
      name: "Dr. Alice Mukarugwiza",
      bio: "Health correspondent and medical doctor covering healthcare innovations in Rwanda."
    },
    category: "Health",
    publishedAt: "2024-12-10T11:30:00Z",
    readTime: "4 min read",
    imageUrl: "/image (1).jpeg",
    audioUrl: "/videp (2).mp4",
    featured: false,
    breaking: false,
    trending: true,
    views: 9876,
    likes: 345,
    comments: 67,
    shareCount: 123,
    tags: ["Health", "Technology", "Telemedicine"],
    contentType: "audio"
  },
  {
    id: "east-african-trade-summit",
    title: "East African Leaders Discuss Regional Trade Integration",
    excerpt: "Regional leaders meet in Kigali to discuss strengthening trade ties and economic cooperation.",
    content: `<p>Leaders from the East African Community gathered in Kigali for a two-day summit focused on enhancing regional trade integration and economic cooperation. The summit addressed key challenges including infrastructure development and trade barriers.</p>
    
    <blockquote>"Regional integration is crucial for our collective economic growth and prosperity," said President Paul Kagame during the opening ceremony.</blockquote>
    
    <p>Key outcomes include agreements on simplified customs procedures and increased investment in cross-border infrastructure projects.</p>`,
    author: {
      name: "Samuel Nkurunziza",
      bio: "Political correspondent covering regional politics and international relations."
    },
    category: "Politics",
    publishedAt: "2024-12-09T13:15:00Z",
    readTime: "5 min read",
    imageUrl: "/image (2).jpeg",
    featured: false,
    breaking: false,
    trending: false,
    views: 6543,
    likes: 189,
    comments: 34,
    shareCount: 67,
    tags: ["Politics", "Trade", "East Africa"],
    pullQuotes: ["Regional integration is crucial for our collective economic growth"],
    contentType: "article"
  },
  {
    id: "rwanda-coffee-export-record",
    title: "Rwanda Coffee Exports Hit Record High in 2024",
    excerpt: "Premium Rwandan coffee exports reach $150 million, marking the highest earnings in the sector's history.",
    content: `<p>Rwanda's coffee sector achieved record-breaking export earnings of $150 million in 2024, representing a 25% increase from the previous year. The growth is attributed to improved quality, better processing techniques, and expanded market access.</p>
    
    <p>The National Agricultural Export Development Board (NAEB) reports that Rwandan coffee is now sold in over 40 countries, with specialty coffee commanding premium prices in international markets.</p>`,
    author: {
      name: "Emmanuel Hakizimana",
      bio: "Agricultural correspondent covering Rwanda's farming sector and export industries."
    },
    category: "Economics",
    publishedAt: "2024-12-08T08:45:00Z",
    readTime: "3 min read",
    imageUrl: "/image (3).jpeg",
    featured: false,
    breaking: false,
    trending: false,
    views: 5432,
    likes: 156,
    comments: 23,
    shareCount: 45,
    tags: ["Agriculture", "Coffee", "Exports"],
    contentType: "article"
  },
  {
    id: "kigali-tech-hub-expansion",
    title: "Kigali Innovation City Attracts Major Tech Companies",
    excerpt: "Global technology companies establish regional headquarters at Rwanda's premier innovation hub.",
    content: `<p>Kigali Innovation City continues to attract major technology companies, with three new global firms announcing plans to establish their East African headquarters in the facility. The companies include a fintech startup, an e-commerce platform, and a software development firm.</p>
    
    <p>The innovation city now hosts over 150 companies and has created more than 5,000 jobs since its establishment. The facility offers state-of-the-art infrastructure and business support services.</p>`,
    author: {
      name: "Diane Uwimana",
      bio: "Business correspondent covering technology sector developments and startup ecosystem."
    },
    category: "Technology",
    publishedAt: "2024-12-07T15:20:00Z",
    readTime: "4 min read",
    imageUrl: "/image (4).jpeg",
    youtubeUrl: "https://www.youtube.com/watch?v=example",
    featured: false,
    breaking: false,
    trending: true,
    views: 8765,
    likes: 267,
    comments: 56,
    shareCount: 98,
    tags: ["Technology", "Innovation", "Business"],
    contentType: "video"
  },
  {
    id: "rwanda-tourism-recovery",
    title: "Rwanda Tourism Sector Shows Strong Recovery Post-Pandemic",
    excerpt: "Tourist arrivals increase by 40% as Rwanda's tourism sector rebounds with new attractions and improved services.",
    content: `<p>Rwanda's tourism sector is experiencing a remarkable recovery, with tourist arrivals increasing by 40% compared to 2023. The growth is driven by new attractions, improved infrastructure, and successful marketing campaigns.</p>
    
    <p>Key attractions include the newly opened Nyungwe Canopy Walk extension and enhanced gorilla trekking experiences in Volcanoes National Park. The sector now contributes 12% to the country's GDP.</p>`,
    author: {
      name: "Claudine Uwimana",
      bio: "Tourism correspondent covering Rwanda's hospitality industry and cultural attractions."
    },
    category: "Entertainment",
    publishedAt: "2024-12-06T12:10:00Z",
    readTime: "3 min read",
    imageUrl: "/image (5).jpeg",
    featured: false,
    breaking: false,
    trending: false,
    views: 4321,
    likes: 123,
    comments: 34,
    shareCount: 56,
    tags: ["Tourism", "Recovery", "Attractions"],
    contentType: "article"
  },
  {
    id: "rwanda-digital-payment-growth",
    title: "Mobile Money Transactions Surge 60% in Rwanda",
    excerpt: "Digital payment adoption accelerates as mobile money transactions reach $2.8 billion in 2024.",
    content: `<p>Rwanda's digital payment ecosystem has experienced unprecedented growth, with mobile money transactions surging by 60% to reach $2.8 billion in 2024. The growth reflects increasing financial inclusion and digital literacy across the country.</p>`,
    author: {
      name: "Eric Nzeyimana",
      bio: "Fintech correspondent covering digital banking and payment systems in Rwanda."
    },
    category: "Technology",
    publishedAt: "2024-12-16T09:30:00Z",
    readTime: "3 min read",
    imageUrl: "/image (6).jpeg",
    featured: false,
    breaking: true,
    trending: true,
    views: 11250,
    likes: 298,
    comments: 45,
    shareCount: 87,
    tags: ["Fintech", "Mobile Money", "Digital Payments"],
    contentType: "article"
  },
  {
    id: "kigali-green-transport",
    title: "Kigali Introduces Electric Bus Fleet for Public Transport",
    excerpt: "City launches 50 electric buses as part of sustainable urban mobility initiative.",
    content: `<p>Kigali has launched its first fleet of 50 electric buses, marking a significant step towards sustainable urban transportation. The buses will serve major routes across the city, reducing carbon emissions and improving air quality.</p>`,
    author: {
      name: "Josephine Mukamana",
      bio: "Urban development reporter covering transportation and infrastructure projects."
    },
    category: "Environment",
    publishedAt: "2024-12-16T07:15:00Z",
    readTime: "4 min read",
    imageUrl: "/image (7).jpeg",
    featured: false,
    breaking: false,
    trending: true,
    views: 8940,
    likes: 234,
    comments: 56,
    shareCount: 123,
    tags: ["Transport", "Electric Vehicles", "Sustainability"],
    contentType: "article"
  },
  {
    id: "rwanda-youth-entrepreneurship",
    title: "Young Entrepreneurs Drive Rwanda's Innovation Economy",
    excerpt: "Youth-led startups receive $5 million in funding through government innovation programs.",
    content: `<p>Rwanda's youth entrepreneurship ecosystem is thriving, with young entrepreneurs receiving $5 million in funding through various government innovation programs. Over 200 youth-led startups have been supported in 2024.</p>`,
    author: {
      name: "Kevin Uwimana",
      bio: "Startup ecosystem reporter covering entrepreneurship and innovation in Rwanda."
    },
    category: "Economics",
    publishedAt: "2024-12-15T16:45:00Z",
    readTime: "5 min read",
    imageUrl: "/mtn.jpg",
    featured: false,
    breaking: false,
    trending: true,
    views: 7650,
    likes: 189,
    comments: 34,
    shareCount: 78,
    tags: ["Entrepreneurship", "Youth", "Innovation"],
    contentType: "article"
  },
  {
    id: "rwanda-agricultural-tech",
    title: "Smart Farming Technology Boosts Crop Yields by 35%",
    excerpt: "Precision agriculture and IoT sensors help Rwandan farmers increase productivity and reduce waste.",
    content: `<p>Rwandan farmers using smart farming technology have reported a 35% increase in crop yields. The technology includes IoT sensors for soil monitoring, weather prediction systems, and precision irrigation.</p>`,
    author: {
      name: "Agnes Mukamana",
      bio: "Agricultural technology correspondent covering farming innovations and food security."
    },
    category: "Technology",
    publishedAt: "2024-12-15T11:20:00Z",
    readTime: "4 min read",
    imageUrl: "/image (1).jpeg",
    featured: false,
    breaking: false,
    trending: false,
    views: 6780,
    likes: 156,
    comments: 28,
    shareCount: 67,
    tags: ["Agriculture", "Smart Farming", "IoT"],
    contentType: "article"
  },
  {
    id: "rwanda-women-leadership",
    title: "Rwanda Leads Africa in Women's Parliamentary Representation",
    excerpt: "With 61% female MPs, Rwanda maintains its position as global leader in women's political participation.",
    content: `<p>Rwanda continues to lead the world in women's parliamentary representation, with 61% of MPs being women. This achievement reflects the country's commitment to gender equality and inclusive governance.</p>`,
    author: {
      name: "Immaculee Uwimana",
      bio: "Gender and politics correspondent covering women's rights and political participation."
    },
    category: "Politics",
    publishedAt: "2024-12-14T13:30:00Z",
    readTime: "3 min read",
    imageUrl: "/image (2).jpeg",
    featured: false,
    breaking: false,
    trending: true,
    views: 9340,
    likes: 267,
    comments: 45,
    shareCount: 134,
    tags: ["Gender Equality", "Politics", "Leadership"],
    contentType: "article"
  },
  {
    id: "rwanda-cultural-festival",
    title: "Ubusabane Festival Celebrates Rwandan Heritage and Unity",
    excerpt: "Annual cultural festival brings together communities to celebrate traditional music, dance, and crafts.",
    content: `<p>The Ubusabane Festival concluded with spectacular performances showcasing Rwanda's rich cultural heritage. The three-day event featured traditional music, dance, crafts, and cuisine from all provinces.</p>`,
    author: {
      name: "Jean de Dieu Mucyo",
      bio: "Cultural correspondent covering traditional arts, festivals, and heritage preservation."
    },
    category: "Entertainment",
    publishedAt: "2024-12-13T18:00:00Z",
    readTime: "4 min read",
    imageUrl: "/image (3).jpeg",
    featured: false,
    breaking: false,
    trending: false,
    views: 5670,
    likes: 145,
    comments: 23,
    shareCount: 89,
    tags: ["Culture", "Festival", "Heritage"],
    contentType: "article"
  }
];

export const getNewsByCategory = (category: string) => {
  if (category === 'all') return hardcodedNews;
  return hardcodedNews.filter(news => news.category.toLowerCase() === category.toLowerCase());
};

export const getFeaturedNews = () => hardcodedNews.filter(news => news.featured);
export const getBreakingNews = () => hardcodedNews.filter(news => news.breaking);
export const getTrendingNews = () => hardcodedNews.filter(news => news.trending);