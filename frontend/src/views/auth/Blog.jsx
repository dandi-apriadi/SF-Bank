import React, { useState } from 'react';
import { FiBookOpen, FiCalendar, FiUser, FiClock, FiTag, FiSearch } from 'react-icons/fi';
import { GiScrollUnfurled, GiCrossedSwords, GiCastle, GiTrophyCup } from 'react-icons/gi';
import { MdTrendingUp } from 'react-icons/md';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Posts', icon: FiBookOpen },
    { id: 'guides', name: 'Strategy Guides', icon: GiScrollUnfurled },
    { id: 'updates', name: 'Kingdom Updates', icon: GiCastle },
    { id: 'kvk', name: 'KvK Analysis', icon: GiCrossedSwords },
    { id: 'events', name: 'Event Recaps', icon: GiTrophyCup }
  ];

  const blogPosts = [
    {
      id: 1,
      title: "Complete Guide to KvK Season 10 Strategy",
      excerpt: "Everything you need to know about the upcoming KvK Season 10. New mechanics, best commanders, and kingdom coordination strategies.",
      category: 'kvk',
      author: "King_Arthur",
      date: "2024-01-15",
      readTime: "12 min",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600",
      tags: ["KvK", "Strategy", "Season 10"],
      featured: true
    },
    {
      id: 2,
      title: "Top 5 Commander Pairings for 2024 Meta",
      excerpt: "Discover the most powerful commander combinations dominating the current meta. Detailed analysis with pros and cons for each pairing.",
      category: 'guides',
      author: "Commander_Pro",
      date: "2024-01-12",
      readTime: "8 min",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600",
      tags: ["Commanders", "Meta", "Guide"]
    },
    {
      id: 3,
      title: "Sacred3946 Anniversary Event Recap",
      excerpt: "Amazing turnout at our 2nd anniversary celebration! Event highlights, winners, and thank you to all participants.",
      category: 'events',
      author: "EventManager_Luna",
      date: "2024-01-10",
      readTime: "5 min",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600",
      tags: ["Anniversary", "Community", "Event"]
    },
    {
      id: 4,
      title: "January 2024 Kingdom Updates & Changes",
      excerpt: "New rules, leadership updates, and upcoming features for Sacred3946. Important information for all members.",
      category: 'updates',
      author: "King_Arthur",
      date: "2024-01-08",
      readTime: "6 min",
      image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600",
      tags: ["Updates", "Announcements", "Rules"]
    },
    {
      id: 5,
      title: "How to Optimize Resource Gathering Efficiently",
      excerpt: "Maximize your resource production with these proven strategies. Tips for both F2P and P2W players.",
      category: 'guides',
      author: "Resource_Master",
      date: "2024-01-05",
      readTime: "10 min",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600",
      tags: ["Resources", "F2P", "Guide"]
    },
    {
      id: 6,
      title: "KvK Season 9 Post-Mortem Analysis",
      excerpt: "Deep dive into what worked and what didn't in Season 9. Lessons learned and improvements for next season.",
      category: 'kvk',
      author: "Strategy_Chief",
      date: "2024-01-03",
      readTime: "15 min",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600",
      tags: ["KvK", "Analysis", "Season 9"]
    },
    {
      id: 7,
      title: "Beginner's Guide: Your First 30 Days",
      excerpt: "New to Rise of Kingdoms? This comprehensive guide covers everything you need to know in your first month.",
      category: 'guides',
      author: "Mentor_Beta",
      date: "2024-01-01",
      readTime: "20 min",
      image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600",
      tags: ["Beginners", "Guide", "Tutorial"],
      featured: true
    },
    {
      id: 8,
      title: "December Tournament Results & Highlights",
      excerpt: "Congratulations to all winners of the December Kingdom Tournament! See the full rankings and best moments.",
      category: 'events',
      author: "EventManager_Luna",
      date: "2023-12-28",
      readTime: "7 min",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600",
      tags: ["Tournament", "Results", "Event"]
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFD700] to-[#C5A059] flex items-center justify-center shadow-2xl border-4 border-[#FFD700]/30">
              <FiBookOpen className="w-12 h-12 text-[#0F172A]" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-[#FFD700] mb-4 tracking-wider uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
            Kingdom Chronicles
          </h1>
          <p className="text-xl text-[#E2E8F0]/70 max-w-2xl mx-auto">
            Guides, updates, and stories from Sacred3946
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#E2E8F0]/50 w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles, guides, and updates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1E293B]/80 backdrop-blur-md border-2 border-[#C5A059]/30 rounded-lg pl-12 pr-4 py-4 text-[#E2E8F0] focus:border-[#FFD700]/50 focus:outline-none transition-all"
            />
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

        {/* Featured Posts */}
        {selectedCategory === 'all' && !searchQuery && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-[#FFD700] mb-6 flex items-center" style={{ fontFamily: 'Cinzel, serif' }}>
              <MdTrendingUp className="w-8 h-8 mr-3" />
              Featured Articles
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredPosts.map((post) => (
                <div key={post.id} className="bg-[#1E293B]/80 backdrop-blur-md rounded-xl overflow-hidden border-2 border-[#FFD700]/50 hover:border-[#FFD700] transition-all shadow-lg group">
                  <div className="relative h-48">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-[#FFD700] to-[#C5A059] text-[#0F172A] px-3 py-1 rounded-full text-xs font-bold">
                      FEATURED
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-[#E2E8F0]/60 mb-3">
                      <span className="flex items-center">
                        <FiUser className="w-4 h-4 mr-1" />
                        {post.author}
                      </span>
                      <span className="flex items-center">
                        <FiCalendar className="w-4 h-4 mr-1" />
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <FiClock className="w-4 h-4 mr-1" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-[#E2E8F0] mb-3 group-hover:text-[#FFD700] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-[#E2E8F0]/70 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <span key={index} className="bg-[#0F172A]/60 border border-[#C5A059]/30 px-3 py-1 rounded-full text-xs text-[#FFD700]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <button className="bg-gradient-to-r from-[#FFD700] to-[#C5A059] text-[#0F172A] font-bold px-6 py-2 rounded-lg hover:shadow-lg transition-all">
                      Read Article
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Posts Grid */}
        <div>
          <h2 className="text-3xl font-bold text-[#FFD700] mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
            {selectedCategory === 'all' ? 'Latest Articles' : categories.find(c => c.id === selectedCategory)?.name}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-[#1E293B]/80 backdrop-blur-md rounded-xl overflow-hidden border-2 border-[#C5A059]/30 hover:border-[#FFD700]/50 transition-all shadow-lg group">
                <div className="relative h-40">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-[#E2E8F0]/60 mb-2">
                    <span className="flex items-center">
                      <FiCalendar className="w-3 h-3 mr-1" />
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <FiClock className="w-3 h-3 mr-1" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#E2E8F0] mb-2 group-hover:text-[#FFD700] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-[#E2E8F0]/70 text-sm mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#E2E8F0]/60">
                      By {post.author}
                    </span>
                    <button className="text-[#FFD700] font-semibold text-sm hover:underline">
                      Read More →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <FiBookOpen className="w-16 h-16 text-[#E2E8F0]/30 mx-auto mb-4" />
              <p className="text-[#E2E8F0]/50 text-lg">No articles found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
