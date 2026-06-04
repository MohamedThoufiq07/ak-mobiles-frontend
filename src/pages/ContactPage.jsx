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
            <div className="bg-gradient-to-tr from-brand-blue to-purple-600 text-white rounded-2xl p-8 shadow-lg relative overflow-hidden flex flex-col justify-between w-full min-h-[480px]">
              {/* Background light glow decoration */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              
              <div>
                <h2 className="text-2xl font-bold mb-8 relative z-10">Contact Information</h2>
                
                <div className="space-y-6 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="bg-white/10 p-3 rounded-xl border border-white/10 shrink-0">
                      <FiMapPin size={18} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-blue-100 uppercase tracking-wider mb-1">Store Address</h3>
                      <p className="text-white text-sm leading-relaxed">
                        Main Road, Near Bus Stand,<br />
                        Virudhachalam, Tamil Nadu - 606001
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-white/10 p-3 rounded-xl border border-white/10 shrink-0">
                      <FiPhone size={18} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-blue-100 uppercase tracking-wider mb-1">Phone Number</h3>
                      <a href="tel:+919876543210" className="text-white hover:underline transition-colors block text-sm mb-1.5">+91 98765 43210</a>
                      <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 bg-green-500/90 text-white rounded-full px-3 py-1 text-xs font-bold shadow-sm hover:bg-green-400 hover:scale-105 transition-all">
                        <FaWhatsapp size={14} /> Chat on WhatsApp
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-white/10 p-3 rounded-xl border border-white/10 shrink-0">
                      <FiMail size={18} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-blue-100 uppercase tracking-wider mb-1">Email Address</h3>
                      <a href="mailto:support@akmobiles.com" className="text-white hover:underline transition-colors text-sm">support@akmobiles.com</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-white/10 p-3 rounded-xl border border-white/10 shrink-0">
                      <FiClock size={18} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-blue-100 uppercase tracking-wider mb-1">Store Hours</h3>
                      <p className="text-white text-sm">Monday - Sunday: 9:30 AM - 9:30 PM</p>
                      <p className="text-yellow-300 text-xs font-bold mt-1 uppercase tracking-wider">Open all days</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-4 text-center text-xs text-blue-100">
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
                    className="btn-premium w-full md:w-auto px-8 flex items-center justify-center gap-2"
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
      <div className="w-full bg-gradient-to-br from-slate-50 to-blue-50/30 py-16 px-4 mt-8 mx-4 rounded-3xl border border-slate-200/50 shadow-sm max-w-[calc(100%-2rem)] flex flex-col items-center justify-center text-center">
        <div className="text-6xl mb-6">📍</div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Visit Our Showroom
        </h2>
        <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
          Main Road, Near Bus Stand, Virudhachalam, Cuddalore District, Tamil Nadu - 606001
        </p>
        <a 
          href="https://maps.google.com/?q=Virudhachalam+Bus+Stand" 
          target="_blank" 
          rel="noreferrer" 
          className="btn-premium px-8 py-4 text-base"
        >
          See Location in Google Maps &rarr;
        </a>
      </div>
    </>
  );
};

export default ContactPage;
