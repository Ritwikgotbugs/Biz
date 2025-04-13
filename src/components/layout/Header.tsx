
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Menu, X, User, LogOut, Settings, Layout } from "lucide-react";
import { useAuth } from "@/lib/auth";

const HeaderComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-2xl text-primary">Start<span className="text-gradient">Karo</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
          <Link to="/how-it-works" className="text-sm font-medium hover:text-primary transition-colors">How It Works</Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
              <Link to="/knowledge-base" className="text-sm font-medium hover:text-primary transition-colors">Knowledge Base</Link>
              <Link to="/resources" className="text-sm font-medium hover:text-primary transition-colors">Resources</Link>
              <Link to="/chatbot" className="text-sm font-medium hover:text-primary transition-colors">AI Assistant</Link>
            </>
          ) : null}
        </nav>

        {/* Auth Buttons or User Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span>{user?.user_metadata?.name || user?.email || "User"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
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
            <>
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors py-1" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/how-it-works" className="text-sm font-medium hover:text-primary transition-colors py-1" onClick={() => setIsOpen(false)}>How It Works</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors py-1" onClick={() => setIsOpen(false)}>Dashboard</Link>
                <Link to="/knowledge-base" className="text-sm font-medium hover:text-primary transition-colors py-1" onClick={() => setIsOpen(false)}>Knowledge Base</Link>
                <Link to="/resources" className="text-sm font-medium hover:text-primary transition-colors py-1" onClick={() => setIsOpen(false)}>Resources</Link>
                <Link to="/chatbot" className="text-sm font-medium hover:text-primary transition-colors py-1" onClick={() => setIsOpen(false)}>AI Assistant</Link>
                <hr className="my-2" />
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{user?.user_metadata?.name || user?.email || "User"}</span>
                  <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <Button variant="outline" asChild>
                  <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup" onClick={() => setIsOpen(false)}>Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderComponent;
