import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import logo from '../../assets/logo_dark_text.png';

const Footer = () => {
  return (
    <footer className="bg-slate-50 text-slate-600 pt-10 pb-4 border-t border-slate-200/80 shadow-inner">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Column 1: Brand */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <img src={logo} alt="AK Mobiles" className="h-12 w-auto object-contain" />
            </Link>
            <p className="text-slate-500 text-sm mb-4 leading-relaxed">
              Virudhachalam's most trusted mobile store. Genuine products at the best prices.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/akmobilesvirudhachalam/" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-brand-blue hover:border-brand-blue transition-colors text-slate-500 hover:text-white">
                <FiInstagram size={14} />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61590666747486" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-brand-blue hover:border-brand-blue transition-colors text-slate-500 hover:text-white">
                <FiFacebook size={14} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-brand-blue hover:border-brand-blue transition-colors text-slate-500 hover:text-white">
                <FiYoutube size={14} />
              </a>
              <a href="https://wa.me/917947107854" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-[#25D366] hover:border-[#25D366] transition-colors text-slate-500 hover:text-white">
                <FaWhatsapp size={14} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-slate-800 font-bold mb-4 uppercase tracking-wider text-xs">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-slate-650 hover:text-brand-blue transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span> Home</Link></li>
              <li><Link to="/products" className="text-slate-650 hover:text-brand-blue transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span> Shop All</Link></li>
              <li><a href="/#brands" className="text-slate-650 hover:text-brand-blue transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span> Brands</a></li>
              <li><a href="/#offers" className="text-slate-650 hover:text-brand-blue transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span> Offers & Deals</a></li>
              <li><Link to="/about" className="text-slate-650 hover:text-brand-blue transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span> About Us</Link></li>
              <li><Link to="/contact" className="text-slate-650 hover:text-brand-blue transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span> Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h4 className="text-slate-800 font-bold mb-4 uppercase tracking-wider text-xs">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products?category=Smartphones" className="text-slate-650 hover:text-brand-blue transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span> Smartphones</Link></li>
              <li><Link to="/products?category=Earbuds" className="text-slate-650 hover:text-brand-blue transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span> Earbuds & Audio</Link></li>
              <li><Link to="/products?category=Smart%20Watches" className="text-slate-650 hover:text-brand-blue transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span> Smart Watches</Link></li>
              <li><Link to="/products?category=Power%20Banks" className="text-slate-650 hover:text-brand-blue transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span> Power Banks</Link></li>
              <li><Link to="/products?category=Chargers" className="text-slate-650 hover:text-brand-blue transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span> Chargers & Cables</Link></li>
              <li><Link to="/products?category=Accessories" className="text-slate-650 hover:text-brand-blue transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span> Mobile Accessories</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="text-slate-800 font-bold mb-4 uppercase tracking-wider text-xs">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5 text-slate-600">
                <FiMapPin className="text-brand-blue mt-1 flex-shrink-0" size={16} />
                <span>No 113 B, Near Agarval Eye Hospital,<br />Shakti Nagar, Vriddhachalam 606001</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-600">
                <FiPhone className="text-brand-blue flex-shrink-0" size={16} />
                <a href="tel:04143261221" className="hover:text-slate-900 transition-colors">04143 261 221</a>
              </li>
              <li className="flex items-center gap-2.5 text-slate-600">
                <FiMail className="text-brand-blue flex-shrink-0" size={16} />
                <a href="mailto:info@akmobiles.in" className="hover:text-slate-900 transition-colors">info@akmobiles.in</a>
              </li>
              <li className="flex items-center gap-2.5 text-slate-600">
                <FiClock className="text-brand-blue flex-shrink-0" size={16} />
                <span>Open until 10:00 PM (Mon - Sun)</span>
              </li>
            </ul>
            
            <a 
              href="https://wa.me/917947107854" 
              target="_blank" 
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2 rounded-full font-bold text-xs transition-colors shadow-lg shadow-[#25D366]/20"
            >
              <FaWhatsapp size={16} /> WhatsApp Chat
            </a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200/80 pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            &copy; {new Date().getFullYear()} AK Mobiles. All Rights Reserved.
          </p>
          <div className="flex items-center gap-3 opacity-40 grayscale hover:grayscale-0 transition-all duration-300">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5" onError={(e) => e.target.style.display = 'none'} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" onError={(e) => e.target.style.display = 'none'} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" onError={(e) => e.target.style.display = 'none'} />
            <span className="text-xs font-bold text-slate-500 ml-2">UPI / Razorpay</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
