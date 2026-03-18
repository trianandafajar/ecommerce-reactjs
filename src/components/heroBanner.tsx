import { useState, useEffect } from "react";
import { ArrowRight, Zap } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2042&auto=format&fit=crop",
    badge: "Restocked: Holy Pandas",
    title: "Build Your",
    highlight: "Endgame Keyboard",
    description: "Curated components, premium barebone kits, and enthusiast-grade switches. Everything you need to craft the perfect typing experience."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=2000&auto=format&fit=crop",
    badge: "New Arrival: GMK Sets",
    title: "Premium",
    highlight: "Keycap Sets",
    description: "Elevate your aesthetics with high-quality, double-shot ABS and dye-sub PBT keycaps designed by the community."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=2000&auto=format&fit=crop",
    badge: "Group Buy Live",
    title: "Custom",
    highlight: "Artisan Switches",
    description: "Experience unparalleled tactile feedback and smooth linear presses with our exclusive hand-lubed switch collections."
  }
];

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-background border-b border-border min-h-[500px] lg:min-h-[650px] transition-colors duration-500">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-float z-0"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-cyan-400/10 rounded-full blur-[120px] animate-float-delayed z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-transparent z-10"></div>

        <div
          className="absolute inset-0 flex transition-transform duration-1000 ease-in-out z-0"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="min-w-full h-full relative">
              <img
                src={slide.image}
                alt={slide.highlight}
                className="w-full h-full object-cover opacity-60 mix-blend-luminosity dark:mix-blend-normal animate-slow-zoom"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col items-start gap-6 h-full justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium transition-all">
          <Zap className="w-4 h-4 fill-current animate-pulse" />
          <span key={`badge-${currentSlide}`} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {slides[currentSlide].badge}
          </span>
        </div>

        <h1 key={`title-${currentSlide}`} className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          {slides[currentSlide].title} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
            {slides[currentSlide].highlight}
          </span>
        </h1>

        <p key={`desc-${currentSlide}`} className="text-lg md:text-xl text-muted-foreground max-w-2xl mt-2 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000">
          {slides[currentSlide].description}
        </p>

        <div className="flex flex-wrap items-center gap-4 mt-6">
          <a href="#popular" className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-lg font-medium cursor-pointer rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-95 duration-200">
            Shop Collection
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </div>

        <div className="absolute bottom-8 left-4 sm:left-6 lg:left-8 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${currentSlide === index ? "w-8 bg-primary" : "w-4 bg-muted hover:bg-muted-foreground"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
