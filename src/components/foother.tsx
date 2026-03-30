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
              KEYSTHETIX
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
                <span>support@keysthetix.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="font-semibold text-foreground uppercase tracking-wider text-sm">Shop</h4>
            <ul className="space-y-4 text-sm text-muted-foreground flex flex-col items-start">
              <li><Link to="/?category=keyboards#popular" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span>Barebones Kits</Link></li>
              <li><Link to="/?category=switches#popular" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span>Switches</Link></li>
              <li><Link to="/?category=keycaps#popular" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span>Keycaps</Link></li>
              <li><Link to="/?category=accessories#popular" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span>Accessories & Lubes</Link></li>
              <li><Link to="/?category=deskmat#popular" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span>Desk Mats</Link></li>
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
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row items-center justify-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Keysthetix. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
