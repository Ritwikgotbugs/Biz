import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";
import {
    BookOpen,
    Briefcase,
    Building2,
    ChevronLeft,
    ChevronRight,
    FileText,
    Home,
    Layout,
    LogOut,
    MessageSquare,
    Settings,
    Target,
    TrendingUp,
    User,
    Users2
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface SideNavProps {
  isCollapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const SideNav = ({ isCollapsed, onCollapse }: SideNavProps) => {
  const { isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  
  // Handle hover state changes
  useEffect(() => {
    if (isHovered && isCollapsed) {
      onCollapse(false);
    } else if (!isHovered && !isCollapsed) {
      // Only collapse if it wasn't manually expanded
      const timeoutId = setTimeout(() => {
        onCollapse(true);
      }, 150); // Reduced delay for faster response
      
      return () => clearTimeout(timeoutId);
    }
  }, [isHovered, isCollapsed, onCollapse]);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = localStorage.getItem('userProfile');
        if (profile) {
          setUserProfile(JSON.parse(profile));
        }
      } catch (error) {
        console.error("Failed to load user profile:", error);
      }
    };
    
    if (isAuthenticated) {
      loadUserProfile();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'ideation':
        return <Target className="h-5 w-5" />;
      case 'validation':
        return <Briefcase className="h-5 w-5" />;
      case 'early_growth':
        return <TrendingUp className="h-5 w-5" />;
      case 'scaling':
        return <Building2 className="h-5 w-5" />;
      default:
        return <Users2 className="h-5 w-5" />;
    }
  };

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case 'ideation':
        return 'Ideation';
      case 'validation':
        return 'Validation';
      case 'early_growth':
        return 'Early Growth';
      case 'scaling':
        return 'Scaling';
      default:
        return 'General';
    }
  };

  const navItems = [
    { path: "/", label: "Home", icon: Home, auth: false },
    { path: "/how-it-works", label: "How It Works", icon: BookOpen, auth: false },
    { path: "/dashboard/general", label: "Dashboard", icon: Layout, auth: true },
    { path: "/knowledge-base", label: "Knowledge Base", icon: FileText, auth: true },
    { path: "/resources", label: "Resources", icon: FileText, auth: true },
    { path: "/chatbot", label: "AI Assistant", icon: MessageSquare, auth: true },
    { path: "http://localhost:8081", label: "Early Growth", icon: TrendingUp },
    { path: "https://aarthiksaathidev.vercel.app", label: "Budget & Policies", icon: Target },

  ];

  // const dashboardCategories = [
  //   { path: "/dashboard/general", label: "General", icon: Users2 },
  //   { path: "/dashboard/validation", label: "Validation", icon: Briefcase },
  //   { path: "/dashboard/early-growth", label: "Early Growth", icon: TrendingUp },
  //   { path: "/dashboard/scaling", label: "Scaling", icon: Building2 },
  // ];

  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-zinc-900 text-white z-50 
        transition-all duration-300 ease-in-out transform
        ${isCollapsed ? 'w-16' : 'w-64'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full">
        {/* Logo and collapse button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl text-primary">Biz<span className="text-gradient">Aarambh</span></span>
            </Link>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onCollapse(!isCollapsed)}
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              if (item.auth && !isAuthenticated) return null;
              
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-200 ease-in-out ${
                      isActive(item.path)
                        ? 'bg-primary text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}

            {/* Dashboard Categories */}
            
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-700">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-2 text-gray-300 hover:text-white transition-colors duration-200">
                  <User className="h-5 w-5 flex-shrink-0" />
                  <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                    {user?.user_metadata?.name || user?.email || "User"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate(`/dashboard/${userProfile?.stage || 'general'}`)}>
                    <Layout className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/knowledge-base")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Knowledge Base</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className={`flex ${isCollapsed ? 'flex-col gap-2' : 'gap-2'}`}>
              <Button variant="outline" asChild className="w-full transition-all duration-200">
                <Link to="/login">Login</Link>
              </Button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'h-0 opacity-0' : 'h-auto opacity-100'}`}>
                <Button asChild className="w-full">
                  <Link to="/signup">Sign up</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideNav; 