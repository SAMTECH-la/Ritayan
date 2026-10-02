import React from 'react';
import { BookOpen, Sparkles, Feather, Globe, Star, ShieldCheck, Heart } from 'lucide-react';

const AboutPage = ({ settings }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block">
          ABOUT THE PLATFORM
        </span>
        <h1 className="text-4xl sm:text-6xl font-black font-serif text-white">
          RITAYAN — युगों की गाथा
        </h1>
        <p className="text-slate-300 text-base leading-relaxed">
          {settings?.about_text || 'RITAYAN is a landmark connected digital comic platform dedicated to rendering ancient Vedic and Puranic chronicles into breathtaking visual graphic novel format.'}
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
            <Feather className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-serif text-white">Epic Mythological Lore</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Faithful, majestic graphic novel adaptations of Matsya, Kurma, Varaha, Narasimha, and the eternal cosmic avatars.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-serif text-white">Interactive 3D Reader</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Physical page-turning physics, realistic lighting, spine shadows, gesture navigation, and paper sound effects.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
            <Star className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-serif text-white">High Definition Artistry</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Meticulously drawn digital artwork, vibrant colors, detailed dialog bubbles, and rich chapter storytelling.
          </p>
        </div>
      </div>

      {/* Vision Box */}
      <div className="bg-slate-900 border border-amber-500/20 rounded-3xl p-8 sm:p-12 space-y-6 text-center">
        <h3 className="text-2xl font-bold font-serif text-amber-400">
          The Vision of Ritayan Studio
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl mx-auto">
          Our mission is to preserve, honor, and celebrate India's rich heritage of sacred lore by making ancient stories accessible to readers worldwide through modern, interactive digital media.
        </p>

        <div className="pt-4 flex justify-center">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-950 px-6 py-3 rounded-full border border-slate-800">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Preserving Heritage Through Modern Visual Graphic Novels</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutPage;
