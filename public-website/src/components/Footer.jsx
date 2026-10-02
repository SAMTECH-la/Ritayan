import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Send, Instagram, Twitter, Youtube, CheckCircle } from 'lucide-react';

const Footer = ({ settings }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-3 no-underline">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-lg">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold font-serif gold-text-gradient block">
                  RITAYAN
                </span>
                <span className="text-[10px] tracking-widest text-slate-400 devanagari block">
                  युगों की गाथा
                </span>
              </div>
            </Link>
            <p className="text-slate-400 leading-relaxed max-w-md">
              {settings?.about_text || 'RITAYAN is an immersive digital graphic novel platform dedicated to bringing ancient epics to life in interactive 3D.'}
            </p>

            <div className="flex items-center gap-4 text-slate-400 pt-2">
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="hover:text-amber-400 transition">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings?.twitter_url && (
                <a href={settings.twitter_url} target="_blank" rel="noreferrer" className="hover:text-amber-400 transition">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {settings?.youtube_url && (
                <a href={settings.youtube_url} target="_blank" rel="noreferrer" className="hover:text-amber-400 transition">
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-bold font-serif text-slate-200 mb-4 tracking-wider uppercase">NAVIGATION</h4>
            <ul className="space-y-2.5 p-0 list-none">
              <li><Link to="/" className="hover:text-amber-400 transition no-underline">Home</Link></li>
              <li><Link to="/comics" className="hover:text-amber-400 transition no-underline">Comic Library</Link></li>
              <li><Link to="/search" className="hover:text-amber-400 transition no-underline">Search Issues</Link></li>
              <li><Link to="/about" className="hover:text-amber-400 transition no-underline">About the Saga</Link></li>
              <li><Link to="/contact" className="hover:text-amber-400 transition no-underline">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-sm font-bold font-serif text-amber-400 tracking-wider uppercase">JOIN THE CHRONICLES</h4>
            <p className="text-slate-400 leading-relaxed">
              Subscribe to get notified whenever a new graphic novel issue is released!
            </p>

            {subscribed ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..." 
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 flex-1"
                />
                <button 
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                >
                  Join
                </button>
              </form>
            )}
          </div>

        </div>

        <div 
          onDoubleClick={() => { 
            if (window.location.port === '5173') {
              window.location.href = 'http://localhost:5174';
            } else {
              window.location.href = '/admin';
            }
          }}
          className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px] cursor-pointer"
          title="Double-click for Admin Portal"
        >
          <p>© {new Date().getFullYear()} RITAYAN — युगों की गाथा. All rights reserved.</p>
          <p className="text-slate-500 hover:text-amber-400 transition">Premium Digital Graphic Novel Experience</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
