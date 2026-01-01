import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, LogOut, LayoutDashboard, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "AI & Consulting", path: "/ai-consulting" },
  { name: "Talent Solutions", path: "/talent-solutions" },
  { name: "NowRise Institute", path: "/nowrise-institute" },
  { name: "About Us", path: "/about" },
  { name: "Careers", path: "/careers" },
];

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAdmin, signOut, isLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsProfileOpen(false);
    navigate("/");
  };

  const getUserInitial = () => {
    if (!user) return "U";
    const email = user.email || "";
    const name = user.user_metadata?.full_name || email;
    return name.charAt(0).toUpperCase();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-card py-3" : "bg-transparent py-4"
      }`}
    >
      <nav className="container-custom flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex flex-col hover-lift">
          <span className="font-bold text-lg tracking-tight text-foreground">
            VRIDDHION & UDAANEX
          </span>
          <span className="text-xs text-muted-foreground tracking-wide">
            IT SOLUTIONS PVT LTD
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link story-link text-sm ${
                location.pathname === link.path ? "active" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}

          {!isLoading && (
            <>
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm hover:opacity-90 transition-all hover:scale-105"
                  >
                    {getUserInitial()}
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 glass-card rounded-lg shadow-hover overflow-hidden"
                      >
                        <div className="p-4 border-b border-border">
                          <p className="font-medium text-sm truncate">
                            {user.user_metadata?.full_name || "User"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                        <div className="p-2">
                          <Link
                            to="/profile"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-secondary transition-colors"
                          >
                            <User size={16} />
                            Profile
                          </Link>
                          {isAdmin && (
                            <Link
                              to="/admin"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-secondary transition-colors"
                            >
                              <LayoutDashboard size={16} />
                              Admin Dashboard
                            </Link>
                          )}
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-secondary transition-colors text-left"
                          >
                            <LogOut size={16} />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/auth"
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    Login
                  </Link>
                  <Link to="/auth" className="btn-gold text-sm px-5 py-2">
                    Sign Up
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Click outside to close profile dropdown */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-card mt-2 mx-4 rounded-lg overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`nav-link py-2 ${
                    location.pathname === link.path ? "active" : ""
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {!isLoading && (
                <>
                  {user ? (
                    <>
                      <div className="border-t border-border pt-4 mt-2">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                            {getUserInitial()}
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {user.user_metadata?.full_name || "User"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-2 py-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <User size={16} />
                          Profile
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-2 py-2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <LayoutDashboard size={16} />
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            handleSignOut();
                            setIsMobileMenuOpen(false);
                          }}
                          className="flex items-center gap-2 py-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="border-t border-border pt-4 mt-2 flex flex-col gap-3">
                      <Link
                        to="/auth"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="btn-outline text-center"
                      >
                        Login
                      </Link>
                      <Link
                        to="/auth"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="btn-gold text-center"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
