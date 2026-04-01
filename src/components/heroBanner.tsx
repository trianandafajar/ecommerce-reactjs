import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Zap, ArrowRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2042&auto=format&fit=crop",
    badge: "Restocked: Holy Pandas",
    title: "Build Your",
    highlight: "Endgame Keyboard",
    description:
      "Curated components, premium barebone kits, and enthusiast-grade switches. Everything you need to craft the perfect typing experience.",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=2000&auto=format&fit=crop",
    badge: "New Arrival: GMK Sets",
    title: "Premium",
    highlight: "Keycap Sets",
    description:
      "Elevate your aesthetics with high-quality, double-shot ABS and dye-sub PBT keycaps designed by the community.",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=2000&auto=format&fit=crop",
    badge: "Group Buy Live",
    title: "Custom",
    highlight: "Artisan Switches",
    description:
      "Experience unparalleled tactile feedback and smooth linear presses with our exclusive hand-lubed switch collections.",
  },
];

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToPreviousSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goToNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      goToNextSlide();
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[520px] sm:h-[600px] lg:h-[650px] overflow-hidden bg-background border-b border-border">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 sm:left-1/4 sm:translate-x-0 w-64 h-64 sm:w-96 sm:h-96 bg-primary/20 rounded-full blur-[100px] animate-float"></div>

        <div className="absolute bottom-1/4 right-1/2 translate-x-1/2 sm:right-1/4 sm:translate-x-0 w-80 h-80 sm:w-[30rem] sm:h-[30rem] bg-cyan-400/10 rounded-full blur-[120px] animate-float-delayed"></div>

        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent z-10"></div>

        {/* slider container */}
        <div
          className="absolute inset-0 flex transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            width: `${slides.length * 100}%`,
            transform: `translate3d(-${currentSlide * (100 / slides.length)}%,0,0)`,
            willChange: "transform",
          }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="relative h-full flex-none overflow-hidden"
              style={{ width: `${100 / slides.length}%` }}
            >
              <img
                src={slide.image}
                alt={slide.highlight}
                width="2000"
                height="1200"
                loading={slide.id === 1 ? "eager" : "lazy"}
                className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-luminosity dark:mix-blend-normal transition-transform duration-[7000ms] ease-out"
                style={{
                  transform:
                    currentSlide === slide.id - 1 ? "scale(1.08)" : "scale(1)",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-30">
        <button
          onClick={goToPreviousSlide}
          className="group pointer-events-auto absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-md bg-black/30 border border-white/20 hover:bg-cyan-400/90 hover:border-cyan-300 transition-all duration-300"
        >
          <ChevronLeft className="h-6 w-6 text-white transition-transform duration-200 group-hover:-translate-x-0.5" />
        </button>

        <button
          onClick={goToNextSlide}
          className="group pointer-events-auto absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-md bg-black/30 border border-white/20 hover:bg-cyan-400/90 hover:border-cyan-300 transition-all duration-300"
        >
          <ChevronRight className="h-6 w-6 text-white transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col items-center sm:items-start text-center sm:text-left gap-6 h-full justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
          <Zap className="w-4 h-4 fill-current animate-pulse" />
          <span key={`badge-${currentSlide}`}>
            {slides[currentSlide].badge}
          </span>
        </div>

        <h1
          key={`title-${currentSlide}`}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          {slides[currentSlide].title}
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
            {slides[currentSlide].highlight}
          </span>
        </h1>

        <p
          key={`desc-${currentSlide}`}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mt-2 leading-relaxed line-clamp-3 animate-in fade-in slide-in-from-bottom-6 duration-700"
        >
          {slides[currentSlide].description}
        </p>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-6">
          <a
            href="#popular"
            className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-lg font-medium cursor-pointer rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-95 duration-200"
          >
            Shop Collection
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </div>

        {/* Pagination */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 sm:left-4 sm:translate-x-0 lg:left-8 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "w-8 bg-primary"
                  : "w-4 bg-muted hover:bg-muted-foreground"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
