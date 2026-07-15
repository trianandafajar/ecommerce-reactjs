import { useState, useEffect, useCallback } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Zap } from "lucide-react";

const slides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1600&auto=format&fit=crop",
    badge: "Restocked: Holy Pandas",
    title: "Build Your",
    highlight: "Endgame Keyboard",
    description:
      "Curated components, premium barebone kits, and enthusiast-grade switches. Everything you need to craft the perfect typing experience.",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1600&auto=format&fit=crop",
    badge: "New Arrival: GMK Sets",
    title: "Premium",
    highlight: "Keycap Sets",
    description:
      "Elevate your aesthetics with high-quality, double-shot ABS and dye-sub PBT keycaps designed by the community.",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=1600&auto=format&fit=crop",
    badge: "Group Buy Live",
    title: "Custom",
    highlight: "Artisan Switches",
    description:
      "Experience unparalleled tactile feedback and smooth linear presses with our exclusive hand-lubed switch collections.",
  },
];

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDocumentHidden, setIsDocumentHidden] = useState(false);

  const prefersReducedMotion = usePrefersReducedMotion();

  const goToPreviousSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goToNextSlide = useCallback(() => {
     setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || isHovered || isDocumentHidden) return;

    const timer = setInterval(goToNextSlide, 6000);
    return () => clearInterval(timer);
    
  }, [goToNextSlide, isDocumentHidden, isHovered, prefersReducedMotion]);

  useEffect(() => {
    const handleVisibilityChange = () => setIsDocumentHidden(document.hidden);
    handleVisibilityChange();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const slideTransitionClass = prefersReducedMotion
    ? "absolute inset-0 flex"
    : "absolute inset-0 flex transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]";

  const imageTransitionClass = prefersReducedMotion
    ? "absolute inset-0 h-full w-full object-cover"
    : "absolute inset-0 h-full w-full object-cover transition-transform duration-[7000ms] ease-out";

  return (
    <section
      className="relative md:-mt-20 h-[480px] w-full overflow-hidden border-b border-border bg-background sm:h-[560px] lg:h-[620px]"
      aria-label="Featured products banner"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className={slideTransitionClass}
          style={{
            width: `${slides.length * 100}%`,
            transform: `translate3d(-${currentSlide * (100 / slides.length)}%,0,0)`,
            willChange: prefersReducedMotion ? "auto" : "transform",
          }}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="relative h-full flex-none overflow-hidden"
              style={{ width: `${100 / slides.length}%` }}
            >
              <img
                src={slide.image}
                alt={slide.highlight}
                width={1600}
                height={960}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "low"}
                decoding={index === 0 ? "sync" : "async"}
                sizes="100vw"
                className={imageTransitionClass}
                style={{
                  transform:
                    !prefersReducedMotion && currentSlide === index
                      ? "scale(1.08)"
                      : "scale(1)",
                }}
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 z-10 bg-background/65 dark:bg-background/60" />
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-30">
        <button
          onClick={goToPreviousSlide}
          aria-label="Previous slide"
          className="group pointer-events-auto absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-background/80 backdrop-blur-md transition-colors duration-200 hover:bg-accent"
        >
          <ChevronLeft className="h-5 w-5 text-foreground transition-transform duration-200 group-hover:-translate-x-0.5" />
        </button>
        <button
          onClick={goToNextSlide}
          aria-label="Next slide"
          className="group pointer-events-auto absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-background/80 backdrop-blur-md transition-colors duration-200 hover:bg-accent"
        >
          <ChevronRight className="h-5 w-5 text-foreground transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>

      <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col justify-center gap-5 px-4 py-16 text-center sm:items-start sm:px-6 sm:text-left lg:px-8 lg:py-24">
        <div className="inline-flex items-center justify-center gap-2 text-sm font-medium text-foreground sm:justify-start">
          <Zap
            className="size-4 text-primary"
            aria-hidden="true"
          />

          <span key={`badge-${currentSlide}`}>
            {slides[currentSlide].badge}
          </span>
        </div>

        <h1
          key={`title-${currentSlide}`}
          className={`max-w-3xl text-4xl font-semibold tracking-tight text-foreground md:text-6xl lg:text-6xl ${prefersReducedMotion ? "" : "animate-in fade-in slide-in-from-bottom-4 duration-500"}`}
        >
          {slides[currentSlide].title}
          <br />
          <span className="text-primary">
            {slides[currentSlide].highlight}
          </span>
        </h1>

        <p
          key={`description-${currentSlide}`}
          className={`mt-1 max-w-xl text-base leading-7 text-foreground/80 md:text-lg ${
            prefersReducedMotion
              ? ""
              : "animate-in fade-in slide-in-from-bottom-4 duration-700"
          }`}
        >
          {slides[currentSlide].description}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
          <a
            href="#popular"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.99]"
          >
            Shop Collection
            <ArrowRight className="ml-2 size-4" aria-hidden="true" />
          </a>
        </div>

        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 sm:left-6 sm:translate-x-0 lg:left-8">
          {slides.map((slide, index) => {
            const isActive = currentSlide === index;

            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={isActive ? "true" : undefined}
                className={`h-1 transition-[width,background-color] rounded-lg duration-500 ease-out ${
                  isActive
                    ? "w-8 bg-primary"
                    : "w-4 bg-foreground/30 hover:bg-foreground/60"
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
