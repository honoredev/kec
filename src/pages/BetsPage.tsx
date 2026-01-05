import { useState } from "react";
import { MessageCircle, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BetsPage = () => {
  const navigate = useNavigate();
  const [selectedBet, setSelectedBet] = useState(null);
  const [comment, setComment] = useState("");

  const bets = [
    {
      id: 1,
      title: "Who will win Uganda election?",
      options: [
        { name: "Yoweri Museveni", yesPercent: 78, noPercent: 22, image: "https://i.pravatar.cc/150?img=12" },
        { name: "Bobi Wine", yesPercent: 22, noPercent: 78, image: "https://i.pravatar.cc/150?img=33" }
      ],
      comments: 45,
      volume: "$2.3M"
    },
    {
      id: 2,
      title: "Who releases more models in 2026?",
      options: [
        { name: "Google", yesPercent: 65, noPercent: 35, image: "https://logo.clearbit.com/google.com" },
        { name: "xAI", yesPercent: 35, noPercent: 65, image: "https://logo.clearbit.com/x.ai" }
      ],
      comments: 32,
      volume: "$1.8M"
    },
    {
      id: 3,
      title: "Will Rwanda host AFCON 2027?",
      options: [
        { name: "Yes", yesPercent: 68, noPercent: 32 }
      ],
      comments: 28,
      volume: "$950K"
    },
    {
      id: 4,
      title: "Bitcoin hits $100K in 2024?",
      options: [
        { name: "Yes", yesPercent: 45, noPercent: 55 }
      ],
      comments: 67,
      volume: "$5.2M"
    },
    {
      id: 5,
      title: "APR FC wins league 2024?",
      options: [
        { name: "Yes", yesPercent: 78, noPercent: 22 }
      ],
      comments: 19,
      volume: "$420K"
    }
  ];

  const handleVote = (betId, option, vote) => {
    console.log(`Voted ${vote} on ${option} for bet ${betId}`);
  };

  const handleComment = (betId) => {
    if (comment.trim()) {
      console.log(`Comment on bet ${betId}: ${comment}`);
      setComment("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Prediction Markets</h1>
          <p className="text-gray-600">Join discussions and place your predictions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bets List */}
          <div className="lg:col-span-2 space-y-4">
            {bets.map((bet) => (
              <div key={bet.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded font-bold">LIVE</span>
                      <span className="text-sm text-gray-500">{bet.volume} volume</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">{bet.title}</h2>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-3 mb-4">
                  {bet.options.map((option, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <img src={option.image} alt={option.name} className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                          <span className="font-semibold text-gray-900">{option.name}</span>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-600">{option.yesPercent}% Yes</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVote(bet.id, option.name, 'yes')}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-bold transition-colors"
                        >
                          Yes
                        </button>
                        <span className="text-emerald-600 font-bold text-sm">{option.yesPercent}%</span>
                        <button
                          onClick={() => handleVote(bet.id, option.name, 'no')}
                          className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-lg font-bold transition-colors"
                        >
                          No
                        </button>
                        <span className="text-rose-600 font-bold text-sm">{option.noPercent}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Comments Section */}
                <div className="border-t pt-4">
                  <button
                    onClick={() => setSelectedBet(selectedBet === bet.id ? null : bet.id)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>{bet.comments} comments</span>
                  </button>

                  {selectedBet === bet.id && (
                    <div className="mt-4 space-y-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Add a comment..."
                          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleComment(bet.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
                        >
                          Post
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                              U
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-sm">User123</div>
                              <p className="text-gray-700 text-sm mt-1">Great prediction! I think this will happen.</p>
                              <span className="text-xs text-gray-500 mt-1">2 hours ago</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-lg mb-4">How it works</h3>
              <ol className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="font-bold text-blue-600">1.</span>
                  <span>Choose a prediction market</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-blue-600">2.</span>
                  <span>Vote Yes or No on outcomes</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-blue-600">3.</span>
                  <span>Join discussions in comments</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-blue-600">4.</span>
                  <span>Track market movements</span>
                </li>
              </ol>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-2">Top Traders</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>@trader1</span>
                  <span className="text-green-600 font-bold">+$12.5K</span>
                </div>
                <div className="flex justify-between">
                  <span>@predictor</span>
                  <span className="text-green-600 font-bold">+$8.2K</span>
                </div>
                <div className="flex justify-between">
                  <span>@analyst</span>
                  <span className="text-green-600 font-bold">+$6.7K</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetsPage;
