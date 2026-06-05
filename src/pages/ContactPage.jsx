import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import logo from '../assets/logo_dark_text.png';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data } = await api.post('/contact', formData);
      toast.success(data.message);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | AK Mobiles</title>
        <meta name="description" content="Contact AK Mobiles in Virudhachalam. Visit our store, call us, or send a message." />
      </Helmet>

      {/* Light & Modern Header */}
      <section className="relative pt-12 pb-16 overflow-hidden bg-gradient-to-tr from-blue-50/70 via-white to-purple-50/70 text-slate-800 mx-4 mt-4 rounded-3xl border border-slate-200/50 shadow-[0_15px_35px_rgba(0,0,0,0.03)] text-center">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-tr from-purple-300/10 to-transparent rounded-full blur-[80px] pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10 max-w-2xl">
          <img src={logo} alt="AK Mobiles Logo" className="h-48 mx-auto object-contain mb-6" />
          <span className="text-xs font-extrabold tracking-widest text-brand-blue uppercase bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full inline-block mb-3">
            Get in Touch
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">AK Mobiles Store Support</h1>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed">
            Have queries about stock availability, pricing, or product warranty? Contact us using the form below or drop by our showroom in Virudhachalam.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          
          {/* Contact Info - Sleek Gradient Panel */}
          <motion.div 
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/3 flex"
          >
            <div className="bg-gradient-to-tr from-blue-50 to-indigo-50/70 text-slate-800 rounded-2xl p-8 shadow-sm border border-blue-100 relative overflow-hidden flex flex-col justify-between w-full min-h-[480px]">
              {/* Background light glow decoration */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100/50 rounded-full blur-2xl -mr-10 -mt-10"></div>
              
              <div>
                <h2 className="text-2xl font-bold mb-8 text-slate-950 relative z-10">Contact Information</h2>
                
                <div className="space-y-6 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm shrink-0">
                      <FiMapPin size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-1">Store Address</h3>
                      <p className="text-slate-700 text-sm leading-relaxed">
                        No 113 B, Near Agarval Eye Hospital, Opposite Bus Stand,<br />
                        Junction Road, Shakti Nagar, Vriddhachalam-606001, Tamil Nadu
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm shrink-0">
                      <FiPhone size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-1">Phone Number</h3>
                      <a href="tel:04143261221" className="text-blue-600 font-semibold hover:underline transition-colors block text-sm mb-1.5">04143 261 221 (Landline)</a>
                      <a href="https://wa.me/917947107854" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 bg-green-500 text-white rounded-full px-3 py-1 text-xs font-bold shadow-sm hover:bg-green-600 hover:scale-105 transition-all">
                        <FaWhatsapp size={14} /> WhatsApp Us (+91 79471 07854)
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm shrink-0">
                      <FiMail size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-1">Email Address</h3>
                      <a href="mailto:support@akmobiles.com" className="text-blue-600 font-semibold hover:underline transition-colors text-sm">support@akmobiles.com</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm shrink-0">
                      <FiClock size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-1">Store Hours</h3>
                      <p className="text-slate-700 text-sm">Monday - Sunday: Open until 10:00 PM</p>
                      <p className="text-emerald-600 text-xs font-bold mt-1 uppercase tracking-wider">Open all days</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-slate-200 pt-4 text-center text-xs text-slate-500 font-medium">
                AK MOBILES — Trusted Mobile Retailer
              </div>
            </div>
          </motion.div>

          {/* Contact Form - White Premium Shadow Card */}
          <motion.div 
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:w-2/3 flex"
          >
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col justify-between w-full">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Send us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">Your Name</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="input-field bg-slate-50 border-slate-200"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input-field bg-slate-50 border-slate-200"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">Subject</label>
                    <input 
                      type="text" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="input-field bg-slate-50 border-slate-200"
                      placeholder="Product inquiry, warranty assistance, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">Message</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="input-field bg-slate-50 border-slate-200 resize-none"
                      placeholder="Type details of your requirement..."
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full md:w-auto px-8 py-3 bg-blue-50 hover:bg-blue-100 active:scale-98 text-blue-600 border border-blue-200 font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    {loading ? 'Sending...' : <><FiSend /> Send Message</>}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Location Call to Action */}
      <div className="w-full bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] border border-slate-200/60 rounded-3xl p-8 md:p-12 mt-12 mx-4 max-w-[calc(100%-2rem)] shadow-sm">
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          
          {/* Left: Info */}
          <div className="lg:w-1/2 text-left space-y-6">
            <span className="text-[10px] font-extrabold tracking-widest text-blue-600 uppercase bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full inline-block">
              Store Locator
            </span>
            
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Visit Our Showroom in <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Virudhachalam</span>
            </h2>
            
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              Drop by to experience and test the latest flagships and mobile accessories in person. Our experts are ready to help you find your next phone.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center border border-blue-200">
                  <span className="text-blue-600 text-xs">📍</span>
                </div>
                <span className="text-sm font-semibold text-slate-700">Opposite Bus Stand, Junction Road, Virudhachalam</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center border border-blue-200">
                  <span className="text-blue-600 text-xs">🏥</span>
                </div>
                <span className="text-sm font-medium text-slate-650">Near Agarwal Eye Hospital</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center border border-blue-200">
                  <span className="text-blue-600 text-xs">🚗</span>
                </div>
                <span className="text-sm font-medium text-slate-650">Ample free customer parking available</span>
              </div>
            </div>

            <div className="pt-4">
              <a 
                href="https://maps.google.com/?q=Virudhachalam+Bus+Stand" 
                target="_blank" 
                rel="noreferrer" 
                className="px-8 py-3.5 text-sm bg-blue-50 hover:bg-blue-100 active:scale-98 text-blue-600 border border-blue-200 font-extrabold rounded-xl inline-flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                🗺️ See Location in Google Maps &rarr;
              </a>
            </div>
          </div>
          
          {/* Right: Map Graphic Mockup */}
          <div className="lg:w-1/2 w-full">
            <a 
              href="https://maps.google.com/?q=Virudhachalam+Bus+Stand" 
              target="_blank" 
              rel="noreferrer"
              className="block group relative rounded-2xl overflow-hidden border border-slate-200 shadow-md h-64 md:h-80 w-full"
            >
              {/* Map Image/Mockup Background */}
              <div className="absolute inset-0 bg-[#E2E8F0] bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:16px_16px] flex items-center justify-center">
                {/* Styled Grid Lines resembling Map */}
                <div className="absolute inset-0 opacity-20 bg-gradient-to-tr from-slate-300 via-transparent to-slate-300"></div>
                
                {/* Visual Map Routes */}
                <svg className="absolute w-full h-full text-slate-300/40" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M-10 120 C 150 120, 250 240, 410 240" stroke="#CBD5E1" strokeWidth="12" />
                  <path d="M120 -10 C 120 150, 320 180, 320 310" stroke="#CBD5E1" strokeWidth="8" />
                  <path d="M-10 120 C 150 120, 250 240, 410 240" stroke="#FFFFFF" strokeWidth="6" />
                  <path d="M120 -10 C 120 150, 320 180, 320 310" stroke="#FFFFFF" strokeWidth="4" />
                </svg>

                {/* Pulse Glow Location Marker */}
                <div className="relative flex items-center justify-center z-10">
                  <div className="absolute w-12 h-12 rounded-full bg-blue-500/20 animate-ping"></div>
                  <div className="absolute w-8 h-8 rounded-full bg-blue-500/40 animate-pulse"></div>
                  <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center">
                    <span className="text-white text-[9px] font-black">AK</span>
                  </div>
                </div>

                {/* Floating Map Popup Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl border border-white/60 shadow-lg flex items-center justify-between transition-transform group-hover:translate-y-[-2px]">
                  <div className="text-left">
                    <h4 className="font-bold text-slate-900 text-xs">AK Mobiles Store</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Junction Road, Virudhachalam</p>
                  </div>
                  <span className="bg-blue-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg">Directions</span>
                </div>
              </div>
            </a>
          </div>

        </div>
      </div>
    </>
  );
};

export default ContactPage;
