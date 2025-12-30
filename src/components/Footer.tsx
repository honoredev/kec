import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Clock,
  Newspaper,
  User,
  Info,
  Shield,
  ArrowUpRight,
  MessageSquare,
  Rss,
  Bookmark,
  ExternalLink,
} from "lucide-react";
import { Input } from "./ui/input";

// Types
type SocialLink = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  url: string;
  color: string;
};

type QuickLink = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  to: string;
  desc: string;
};

type ContactInfo = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  link: string;
  desc?: string;
};

// Data
const socialLinks: SocialLink[] = [
  {
    icon: Instagram,
    label: "Instagram",
    url: "https://www.instagram.com/ikarita.media/",
    color: "#0000",
  },
  {
    icon: Twitter,
    label: "Twitter",
    url: "#",
    color: "#0000",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    url: "#",
    color:"#0000",
  },
  {
    icon: MessageSquare,
    label: "Messenger",
    url: "#",
    color: "#0000",
  },
  {
    icon: Rss,
    label: "RSS",
    url: "#",
    color: "#0000",
  },
];

const quickLinks: QuickLink[] = [
  {
    icon: Newspaper,
    label: "Latest News",
    to: "/latest",
    desc: "Stay updated with our latest articles",
  },
  {
    icon: User,
    label: "About Us",
    to: "/about",
    desc: "Learn about our mission and team",
  },
  {
    icon: Info,
    label: "Contact",
    to: "/contact",
    desc: "Get in touch with our team",
  },
  {
    icon: Bookmark,
    label: "Bookmarks",
    to: "/bookmarks",
    desc: "Your saved articles",
  },
];

const contactInfo: ContactInfo[] = [
  {
    icon: Mail,
    label: "Email",
    value: "ikaritaofficial@gmail.com",
    link: "mailto:ikaritaofficial@gmail.com",
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: "ikarita.media",
    link: "https://www.instagram.com/ikarita.media/"
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Kigali, Rwanda",
    link: "https://maps.google.com/?q=Kigali,Rwanda",
  }
];

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isHovered, setIsHovered] = useState<number | null>(null);

  // Show scroll-to-top button when user scrolls down
  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log("Subscribed with:", email);
      setIsSubscribed(true);
      setEmail("");

      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
    }
  };

  return (
    <footer className="relative overflow-hidden mt-24">
      {/* Curved Top */}
      <div className="absolute inset-x-0 top-0 h-20">
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C300,120 900,120 1200,0 L1200,120 L0,120 Z"
            fill="#021b41"
          />
        </svg>
      </div>

      {/* Main Footer Background */}
      <div className="bg-[#021b41] pt-20">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          {/* Main Footer Content */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Brand & Description */}
            <motion.div className="space-y-6">
              <Link to="/" className="inline-block group">
                <div className="flex items-center space-x-3">
                  <img
                    src="/ikaritamedia.png"
                    alt="Ikarita Media Logo"
                    className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
                  />
                  <div>
                    <h1
                      className="text-lg sm:text-xl font-bold text-white tracking-wide"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      Ikarita Media
                    </h1>
                    <p
                      className="text-xs text-white/60 font-light"
                      style={{ fontFamily: "Arial, sans-serif" }}
                    >
                      Your Trusted News Source
                    </p>
                  </div>
                </div>
              </Link>

            

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all duration-300 shadow-md hover:shadow-lg"
                    style={{
                      backgroundColor: social.color,
                      boxShadow: `0 4px 14px 0 ${social.color}40`,
                    }}
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div className="space-y-6">
              <h3 className="text-lg font-bold text-white">
                Contact Us
              </h3>
              <div className="flex flex-wrap items-start gap-4 pt-2">
                {contactInfo.map((item) => (
                  <motion.a
                    key={item.label}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 text-white/80 hover:text-white transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 group-hover:bg-white/20 transition-all duration-300 shadow-md">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-semibold">{item.label}</p>
                      <p className="text-xs text-white/60">{item.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Newsletter */}

          </motion.div>

          {/* Copyright & Bottom Bar */}
          <motion.div
            className="border-t border-gray-700 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-sm text-gray-400 text-center md:text-left mb-4 md:mb-0">
              &copy; {new Date().getFullYear()}{" "}
              <span className="notranslate">Ikarita Media</span>. All rights
              reserved.
            </p>

            
          </motion.div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#021b41] border border-white text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-40"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{
              scale: 1.1,
              y: -5,
              boxShadow:
                "0 10px 25px -5px rgba(34, 197, 94, 0.4), 0 10px 10px -5px rgba(34, 197, 94, 0.1)",
            }}
            whileTap={{ scale: 0.95 }}
            aria-label="Back to top"
          >
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
            >
              <ArrowUpRight className="w-5 h-5 -rotate-90" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;
