import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Eye, ExternalLink } from "lucide-react";

const AdDetailPage = () => {
  const { id } = useParams();
  const [ad, setAd] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`https://kec-backend-1.onrender.com/api/ads/${id}`)
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: Ad not found`);
          }
          return res.json();
        })
        .then(data => {
          setAd(data);
        })
        .catch(err => {
          console.error('Error loading ad:', err);
          setError(err.message);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading advertisement...</p>
        </div>
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Advertisement Not Found</h1>
          <p className="text-muted-foreground mb-4">{error || 'The advertisement you are looking for does not exist.'}</p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link to="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Ad Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">{ad.position}</Badge>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{new Date(ad.createdAt).toLocaleDateString()}</span>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{ad.title}</h1>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4 text-muted-foreground">
                
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {ad.impressions || 0} views
                </span>
              </div>
              
              {ad.linkUrl && (
                <Button 
                  onClick={() => window.open(ad.linkUrl, '_blank')}
                  className="gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit Link
                </Button>
              )}
            </div>
          </header>

          {/* Featured Image */}
          {ad.imageUrl && (
            <div className="aspect-video rounded-xl overflow-hidden mb-8">
              <img 
                src={ad.imageUrl} 
                alt={ad.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=500&fit=crop';
                }}
              />
            </div>
          )}

          {/* Ad Content */}
          <div className="bg-white rounded-xl p-8 shadow-sm border">
            <h2 className="text-2xl font-semibold mb-4">About this Advertisement</h2>
            
            {ad.description ? (
              <div className="prose prose-gray max-w-none mb-6">
                <p className="text-lg leading-relaxed">{ad.description}</p>
              </div>
            ) : (
              <p className="text-muted-foreground mb-6">No additional details available for this advertisement.</p>
            )}

            {/* Ad Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
              <div>
                <h3 className="font-semibold mb-2">Advertisement Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Position:</span>
                    <span className="font-medium">{ad.position}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={`font-medium ${ad.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {ad.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span className="font-medium">{new Date(ad.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Performance</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Clicks:</span>
                    <span className="font-medium">{ad.clicks || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Impressions:</span>
                    <span className="font-medium">{ad.impressions || 0}</span>
                  </div>
                  {ad.linkUrl && (
                    <div className="pt-2">
                      <Button 
                        onClick={() => window.open(ad.linkUrl, '_blank')}
                        variant="outline" 
                        size="sm" 
                        className="w-full gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Visit Advertisement Link
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdDetailPage;