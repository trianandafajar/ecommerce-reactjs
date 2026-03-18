import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, ArrowRight, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-20 pb-10 relative overflow-hidden transition-colors duration-500">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary/20 blur-[120px] z-0 pointer-events-none opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Info (Bigger Column) */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-3xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-primary animate-gradient-x">
              NEO KEYS
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Crafting the ultimate typing experience. We curate and build premium enthusiast mechanical keyboards for those who demand excellence in every keystroke.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span>123 Silicon Valley, CA 94025</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <span>+1 (800) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <span>support@neokeys.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="font-semibold text-foreground uppercase tracking-wider text-sm">Shop</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link to="/?category=keyboards" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span>Barebones Kits</Link></li>
              <li><Link to="/?category=switches" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span>Switches</Link></li>
              <li><Link to="/?category=keycaps" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span>Keycaps</Link></li>
              <li><Link to="/?category=accessories" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span>Accessories & Lubes</Link></li>
              <li><Link to="/?category=deskmat" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span>Desk Mats</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h4 className="font-semibold text-foreground uppercase tracking-wider text-sm">Support</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link to="#" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span>Build Guides</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span>Shipping Config</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span>Returns & Refunds</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span>FAQ</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span>Order Tracking</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4 space-y-6">
            <h4 className="font-semibold text-foreground uppercase tracking-wider text-sm">Join the Community</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Subscribe to our newsletter to get early access to Group Buys, special offers, and restock notifications.
            </p>
            <div className="flex gap-0 group">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="bg-muted border-border focus-visible:ring-primary focus-visible:ring-1 rounded-r-none h-12 px-4 shadow-inner text-foreground placeholder:text-muted-foreground"
              />
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-l-none px-6 transition-all hover:pr-5 group-hover:pl-7">
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            
            <div className="flex items-center gap-4 pt-6">
              <a href="#" className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/20 hover:scale-110 transition-all duration-300">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/20 hover:scale-110 transition-all duration-300">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/20 hover:scale-110 transition-all duration-300">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/20 hover:scale-110 transition-all duration-300">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Neo Keys. All Rights Reserved.
          </p>
          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-primary transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
