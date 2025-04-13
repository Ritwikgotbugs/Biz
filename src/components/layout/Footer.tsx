
import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const FooterComponent = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto pt-16 pb-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">StartKaro</h3>
            <p className="text-muted-foreground">
              Your one-stop platform for all startup needs in India. Simplifying the legal and compliance journey for entrepreneurs.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-400 hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-muted-foreground hover:text-primary transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/chatbot" className="text-muted-foreground hover:text-primary transition-colors">
                  Chatbot
                </Link>
              </li>
              <li>
                <Link to="/knowledge-base" className="text-muted-foreground hover:text-primary transition-colors">
                  Knowledge Base
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/resources" className="text-muted-foreground hover:text-primary transition-colors">
                  Resource Library
                </Link>
              </li>
              <li>
                <Link to="/resources?tab=tax-calculator" className="text-muted-foreground hover:text-primary transition-colors">
                  Tax Calculator
                </Link>
              </li>
              <li>
                <Link to="/resources?tab=compliance-guide" className="text-muted-foreground hover:text-primary transition-colors">
                  Compliance Guide
                </Link>
              </li>
              <li>
                <Link to="/knowledge-base?sector=technology" className="text-muted-foreground hover:text-primary transition-colors">
                  Industry Sectors
                </Link>
              </li>
              <li>
                <Link to="/resources?tab=blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Startup Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="text-muted-foreground hover:text-primary transition-colors">
                  Give Feedback
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-muted-foreground">
          <p>&copy; {currentYear} StartKaro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
