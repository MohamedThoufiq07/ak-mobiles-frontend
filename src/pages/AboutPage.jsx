import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiUsers, FiAward, FiStar, FiClock, FiShield, FiPhone } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import logoDarkText from '../assets/logo_dark_text.png';

const AboutPage = () => {
  const [animationStage, setAnimationStage] = useState('static'); // 'static', 'flying', 'landed'
  const [flyPath, setFlyPath] = useState(null);
  const heroRef = useRef(null);
  const phoneRef = useRef(null);
  const landingRef = useRef(null);

  useEffect(() => {
    const calculatePositions = () => {
      if (heroRef.current && phoneRef.current && landingRef.current) {
        const heroRect = heroRef.current.getBoundingClientRect();
        const phoneRect = phoneRef.current.getBoundingClientRect();
        const landingRect = landingRef.current.getBoundingClientRect();

        // Butterfly size: w-24=96px on mobile, md:w-32=128px, lg:w-40=160px
        const bSize = window.innerWidth >= 1024 ? 160 : window.innerWidth >= 768 ? 128 : 96;

        // Start position: center of phone screen
        const startX = phoneRect.left + phoneRect.width * 0.5 - heroRect.left - bSize / 2;
        const startY = phoneRect.top + phoneRect.height * 0.38 - heroRect.top - bSize / 2;

        // End position: center of the butterfly landing zone (next to text logo)
        const endX = landingRect.left + landingRect.width / 2 - heroRect.left - bSize / 2;
        const endY = landingRect.top + landingRect.height / 2 - heroRect.top - bSize / 2;

        setFlyPath({ startX, startY, endX, endY });
      }
    };

    // Calculate positions after layout settles
    const posTimer = setTimeout(calculatePositions, 100);

    // Start flight after butterfly is visible on phone for 1.3 seconds
    const flightTimer = setTimeout(() => {
      calculatePositions(); // Recalculate for accuracy right before flight
      setAnimationStage('flying');
    }, 1300);

    return () => {
      clearTimeout(posTimer);
      clearTimeout(flightTimer);
    };
  }, []);

  // Transition from flying → landed after flight animation duration
  useEffect(() => {
    if (animationStage === 'flying') {
      const landTimer = setTimeout(() => {
        setAnimationStage('landed');
      }, 2600); // 2.5s flight + 100ms buffer
      return () => clearTimeout(landTimer);
    }
  }, [animationStage]);

  // Animation Variants for cards section
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <>
      <Helmet>
        <title>About Us | AK Mobiles</title>
        <meta name="description" content="Learn about AK Mobiles, your trusted mobile phone and accessories store in Virudhachalam, Tamil Nadu." />
      </Helmet>

      {/* Light & Modern Hero Section */}
      <section ref={heroRef} className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden bg-gradient-to-tr from-blue-50/70 via-white to-purple-50/70 text-slate-800 mx-4 mt-4 rounded-3xl shadow-[0_15px_35px_rgba(0,0,0,0.03)] border border-slate-200/50">
        {/* Decorative Glowing Orbs */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-tr from-purple-300/10 to-transparent rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-300/10 to-transparent rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Text Content (Left Side) */}
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="lg:w-7/12 text-center lg:text-left"
            >
              {/* Logo: Full AK Mobiles logo (butterfly + text combined) */}
              <div className="flex items-center justify-center lg:justify-start mb-6 overflow-visible relative">
                {/* Hidden ref target for butterfly flight path calculation */}
                <div ref={landingRef} className="absolute left-0 top-0 w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 pointer-events-none" />
                
                {/* Complete logo appears after butterfly animation lands */}
                {animationStage === 'landed' ? (
                  <motion.img 
                    src={logoDarkText} 
                    alt="AK Mobiles" 
                    className="h-24 md:h-32 lg:h-40 object-contain drop-shadow-lg"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                ) : (
                  /* Placeholder to maintain layout space before logo appears */
                  <div className="h-24 md:h-32 lg:h-40" />
                )}
              </div>

              <span className="text-xs font-extrabold tracking-widest text-brand-blue uppercase bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full inline-block mb-4 shadow-sm">
                Who We Are
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight text-slate-900 bg-gradient-to-r from-slate-900 via-slate-850 to-brand-blue bg-clip-text text-transparent">
                Connecting You to <br/>
                <span className="bg-gradient-to-r from-brand-blue to-purple-600 bg-clip-text text-transparent">World Class Tech</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-550 leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
                AK Mobiles is the region's premium destination for smartphones, smartwatches, and accessories. Based in Virudhachalam, we bridge the gap between global innovations and local consumers, providing official brands, competitive rates, and reliable after-sales support.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link to="/products" className="btn-premium px-8 py-3.5 shadow-md shadow-brand-blue/20">
                  Explore Products
                </Link>
                <Link to="/contact" className="btn-premium-outline bg-white/80 px-8 py-3.5 shadow-sm">
                  Contact Support
                </Link>
              </div>
            </motion.div>

            {/* Floating Mobile Phone (Right Side) */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className="lg:w-5/12 flex justify-center relative"
            >
              {/* Soft glow behind phone */}
              <div className="absolute w-[280px] h-[280px] rounded-full bg-gradient-to-tr from-brand-blue/15 to-transparent blur-[50px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 animate-pulse"></div>
              
              {/* Floating Phone Container */}
              <motion.div 
                ref={phoneRef}
                animate={{ y: [0, -15, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 flex justify-center items-center"
              >
                <img 
                  src="https://www.myg.in/images/thumbnails/260/260/detailed/91/tv1-removebg-preview.png.png" 
                  alt="AK Mobiles Premium Phone Display" 
                  className="max-h-[380px] md:max-h-[460px] object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.12)] cursor-grab active:cursor-grabbing"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Flying Butterfly — section-level for smooth, straight flight from phone → logo */}
        {flyPath && animationStage !== 'landed' && (
          <motion.img
            src="/favicon.png"
            alt="AK Butterfly Flying"
            className="absolute z-50 w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 pointer-events-none"
            style={{ left: flyPath.startX, top: flyPath.startY }}
            animate={animationStage === 'flying' ? {
              x: flyPath.endX - flyPath.startX,
              y: flyPath.endY - flyPath.startY,
              rotate: [0, -8, 5, -3, 0],
              scaleX: [1, 0.3, 1],
            } : {
              x: 0,
              y: 0,
              scaleX: [1, 0.5, 1],
            }}
            transition={animationStage === 'flying' ? {
              default: { duration: 2.5, ease: [0.25, 0.1, 0.25, 1] },
              rotate: { duration: 2.5, ease: 'easeInOut' },
              scaleX: { duration: 0.2, repeat: 12, ease: 'easeInOut' },
            } : {
              scaleX: { duration: 0.7, repeat: Infinity, ease: 'easeInOut' },
            }}
          />
        )}
      </section>

      {/* Story & Vision Section */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* Visual Frame */}
            <div className="lg:w-1/2 relative w-full">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue to-purple-600 rounded-3xl transform rotate-2 opacity-5 scale-[0.98]"></div>
              <img 
                src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80" 
                alt="AK Mobiles Premium Phone Showcase" 
                className="rounded-3xl shadow-xl w-full object-cover max-h-[420px] relative z-10 border border-slate-100 p-2 bg-white"
              />
            </div>
            
            {/* Content block */}
            <div className="lg:w-1/2">
              <span className="text-[10px] font-extrabold tracking-widest text-purple-600 uppercase bg-purple-50 border border-purple-100 px-3 py-1 rounded-full inline-block mb-3">
                Established Regionally
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                Our Journey & Customer First Vision
              </h2>
              <div className="space-y-5 text-slate-600 leading-relaxed text-base md:text-lg">
                <p>
                  AK Mobiles started with a simple belief: that everyone in Virudhachalam deserves easy access to authentic, high-quality, and cutting-edge mobile technology. Over the past decade, we've grown from a humble local shop into a trusted retail hub.
                </p>
                <p>
                  Rather than just sales transactions, we focus on digital matching—connecting our patrons with devices tailored to their functional demands and budget constraints. We are proud authorized partners for top brands, guaranteeing brand new inventory with valid guarantees.
                </p>
                <p>
                  From data transfer and configuration assistance to direct warranty coordination, we follow up every purchase with robust after-sales care, ensuring your digital companion is fully supported.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Stats Section */}
      <section className="py-16 bg-slate-950 text-white relative overflow-hidden mx-4 rounded-3xl border border-slate-900 shadow-md">
        <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-tr from-brand-blue/10 to-transparent rounded-full blur-[80px]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            <div className="text-center">
              <div className="text-5xl font-black mb-3 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">10+</div>
              <div className="text-xs uppercase tracking-widest font-bold text-slate-400">Years of Service</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">50k+</div>
              <div className="text-xs uppercase tracking-widest font-bold text-slate-400">Happy Customer Visits</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black mb-3 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">100%</div>
              <div className="text-xs uppercase tracking-widest font-bold text-slate-400">Genuine Inventory</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black mb-3 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">4.9★</div>
              <div className="text-xs uppercase tracking-widest font-bold text-slate-400">Average Store Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Cards */}
      <section className="py-24 bg-slate-50/50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Why Shop With Us?</h2>
            <p className="text-slate-500 text-lg">We stand by quality, affordability, and regional reliability.</p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <motion.div 
              variants={itemVariants}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-blue-50 text-brand-blue rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FiCheckCircle size={26} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">100% Genuine</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                All inventory is sourced directly from certified brand distributors. Complete box seals, GST bills, and official warranties.
              </p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FiAward size={26} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">Best Prices</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Competitive pricing structures, trade-in exchange bonuses, and special credit card/no-cost EMI structures.
              </p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FiUsers size={26} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">Expert Advice</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Our in-store technical team works to help you compare specs and select the ideal device. No pushy sales.
              </p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FiShield size={26} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">After-Sales Care</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Free setup, phone-to-phone data restoration, and seamless coordination with service outlets for warranty issues.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
