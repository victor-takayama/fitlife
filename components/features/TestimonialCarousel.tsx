
import React, { useState } from 'react';
import { MOCK_TESTIMONIALS } from '../../constants';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Testimonial } from '../../types';

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
  <Card className="h-full flex flex-col items-center text-center p-8 bg-white/50 dark:bg-slate-800/50">
    <img src={testimonial.avatarUrl} alt={testimonial.name} className="w-20 h-20 rounded-full mb-4 shadow-lg" />
    <h4 className="text-lg font-semibold text-neutral-dark dark:text-white mb-1">{testimonial.name}</h4>
    <p className="text-sm text-primary dark:text-primary-light mb-2">{testimonial.category}</p>
    <div className="flex mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={18} className={i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'} />
      ))}
    </div>
    <Quote className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2 transform rotate-180" />
    <p className="text-neutral-DEFAULT dark:text-slate-300 text-sm leading-relaxed italic">"{testimonial.text}"</p>
  </Card>
);

const TestimonialCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonials = MOCK_TESTIMONIALS;

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-dark dark:text-white mb-4">
            O que Nossos Usuários Dizem
          </h2>
          <p className="text-lg text-neutral-DEFAULT dark:text-slate-300 max-w-2xl mx-auto">
            Histórias reais de transformação e sucesso com FitLife.
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-2">
                   {/* On smaller screens, show one. On md+, show up to 3 if possible, centered.
                       This simple carousel shows one at a time. For multiple, more complex logic needed.
                       For simplicity, this will display one centered testimonial at a time.
                    */}
                  <div className="max-w-xl mx-auto">
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {testimonials.length > 1 && (
            <>
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={prevTestimonial} 
                className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/50 dark:bg-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-600/80 shadow-md"
                aria-label="Previous testimonial"
            >
                <ChevronLeft size={24} />
            </Button>
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={nextTestimonial} 
                className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/50 dark:bg-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-600/80 shadow-md"
                aria-label="Next testimonial"
            >
                <ChevronRight size={24} />
            </Button>
            </>
          )}
        </div>
        
        <div className="mt-8 flex justify-center space-x-2">
            {testimonials.map((_, index) => (
            <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                currentIndex === index ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
            />
            ))}
        </div>

      </div>
    </section>
  );
};

export default TestimonialCarousel;
    