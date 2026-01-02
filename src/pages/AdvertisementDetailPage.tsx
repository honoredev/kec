import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  ArrowLeft,
  MapPin,
  Calendar,
  Phone,
  Mail,
  ExternalLink,
  Building2,
  Clock,
  CheckCircle,
  Share2,
  Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import NewsSidebar from "@/components/NewsSidebar";

const API_URL = import.meta.env.VITE_API_URL || 'https://kec-backend-1.onrender.com/api';
const API_BASE = API_URL.replace('/api', '');

interface Advertisement {
  id: number;
  title: string;
  fullDescription: string;
  company: string;
  category: string;
  imageUrl?: string;
  location: string;
  deadline?: string;
  views: number;
  applicants: number;
  contactPhone?: string;
  contactEmail?: string;
  contactWebsite?: string;
  contactAddress?: string;
  requirements?: string;
  benefits?: string;
  createdAt: string;
}

const AdvertisementDetailPage = () => {
  const { id } = useParams();
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch advertisement from API
    fetch(`${API_URL}/advertisements/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setAd(data.data);
        }
      })
      .catch(err => console.error('Failed to load advertisement:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Advertisement not found</h2>
          <Link to="/advertisements" className="text-orange-600 hover:text-orange-700">
            Back to advertisements
          </Link>
        </div>
      </div>
    );
  }

  // Get image URL helper
  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) {
      return 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=500&fit=crop';
    }
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `${API_BASE}${imageUrl}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link to="/advertisements" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Subira ku matangazo</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Header Image */}
              <div className="relative h-80 overflow-hidden">
                <img
                  src={getImageUrl(ad.imageUrl)}
                  alt={ad.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=500&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    {ad.title}
                  </h1>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Company Info */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{ad.company}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {ad.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {ad.createdAt ? new Date(ad.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{ad.views || 0}</div>
                    <div className="text-sm text-gray-600">Abantu barabye</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{ad.applicants || 0}</div>
                    <div className="text-sm text-gray-600">Biyandikishije</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="text-sm text-gray-600">{ad.deadline ? new Date(ad.deadline).toLocaleDateString() : 'N/A'}</div>
                  </div>
                </div>

                {/* Full Description */}
                <div className="prose prose-lg max-w-none mb-8">
                  {ad.fullDescription ? (
                    <div dangerouslySetInnerHTML={{ __html: ad.fullDescription }} />
                  ) : (
                    <p className="text-gray-700">No description available</p>
                  )}
                </div>

                {/* Requirements */}
                {ad.requirements && (
                  <div className="bg-blue-50 rounded-xl p-6 mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                      Ibyasabwa
                    </h3>
                    {typeof ad.requirements === 'string' ? (
                      <div className="text-gray-700 whitespace-pre-line">{ad.requirements}</div>
                    ) : Array.isArray(ad.requirements) && ad.requirements.length > 0 ? (
                      <ul className="space-y-2">
                        {ad.requirements.map((req: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{req}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                )}

                {/* Benefits */}
                {ad.benefits && (
                  <div className="bg-green-50 rounded-xl p-6 mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      Inyungu
                    </h3>
                    {typeof ad.benefits === 'string' ? (
                      <div className="text-gray-700 whitespace-pre-line">{ad.benefits}</div>
                    ) : Array.isArray(ad.benefits) && ad.benefits.length > 0 ? (
                      <ul className="space-y-2">
                        {ad.benefits.map((benefit: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                )}

                {/* Share */}
                <div className="border-t pt-6">
                  <div className="flex items-center gap-3">
                    <Button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white">
                      <Share2 className="w-4 h-4 mr-2" />
                      Sangiza
                    </Button>
                    <Button className="bg-gray-200 hover:bg-gray-300 text-gray-700">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-4"
            >
              <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-6 py-4">
                <h2 className="text-white font-bold text-xl">Amakuru yo Kuvugana</h2>
              </div>

              <div className="p-6 space-y-4">
                {/* Phone */}
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Phone className="w-4 h-4" />
                    <span className="font-semibold">Telefone</span>
                  </div>
                  <a 
                    href={`tel:${ad.contactPhone}`}
                    className="text-orange-600 hover:text-orange-700 font-semibold"
                  >
                    {ad.contactPhone || 'N/A'}
                  </a>
                </div>

                {/* Email */}
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Mail className="w-4 h-4" />
                    <span className="font-semibold">Email</span>
                  </div>
                  <a 
                    href={`mailto:${ad.contactEmail}`}
                    className="text-orange-600 hover:text-orange-700 font-semibold break-all"
                  >
                    {ad.contactEmail || 'N/A'}
                  </a>
                </div>

                {/* Website */}
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <ExternalLink className="w-4 h-4" />
                    <span className="font-semibold">Website</span>
                  </div>
                  {ad.contactWebsite ? (
                    <a 
                      href={`https://${ad.contactWebsite}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:text-orange-700 font-semibold break-all"
                    >
                      {ad.contactWebsite}
                    </a>
                  ) : (
                    <span className="text-gray-500">N/A</span>
                  )}
                </div>

                {/* Address */}
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="font-semibold">Aderesi</span>
                  </div>
                  <p className="text-gray-700">{ad.contactAddress || ad.location || 'N/A'}</p>
                </div>

                {/* Deadline */}
                <div className="bg-red-50 rounded-lg p-4 mt-6">
                  <div className="flex items-center gap-2 text-red-600 mb-2">
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold">Itariki ntarengwa</span>
                  </div>
                  <p className="text-2xl font-bold text-red-600">{ad.deadline ? new Date(ad.deadline).toLocaleDateString() : 'N/A'}</p>
                </div>

                {/* Apply Button */}
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg py-6 mt-6">
                  Iyandikishe Ubu
                </Button>
              </div>
            </motion.div>

            {/* Latest News & Ads Sidebar */}
            <div className="mt-6">
              <NewsSidebar />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AdvertisementDetailPage;
