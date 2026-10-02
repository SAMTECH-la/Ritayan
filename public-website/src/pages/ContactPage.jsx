import React, { useState } from 'react';
import { Mail, Send, CheckCircle, MessageSquare, MapPin } from 'lucide-react';

const ContactPage = ({ settings }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      
      <div className="text-center space-y-3">
        <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block">
          GET IN TOUCH WITH RITAYAN STUDIOS
        </span>
        <h1 className="text-4xl sm:text-5xl font-black font-serif text-white">
          CONTACT US
        </h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Have questions about our digital graphic novels, subscriptions, or feedback? Send us a message!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Info */}
        <div className="md:col-span-5 bg-slate-900/80 border border-slate-800 p-8 rounded-2xl space-y-6">
          <h3 className="text-xl font-bold font-serif text-amber-400">Ritayan Studio Headquarters</h3>
          
          <div className="space-y-4 text-xs text-slate-300">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-amber-400 mt-0.5" />
              <div>
                <span className="text-slate-500 block">EMAIL ADDRESS</span>
                <span className="font-semibold text-slate-200">{settings?.contact_email || 'contact@ritayan.com'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MessageSquare className="w-4 h-4 text-amber-400 mt-0.5" />
              <div>
                <span className="text-slate-500 block">SOCIALS</span>
                <span className="font-semibold text-slate-200">@ritayan_comics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-7 bg-slate-900/90 border border-slate-800 p-8 rounded-2xl">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-2xl font-bold font-serif text-white">Message Sent Successfully!</h3>
              <p className="text-xs text-slate-400">Thank you for reaching out. The RITAYAN team will get back to you shortly.</p>
              <button 
                onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', message: '' }); }}
                className="px-6 py-2 rounded-xl bg-slate-800 text-amber-400 text-xs font-bold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Your Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter your name..." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Enter your email..." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Message</label>
                <textarea 
                  rows="4" 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Write your message or inquiry here..." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>SEND MESSAGE</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};

export default ContactPage;
