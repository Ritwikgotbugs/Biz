
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Search, Clock, Calendar, User, ArrowRight } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  link: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "How to Register Your Startup Under Startup India Program",
    excerpt: "A step-by-step guide to registering your startup with DPIIT and accessing government benefits and incentives.",
    author: "Raj Sharma",
    date: "April 5, 2024",
    readTime: "7 min read",
    category: "Legal",
    image: "https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    link: "https://www.startupindia.gov.in/"
  },
  {
    id: "2",
    title: "GST for Startups: Everything Founders Need to Know in 2024",
    excerpt: "Understanding GST registration, filing requirements, and compliance for new businesses in India.",
    author: "Priya Mehta",
    date: "March 22, 2024",
    readTime: "10 min read",
    category: "Taxation",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    link: "https://www.gst.gov.in/"
  },
  {
    id: "3",
    title: "Funding Options for Early-Stage Startups in India",
    excerpt: "Exploring angel investors, venture capital, incubators, government grants, and alternative financing options.",
    author: "Vikram Singh",
    date: "March 15, 2024",
    readTime: "8 min read",
    category: "Funding",
    image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    link: "#"
  },
  {
    id: "4",
    title: "5 Legal Mistakes Indian Startups Make and How to Avoid Them",
    excerpt: "Common legal pitfalls in intellectual property, founder agreements, employment contracts, and regulatory compliance.",
    author: "Aditya Kumar",
    date: "March 8, 2024",
    readTime: "6 min read",
    category: "Legal",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    link: "#"
  },
  {
    id: "5",
    title: "Creating an Effective Business Plan for Your Indian Startup",
    excerpt: "Key components to include in your business plan to attract investors and guide your startup's growth.",
    author: "Neha Gupta",
    date: "February 28, 2024",
    readTime: "9 min read",
    category: "Strategy",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    link: "#"
  },
  {
    id: "6",
    title: "Tax Benefits and Incentives for Indian Startups in 2024",
    excerpt: "Overview of tax holidays, deductions, exemptions, and incentives available for eligible startups in India.",
    author: "Rohit Verma",
    date: "February 20, 2024",
    readTime: "7 min read",
    category: "Taxation",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    link: "#"
  },
  {
    id: "7",
    title: "Understanding Term Sheets: A Guide for First-Time Founders",
    excerpt: "Breaking down the key clauses and terms that startup founders should understand before signing.",
    author: "Siddharth Jain",
    date: "February 12, 2024",
    readTime: "12 min read",
    category: "Funding",
    image: "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    link: "#"
  },
  {
    id: "8",
    title: "Essential HR Policies for Indian Startups",
    excerpt: "Setting up the right human resources policies and practices for your growing startup team.",
    author: "Anjali Sharma",
    date: "February 5, 2024",
    readTime: "8 min read",
    category: "HR",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    link: "#"
  }
];

const categories = [
  "All",
  "Legal",
  "Taxation",
  "Funding",
  "Strategy",
  "HR",
];

const BlogArticles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  
  // Filter posts based on search query and selected category
  const filteredPosts = blogPosts.filter((post) => {
    const matchesQuery = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    
    return matchesQuery && matchesCategory;
  });
  
  // Group posts by category for the tabs
  const postsByCategory: Record<string, BlogPost[]> = {};
  categories.forEach(category => {
    if (category === "All") {
      postsByCategory[category] = blogPosts;
    } else {
      postsByCategory[category] = blogPosts.filter(post => post.category === category);
    }
  });
  
  return (
    <div className="space-y-6">
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search articles..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Badge 
              key={category}
              variant={activeCategory === category ? "default" : "outline"} 
              className="cursor-pointer"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Featured article */}
      <Card className="overflow-hidden">
        <div className="md:flex">
          <div className="md:w-2/5 h-48 md:h-auto relative">
            <img 
              src="https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
              alt="Featured article" 
              className="h-full w-full object-cover"
            />
          </div>
          <div className="md:w-3/5">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge>Featured</Badge>
                <Badge variant="outline">Strategy</Badge>
              </div>
              <CardTitle className="text-xl md:text-2xl">The Ultimate Guide to Startup Success in India</CardTitle>
              <CardDescription>
                A comprehensive resource for founders navigating the Indian startup ecosystem.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This guide covers everything from incorporation and compliance to funding and scaling strategies for startups in the Indian market. Learn from successful entrepreneurs and avoid common pitfalls.
              </p>
              <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>Startup Team</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>April 12, 2024</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>15 min read</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="gap-2">
                Read Full Article <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>
      
      {/* Articles grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden flex flex-col">
              <div className="h-48 relative">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="outline">{post.category}</Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
              </CardHeader>
              <CardContent className="pb-2 flex-grow">
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {post.excerpt}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span>{post.author}</span>
                </div>
                <a 
                  href={post.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary text-sm flex items-center gap-1 hover:underline"
                >
                  Read More <ExternalLink className="h-3 w-3" />
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-muted/30 rounded-lg">
          <h3 className="text-lg font-medium mb-2">No articles found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
      
      <div className="text-center">
        <Button variant="outline">Load More Articles</Button>
      </div>
    </div>
  );
};

export default BlogArticles;
