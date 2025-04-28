import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 border-t border-gray-700">
      <div className="container mx-auto pt-8 pb-4 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Company Info */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-white">BizAarambh</h3>
            <p className="text-gray-300 text-sm">
              Your one-stop platform for all startup needs in India. Simplifying the legal and compliance journey for entrepreneurs.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-400 hover:text-primary transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-base mb-3 text-white">Quick Links</h4>
            <ul className="space-y-1.5">
              <li>
                <Link to="/how-it-works" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/chatbot" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Chatbot
                </Link>
              </li>
              <li>
                <Link to="/knowledge-base" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Knowledge Base
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-base mb-3 text-white">Resources</h4>
            <ul className="space-y-1.5">
              <li>
                <Link to="/resources" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Resource Library
                </Link>
              </li>
              <li>
                <Link to="/resources?tab=tax-calculator" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Tax Calculator
                </Link>
              </li>
              <li>
                <Link to="/resources?tab=compliance-guide" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Compliance Guide
                </Link>
              </li>
              <li>
                <Link to="/knowledge-base?sector=technology" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Industry Sectors
                </Link>
              </li>
              <li>
                <Link to="/resources?tab=blog" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Startup Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="font-semibold text-base mb-3 text-white">Support</h4>
            <ul className="space-y-1.5">
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="text-gray-300 hover:text-primary transition-colors text-sm">
                  Give Feedback
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400 text-xs">
          <p>&copy; {currentYear} BizAarambh. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
