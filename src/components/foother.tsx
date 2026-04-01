import { Link } from "react-router-dom";
import { MapPin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t-2 border-foreground/10 pt-16 pb-8 relative overflow-hidden">
      {/* Structural Background Pattern (Bukan Default GLow) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24 mb-12">
          
          {/* Posisi 1: Shop (Moved here) */}
          <div className="space-y-6 order-2 md:order-1">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary/80 border-b border-primary/20 pb-2 inline-block">
              Catalogue
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Barebones Kits", to: "/?category=keyboards#popular" },
                { name: "Switches", to: "/?category=switches#popular" },
                { name: "Keycaps", to: "/?category=keycaps#popular" },
                { name: "Accessories", to: "/?category=accessories#popular" },
                { name: "Desk Mats", to: "/?category=deskmat#popular" }
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.to} 
                    className="text-sm font-medium text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all duration-200 flex items-center gap-2 group"
                  >
                    <div className="w-1 h-1 bg-primary scale-0 group-hover:scale-100 transition-transform rounded-full" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Posisi 2: Brand Info (Center focus now) */}
          <div className="flex flex-col items-center text-center space-y-6 order-1 md:order-2">
            <div className="space-y-2">
              <h3 className="text-3xl font-bold italic border-x-4 border-primary px-4 inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-primary">
                KEYSTHETIX
              </h3>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest pt-2">
                Mechanical Excellence
              </p>
            </div>
            
            <p className="text-sm leading-relaxed text-muted-foreground max-w-xs">
              Crafting the ultimate typing experience. Premium enthusiast tools for those who demand excellence.
            </p>

            <div className="flex flex-col items-center gap-3 pt-4 border-t border-dashed border-border w-full max-w-[200px]">
              <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground/80">
                <MapPin className="w-3 h-3 text-primary" />
                <span>SILICON VALLEY, CA</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground/80">
                <Mail className="w-3 h-3 text-primary" />
                <span>SUPPORT@KEYSTHETIX.COM</span>
              </div>
            </div>
          </div>

          {/* Posisi 3: Support */}
          <div className="space-y-6 order-3 text-left md:text-right">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary/80 border-b border-primary/20 pb-2 inline-block md:ml-auto">
              Support
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Build Guides", to: "#" },
                { name: "Shipping Config", to: "#" },
                { name: "Returns & Refunds", to: "#" },
                { name: "FAQ", to: "#" },
                { name: "Order Tracking", to: "#" }
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.to} 
                    className="text-sm font-medium text-muted-foreground hover:text-foreground hover:-translate-x-1 transition-all duration-200 flex items-center justify-start md:justify-end gap-2 group text-right"
                  >
                    {item.name}
                    <div className="w-1 h-1 bg-primary scale-0 group-hover:scale-100 transition-transform rounded-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} KEYSTHETIX // ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </footer>
  );
}
