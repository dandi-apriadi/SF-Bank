import React, { useState } from 'react';
import { FiYoutube, FiPlay, FiClock, FiEye, FiThumbsUp } from 'react-icons/fi';
import { GiCrossedSwords, GiTrophyCup, GiBookOpen, GiCastle } from 'react-icons/gi';

const YouTube = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState(null);

  const categories = [
    { id: 'all', name: 'All Videos', icon: FiYoutube },
    { id: 'battles', name: 'Epic Battles', icon: GiCrossedSwords },
    { id: 'tutorials', name: 'Tutorials', icon: GiBookOpen },
    { id: 'highlights', name: 'Event Highlights', icon: GiTrophyCup },
    { id: 'kingdom', name: 'Kingdom Tours', icon: GiCastle }
  ];

  const videos = [
    {
      id: 1,
      title: "KvK Season 9 - Epic Final Battle | Sacred3946 Victory",
      description: "Watch our kingdom's triumphant victory in the Season 9 KvK finals. Intense 3-hour battle with strategic gameplay!",
      category: 'battles',
      videoId: 'dQw4w9WgXcQ', // Placeholder YouTube video ID
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600',
      views: "15.2K",
      duration: "18:45",
      uploadedAt: "2 days ago",
      likes: "2.1K"
    },
    {
      id: 2,
      title: "Complete Beginner's Guide to Rise of Kingdoms",
      description: "Everything new players need to know! Commander selection, building optimization, and early game strategies.",
      category: 'tutorials',
      videoId: 'dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600',
      views: "32.5K",
      duration: "25:30",
      uploadedAt: "1 week ago",
      likes: "4.3K"
    },
    {
      id: 3,
      title: "Kingdom Tournament 2024 - All Highlights",
      description: "Best moments from our annual Kingdom Tournament. Amazing plays, strategies, and nail-biting finishes!",
      category: 'highlights',
      videoId: 'dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600',
      views: "8.7K",
      duration: "12:20",
      uploadedAt: "3 days ago",
      likes: "1.5K"
    },
    {
      id: 4,
      title: "Advanced Commander Pairing Guide 2024",
      description: "Deep dive into the best commander combinations for different situations. Meta analysis and tips!",
      category: 'tutorials',
      videoId: 'dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600',
      views: "21.3K",
      duration: "32:15",
      uploadedAt: "5 days ago",
      likes: "3.2K"
    },
    {
      id: 5,
      title: "Sacred3946 Base Tour - Top Players",
      description: "Exclusive tour of our top 10 players' bases. City layouts, troop compositions, and building strategies.",
      category: 'kingdom',
      videoId: 'dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600',
      views: "12.8K",
      duration: "15:40",
      uploadedAt: "1 week ago",
      likes: "2.4K"
    },
    {
      id: 6,
      title: "Alliance War Strategy - How We Won",
      description: "Breakdown of our winning strategy in the latest Alliance War. Coordination, timing, and tactics explained.",
      category: 'battles',
      videoId: 'dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=600',
      views: "19.6K",
      duration: "22:10",
      uploadedAt: "4 days ago",
      likes: "3.8K"
    },
    {
      id: 7,
      title: "Resource Management Tips for F2P Players",
      description: "Essential tips for free-to-play players to maximize resources and compete with spenders.",
      category: 'tutorials',
      videoId: 'dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600',
      views: "28.4K",
      duration: "19:55",
      uploadedAt: "1 week ago",
      likes: "4.9K"
    },
    {
      id: 8,
      title: "Kingdom Anniversary Celebration Stream",
      description: "2-hour live stream celebrating Sacred3946's 2nd anniversary! Giveaways, Q&A, and special guests.",
      category: 'highlights',
      videoId: 'dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600',
      views: "42.1K",
      duration: "2:15:30",
      uploadedAt: "2 weeks ago",
      likes: "6.2K"
    }
  ];

  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(v => v.category === selectedCategory);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    // In real app, would open YouTube player modal or redirect
  };

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF0000] to-[#CC0000] flex items-center justify-center shadow-2xl border-4 border-[#FF0000]/30">
              <FiYoutube className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-[#FFD700] mb-4 tracking-wider uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
            Sacred3946 Videos
          </h1>
          <p className="text-xl text-[#E2E8F0]/70 max-w-2xl mx-auto">
            Battles, tutorials, highlights, and kingdom content from our community
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1E293B]/80 backdrop-blur-md rounded-lg p-4 border-2 border-[#C5A059]/30 text-center">
            <FiPlay className="w-8 h-8 text-[#FFD700] mx-auto mb-2" />
            <p className="text-2xl font-bold text-[#E2E8F0]">150+</p>
            <p className="text-sm text-[#E2E8F0]/60">Total Videos</p>
          </div>
          <div className="bg-[#1E293B]/80 backdrop-blur-md rounded-lg p-4 border-2 border-[#C5A059]/30 text-center">
            <FiEye className="w-8 h-8 text-[#FFD700] mx-auto mb-2" />
            <p className="text-2xl font-bold text-[#E2E8F0]">1.2M</p>
            <p className="text-sm text-[#E2E8F0]/60">Total Views</p>
          </div>
          <div className="bg-[#1E293B]/80 backdrop-blur-md rounded-lg p-4 border-2 border-[#C5A059]/30 text-center">
            <FiThumbsUp className="w-8 h-8 text-[#FFD700] mx-auto mb-2" />
            <p className="text-2xl font-bold text-[#E2E8F0]">45K+</p>
            <p className="text-sm text-[#E2E8F0]/60">Subscribers</p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-[#FFD700] to-[#C5A059] text-[#0F172A]'
                    : 'bg-[#1E293B]/80 text-[#E2E8F0] border-2 border-[#C5A059]/30 hover:border-[#FFD700]/50'
                }`}
              >
                <cat.icon className="w-5 h-5 mr-2" />
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video) => (
            <div 
              key={video.id} 
              className="bg-[#1E293B]/80 backdrop-blur-md rounded-xl overflow-hidden border-2 border-[#C5A059]/30 hover:border-[#FFD700]/50 transition-all shadow-lg group cursor-pointer"
              onClick={() => handleVideoClick(video)}
            >
              {/* Thumbnail */}
              <div className="relative">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                />
                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-full bg-[#FF0000] flex items-center justify-center">
                    <FiPlay className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
                {/* Duration badge */}
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-white text-xs font-bold">
                  {video.duration}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-[#E2E8F0] font-bold mb-2 line-clamp-2 group-hover:text-[#FFD700] transition-colors">
                  {video.title}
                </h3>
                <p className="text-[#E2E8F0]/60 text-sm mb-3 line-clamp-2">
                  {video.description}
                </p>
                
                {/* Meta info */}
                <div className="flex items-center justify-between text-xs text-[#E2E8F0]/50">
                  <div className="flex items-center">
                    <FiEye className="w-3 h-3 mr-1" />
                    <span>{video.views}</span>
                  </div>
                  <div className="flex items-center">
                    <FiThumbsUp className="w-3 h-3 mr-1" />
                    <span>{video.likes}</span>
                  </div>
                  <div className="flex items-center">
                    <FiClock className="w-3 h-3 mr-1" />
                    <span>{video.uploadedAt}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-br from-[#1E293B]/80 to-[#0F172A]/80 backdrop-blur-md rounded-xl p-8 border-2 border-[#C5A059]/30 text-center">
          <FiYoutube className="w-16 h-16 text-[#FF0000] mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-[#FFD700] mb-3" style={{ fontFamily: 'Cinzel, serif' }}>
            Subscribe to Our Channel
          </h2>
          <p className="text-[#E2E8F0]/70 mb-6 max-w-2xl mx-auto">
            Don't miss out on epic battles, strategy guides, and kingdom updates. Subscribe now and join our growing community!
          </p>
          <a 
            href="https://www.youtube.com/@kingdom3946" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center bg-gradient-to-r from-[#FF0000] to-[#CC0000] text-white font-bold px-8 py-4 rounded-lg hover:shadow-lg hover:scale-105 transition-all"
          >
            <FiYoutube className="w-6 h-6 mr-2" />
            Subscribe on YouTube
          </a>
        </div>
      </div>
    </div>
  );
};

export default YouTube;
