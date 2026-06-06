import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import {
  FiArrowRight, FiCheckCircle, FiHeart, FiShoppingCart,
  FiZap, FiStar, FiTruck, FiShield, FiRefreshCw, FiCreditCard
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

// --- DEMO DATA ---
const DEMO_PRODUCTS = [
  {
    id: 1, name: "iPhone 15 Pro 256GB", brand: "Apple",
    price: 134900, offer: 119999, discount: 11,
    rating: 4.8, reviews: 2341, tag: "HOT",
    image: "https://m.media-amazon.com/images/I/81SigpJN1KL._SX679_.jpg"
  },
  {
    id: 2, name: "Samsung Galaxy S24 Ultra", brand: "Samsung",
    price: 129999, offer: 119999, discount: 8,
    rating: 4.9, reviews: 1820, tag: "NEW",
    image: "https://www.myg.in/images/thumbnails/260/260/detailed/91/tv1-removebg-preview.png.png"
  },
  {
    id: 3, name: "OnePlus 12 12GB/256GB", brand: "OnePlus",
    price: 64999, offer: 57999, discount: 10,
    rating: 4.6, reviews: 1240, tag: "HOT",
    image: "https://oasis.opstatics.com/content/dam/oasis/page/2023/cn/12/12-green.png"
  },
  {
    id: 4, name: "Redmi Note 13 Pro+", brand: "Xiaomi",
    price: 31999, offer: 25999, discount: 19,
    rating: 4.5, reviews: 3100, tag: "SALE",
    image: "data:image/jpeg;base64,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"
  },
  {
    id: 5, name: "Vivo V30 Pro 12GB/512GB", brand: "Vivo",
    price: 41999, offer: 36999, discount: 12,
    rating: 4.4, reviews: 980, tag: "NEW",
    image: "data:image/jpeg;base64,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"
  },
  {
    id: 6, name: "Realme 12 Pro+ 5G", brand: "Realme",
    price: 29999, offer: 24999, discount: 16,
    rating: 4.3, reviews: 760, tag: "SALE",
    image: "data:image/jpeg;base64,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"
  },
];

// Brand data with official colors for custom CSS logos
const BRAND_DATA = [
  { name: 'Apple', logo: '', color: '#000000', bg: '#f5f5f7', weight: '600', style: 'normal', transform: 'none', symbol: '' },
  { name: 'Samsung', logo: '', color: '#1428A0', bg: '#e8eaf6', weight: '800', style: 'normal', transform: 'uppercase', symbol: '' },
  { name: 'Xiaomi', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://mi.com&size=256', color: '#FF6900', bg: '#fff3e0', weight: '700', style: 'normal', transform: 'none', symbol: '' },
  { name: 'POCO', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://poco.in&size=256', color: '#1a1a1a', bg: '#FFF9C4', weight: '900', style: 'normal', transform: 'uppercase', symbol: '' },
  { name: 'Vivo', logo: '', color: '#415FFF', bg: '#e8eaf6', weight: '700', style: 'normal', transform: 'none', symbol: '' },
  { name: 'Oppo', logo: '', color: '#1E8E3E', bg: '#e8f5e9', weight: '700', style: 'normal', transform: 'uppercase', symbol: '' },
  { name: 'Realme', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://realme.com&size=256', color: '#F7C948', bg: '#fffde7', weight: '800', style: 'normal', transform: 'none', symbol: '' },
  { name: 'OnePlus', logo: '', color: '#EB0028', bg: '#ffebee', weight: '600', style: 'normal', transform: 'none', symbol: '' },
  { name: 'Motorola', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://motorola.com&size=256', color: '#5C2D91', bg: '#f3e5f5', weight: '700', style: 'normal', transform: 'none', symbol: '' },
  { name: 'Google Pixel', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://google.com&size=256', color: '#4285F4', bg: '#e3f2fd', weight: '500', style: 'normal', transform: 'none', symbol: '' },
  { name: 'Nokia', logo: '', color: '#124191', bg: '#e3f2fd', weight: '800', style: 'normal', transform: 'uppercase', symbol: '' },
  { name: 'iQOO', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://iqoo.com&size=256', color: '#FF4500', bg: '#fbe9e7', weight: '900', style: 'normal', transform: 'uppercase', symbol: '' },
  { name: 'Nothing', logo: '', color: '#000000', bg: '#f5f5f5', weight: '700', style: 'normal', transform: 'none', symbol: '(1)' },
  { name: 'Honor', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://hihonor.com&size=256', color: '#00A4EF', bg: '#e1f5fe', weight: '700', style: 'normal', transform: 'uppercase', symbol: '' },
  { name: 'Infinix', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://infinixmobility.com&size=256', color: '#00BFA5', bg: '#e0f2f1', weight: '700', style: 'normal', transform: 'uppercase', symbol: '' }
];

// Custom CSS Brand Logo component — renders brand name with official brand colors
const BrandLogo = ({ brand, size = 'md', showBg = false }) => {
  const sizeMap = { sm: '0.75rem', md: '1rem', lg: '1.25rem', xl: '1.5rem' };
  const fontSize = sizeMap[size] || sizeMap.md;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        fontFamily: brand.name === 'Nothing' ? "'Space Mono', monospace" : "'Inter', sans-serif",
        fontSize,
        fontWeight: brand.weight,
        fontStyle: brand.style,
        textTransform: brand.transform,
        color: brand.color,
        letterSpacing: brand.name === 'Samsung' || brand.name === 'Nokia' ? '0.15em' : brand.name === 'Nothing' ? '0.05em' : '0.02em',
        lineHeight: 1,
        userSelect: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {brand.name === 'Apple' && (
        <svg viewBox="0 0 170 170" style={{ height: `calc(${fontSize} * 1.2)`, width: 'auto', fill: brand.color }} className="mr-1 inline-block">
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.37.13-9.13-1.9-14.28-6.07-3.43-2.77-7.22-7.39-11.4-13.84-8.8-13.56-15.54-28.52-20.2-44.91-4.66-16.39-6.99-31.13-6.99-44.22 0-14.92 3.86-26.68 11.59-35.32 7.72-8.64 17.15-13.06 28.27-13.27 5.03 0 10.63 1.5 16.79 4.5 6.17 3 10.37 4.5 12.61 4.5 2.11 0 6.26-1.5 12.45-4.5 6.19-3 11.91-4.43 17.16-4.3 11.87.26 21.6 4.38 29.21 12.35 6.46 6.81 11.02 15.02 13.68 24.63-14.39 5.92-21.36 15.69-20.9 29.3 0.46 10.3 4.29 18.89 11.49 25.77 7.21 6.88 15.86 10.51 25.96 10.87-2.64 8.44-6.04 16.48-10.2 24.12zM119.22 28.74c0-7.85 2.81-15.07 8.42-21.65 5.61-6.58 12.32-10.26 20.14-11.05.13 1 .2 1.91.2 2.76 0 7.49-2.88 14.54-8.63 21.16-5.76 6.63-12.77 10.37-21.05 11.23-.26-1.12-.39-2.12-.39-3.05z" />
        </svg>
      )}
      {brand.name === 'Nothing' ? (
        <span style={{ letterSpacing: '0.1em' }}>Nothing</span>
      ) : brand.name === 'OnePlus' ? (
        <span style={{ backgroundColor: '#EB0028', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: `calc(${fontSize} * 0.9)`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>1+</span>
      ) : brand.name === 'Google Pixel' ? (
        <>
          <span style={{ color: '#4285F4' }}>G</span>
          <span style={{ color: '#EA4335' }}>o</span>
          <span style={{ color: '#FBBC04' }}>o</span>
          <span style={{ color: '#4285F4' }}>g</span>
          <span style={{ color: '#34A853' }}>l</span>
          <span style={{ color: '#EA4335' }}>e</span>
          <span style={{ color: '#5F6368', marginLeft: '4px' }}>Pixel</span>
        </>
      ) : brand.name === 'POCO' ? (
        <>
          <span style={{ color: '#FFD600', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>POCO</span>
        </>
      ) : (
        brand.name
      )}
    </div>
  );
};

const CATEGORIES = [
  { name: 'Smartphones', image: 'https://api.samsungmobilepress.com/api/v1/file/FC05AE750AD6EB0673D9E9D4C157D4FDCA91C0319D37B2827A4ACC850D3D124959298BB89A1D18EEB9531CE7B6BDB56BB43890C99A07EF46FFD865333FEC385C3A4ECDA52E32E217D32C2807BAAF403A9124FE24BD2AD9F141EA995A91D14E9095EC253173B6A26FE1DB745A586CC1ADDE7D6D440FA45C94CA365A5CF1A540E7', color: 'from-blue-100 to-blue-50', count: '500+' },
  {
    name: 'Smart Watches', image: 'data:image/jpeg;base64,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'
  },
  { name: 'Earbuds', image: 'data:image/jpeg;base64,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' },
  { name: 'Bluetooth Speakers', image: 'data:image/jpeg;base64,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' },
  { name: 'Chargers', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJatCBW5zgYBh0d3y7j6AIxki_WayFR7RaTg&s' },
  { name: 'Power Banks', image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAPEBUQDw8PEBUQFhIWEBAPEBUQFhAVFRUWFxYWFRUYHSkgGBolGxUVIjEhJSotLi4uFx8zODUsOSgtLisBCgoKDg0OGhAQGy0dHh0uLy01LS8tKy0tKy0tLS0uLSstKysuKy0tKzcrKystLS4tLS0rLSstLS0tKy0tLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAEAAQUBAQAAAAAAAAAAAAAABAIDBQYHCAH/xABAEAACAQIDAwgIBAUDBQEAAAABAgADEQQFEgYhMQcTIkFRYXGxJDIzcnOBkbIUIyViNEJSdIJDU6FjZJKzwTX/xAAYAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/EACIRAQEAAgEDBAMAAAAAAAAAAAABAhFBAyExBFFh8BIycf/aAAwDAQACEQMRAD8A7jERAREQEREBET4xsLnq4wPss4nFU6QvUqJTHa7hB9TOE7VcpmLxVd6FCv8Ag6QLKi0joq1dLFTqqcVO47lt4nr1OpS1uXqXdut6l6j/ADJuxmvxTb0kdqMvBscwwV+z8VSv9NUyGGxdOqNVKpTqDtpuHH1E8rVMSQpanh3ZRuNStahTve27Vvff1Cx7pOyMknnKSVcM4sQ9Nil/Bls1u42k0beoYnHsk26zCgAKhp4xOov0Xt3Oo3/Q+M3fKNvMHXstQthn3XWsOjc9WsbvraLD8o2qJTTqBhdSGB4EG4PzlUikREBERAREQEREBERAREQEREBERAREQEREBLGP9lU9x/tMvyxj/ZVPcf7TA827M7O0s0wArVlfnKdQ0TWp8TpVSupQDqOllHqi9t7yNiNl8fhQDhqq4mney02Ivf8ApUXKs37aTsZsfJPV05U/92//AKaU2qrTBLEWeyjU6Eg6ewtuOnuO6bkt8OWWWM8uUUs8FNzTxdGph23BuiWG7hqU9Jd/jMnVyunjgCuKqNTFtVOi66P8ltcHvabnisHSqroqIlRQNy1FFl92wIQd1NUJ62mrY3YijcVMNVq4SpcWIJ03PZ0rqb8FV6rcN0f1UzLMqpYRbUKTHWd51Mwv2txsPATN4Sgzk84i2ABVgTe547iLrbtvv7BNVXH5pgr/AIjDpjaaevUp3WogPDXYXTd/uIDJq5zleZoKNarUoH/brO2Hvw/nU823+UbRsGXZ5h6FXmsPmFOk/wDQKoIJ/pvfSWv26j3TdMHtRiE3V6QqDd06fXfw8yFE57S2EwgsebV1/kprakpH7qgDNU/yvMni82oZRRSmaFV9RtSpYTD1CvSPRXWxK6vnf9ok0s+HTcDnuHrAaagW9wA+65HYeB+RmTnBcPt3UeuExGVledsEWjVviPBxuH+LFfAzf8oxdY01q4epVVWv+ViqTUW/yVl3Dsso6t8mmtt7ia3R2lZLDEUSOA1LYddh1lbnqAYnumawOYUq4vTe9vWUgqynsKneJNLtKiIhSIiAiIgIiICIiAiIgIiICIiAljH+yqe4/wBpl+R8f7Kp7j/aYHn3k0qacqbj/GPw+DSm1Vq4Y1T0KmlAdRtQZT12S/SPbxvNI2GrhMrO/f8Ai3NgbG3NUwD4XB390z9fNEqc6wqBvy1C/ihqqEjdZGXdcd/VO3T8PH6je595Z3IatSoVptS1U6jW1lT0CeJDDhLWXqtW686Ee9lVhYP3ahwMiYDHVGwiDC1wj0RV52nr0O6k6gVB9YAX75icqxp5+n1nWlgevpCa9tuUt3nZdfflLzjGVMOgKoeixUXU6adr6tNt1M9V1s2/jMBicbgsVuxeHAY/6qDfw62FmG/rbnTN9oNiajUxR082cXilxlNih10TWQEhW9YKNW8bxec6yX8HWqtha61VepV0UK1JgdJZtKqyNuK3tv4xl0/Y6Xq7ZblN69kjL8sxGHBfKcxOkb2oVGDoBx6VwVUfuqrTMy+H2/xOGsmaZewVhurYcXRwexWurrbrVpqNHJ8QWqGibthqjpem+lwyXuyAbwLA7xJOX7SYqjWWhiEFQPURaiVlKudRC3ciwqHfxqB5zuNnl68epjldS7ro2S7T5NUUjD4nD4ZiNPSVcM6XG7Tzg07r7gLjumXw1DBMyu2Jo1nUgrUNddVxws4bV27gbb7WnG9tThaGJK/gKFt99NSqhv2jQVUeGiS+TupSOKFTD4c0ioJJ/EFrgXJAuu7h3yN67bdT2p2zweAQ87rqswsKSUydd+okgCx+cxeyu2YvhKTo9PEVsRTprSbe60LLTBqdl1Utv6zu4kyrNsGuLqCrV6Jtwpt0vnVsDbuAHjMQ+Hp0sflqUkVB+Mp9FRbqO89ZO/id8WJHdYiJh0IiICIiAiIgIiICIiAiIgIiICWMf7Kp7j/aZfljHeyf3H+0wOE7D5FTxGTIxOkms/V12AB8e8g26hIWYbM16QJTpAdhuP8Ak7veYjuE2Hk1P6KnxXmaWpNue3JqxqU9zKw6+vh29oHeQJPybaephQQFp1EY30VEDWbqZW4g+BnQsVgaNUWdF377gDj29hPeQZrWZ7Eo1zSPH5N9Seke9j8pZbGcsMc5rKMdlm0+CrVqH4uu2GqYTEPX1aC1KqKjo7oSOkp6O7daQticwxK1tSYRK+Fq4tQarUQ/Mu1RQHVx0kIBB7N01/N9jMTSJIBbibMDc9pBtw/cQomKy7MsZl766FSrh2YHepsHHhwYfWanVvLhl6THVmPPv926Js8w53GazSv+LxG9wUJsw4VR6vWQOr5zWtpWIzWmDr9fDe0ZWbivWu63ZKdkNp6WHDriDUvVdnaqAKm9gOKt36iTxN5HzjEU6mZ03pNSdS+H6VJSik3W/RPA9s6Z5y9Ps59HpZY+ots7aX+Uc+kt7x85P5LfaN7r+RmO5Rf4l/eMyPJb7RvcfyM8/L3X9W255jn18xSfEM2hTzOEpWfpXs1TEv0KSbjwBO47xMRs5lNbC4vLxiGDPUx6ObOahF0UHU5G83U8LjvmyY/NBT6C06tdwoY0qK30rb1nY2VBu4kzXNns6bG43AVGprTC49FVVYtu0K3SbrN2PUJUj0bERMOhERAREQEREBERAREQEREBERASxjvZP7j/AGmX5Yx3sn9x/IwOM8nTWyRPivMoKkw2wLWySn8VpPDzbmnK8rDyEKkuCpAlsFYWYBgephcfQzE5jszh64PR0luNxrBPaQeJ8bgdknrUlwVIHNc45OiLmkD/AIdIeFj59ECaxhsjr0MTS1JqAqUzqXsDi5A4kDtFx3zugqSqhltDEOFq01bURc23kjhf+q3fcSaXdcW5QmviWI33J3zJcl/tG91/Iy3yp4NaWNYL2m5sAT4hQB9BLnJnhBUqP03WyOd2k8FJ4MCP+I5OG45lgUrvpqNWrABfREYinq4hqirYEm241CF6paFDRj8tWyU1XF0tNOmNy2v2WA6twFh2mT8xz3C4KlerVp0zp6FCnYMQR/KgG4fITXNnM2qYzF5fWqALfMECAKVAS27iST28Txl3KzL3ejYiJh1IiICIiAiIgIiICIiAiIgIiICWcb7J/cbyMvSzjfZP7reRgcO2FP6KnxWksPIGxJ/RE+M8vB5tzTFeXA8hh5WHhU1akrFSQg8rDwiaKkyWRv8AnL4zBh5lcgf85fGBy/ld/jn8ZXyVe0qfDqfYZa5Wv45/Ey7yVe0qfDqfYY5W/q2uvkNOtWFcrQDBEXnqq8+y2G7m6TDmwevUwfuAlqpTRMyy9UZnIxtPnGqOXctp/nubjdaw6hawEj51neLRjh8JhwStNGqYuq4p06IYfzO1lX5nf3zGbLYB6GLy9XZXLY9W1orIrXXeVDAEre4vYA23bt8ks3eyTb0lERMuhERAREQEREBERAREQEREBERASzjfZv7reRl6Wcb7N/dbyMDguxrfoifGbylYeR9kWtkqfFbyn0PNucSw8rV5EDysPCpYeVh5DDysPAlh5ltnH/PXxmADzMbMt6QnjCVzzla/jn8TLnJX7Sp8Kr9hlnlYPpz+Jl3ks9pU+FV+wxyt8N65imStRk1sgXm9ZLLT3G5VCbKxvxFiZjalUPmWXEEG+Mp7wQd4vfhMRtVjKgq06KuyoUpMVU21FsRTQ6iOI0ki3DfI2xA/Myn+9P3GVI9LxETm6EREBERAREQEREBERAREQEREBLOM9m/ut5GXpZxfs391vIwPPmyrfoqfGbylAeU7Mt+jL8ZpZDzbESleVh5EDysPCpQeVh5EDyoPAlh5mtl39ITxmuh5m9lG9ITxhK0flV/jn8TL3Jb7Sp8Or9hkflTPpr+Jl/ku9pU+FV+wxyXwy2eYTXXpsFqVSaarzVNSWOmoKisG9VekovqIFvpKNmsA+GxOVUqhUsuLBbSbgaiTa/XJmaZ4cOVpqmpnVDdjYKrVEpg7t5N24buHGY/ZXGVK+JyupVILNjN5AAFgTYWHYJakekYiJzdCIiAiIgIiICIiAiIgIiICIiAlrF+zf3W8jLstYr2b+63kYHnHZ1v0dfjN5SNrlzIGtk6/GPlIgebYSQ8rDyKGlQeFSg8rDyIHlYeBLDzObJN6SnjNbDzO7It6SnjCVqPKkfTX8TJHJd69X4VX7DIvKf8Axr+Jknkx9ep8Kr9hjkvhKz+kz4qmFUm9Knp/doxCOwHaQqk247pTsMfzsq/vD5mZjHUabWatUdUC9JA2lWtvubdI8eANu0GQtnsZTrY7LWpLoQYxVVdIW2m43AcBLSPR0RE5tkREBERAREQEREBERAREQEREBLWL9m/ut5GXZaxfs391vIwPM+St+kL8ZvKQdckZQ36SvxW8pA1TbESQ8qDyMGlQeRUoPKw0ih5UHgSg0z+x7ekp4zWQ82DY5/SU8ZUrWeUw+mv4mSeTM9Op8Or9hkTlK/jH8TJPJoenU+HV+wxycMpmiVGYotJKgemgDOpPN2LFtJboIT0elZnFuiBvMbM4H8Pjctpkhj+MDEjhdrmw8N0kVcSAdOqxCauGrjuUW7yDv7FPHhLWQVi+YZcWtf8AFqDbcCVLLcDq4QR6OiImGyIiAiIgIiICIiAiIgIiICIiAlrFezb3W8jLstYr2be63kYHl3Kz+lL8U+Ux+qTMtb9KX4reUxuqbZi+GlQaRw0qDSCQGlQeRw0rDQJAabBsa3pKeM1kNNh2Nb0lPGUrBco59MfxMlcmvr1Ph1PsMh8op9LfxMlcm/r1Ph1PsMcpwm5iul+cLoiMqKSxIIK3tpFulfVw7pd2XxSVcflzU9Wn8UoGridNxf5z5iRUJYIVC1EVHJAuANRI1etpNxdQVvYXO60q2Zwq0cwy6mtyBi1O/tNyYpHpSIiYbIiICIiAiIgIiICIiAiIgIiICUVV1KR2gj6iVxA8qYem1PLdDAqyVnVgepl3EfUGYfVOt8qexOIpc7iMJTNWhWc1qtOmup8PUPtG0je1Nj0ja5U33W4cg6rixH9Sm4+vUe475rbOl0NKtUsAyoGFSA0qDSOGlYaBfDTYdjW9JTxmshpsGxjekp4ypWJ5QT6W/iZL5OT+ZU+HU+wyHt+fS38TJXJ2enU+HU+wxynDKVtbMESwsupiW07r2uDx3dg4kqOF5IyP/wDTy/8AuqfkZYFzYAEm3Adw3nuHfK9nagfM8vI4HFJ3cL38opHpOIiYbIiICIiAiIgIiICIiAiIgIiICIiAmj7Wcl+X49mrIGwlduNfDdEMf+pT9V+/gT2zeIgea9puTPMsDduZ/GUh/rYMXYD9+HO+/u7u+aYBe+k6rXuBxFu1TvH0tPY81rajYTLsz6WIoAVB6uIonmqo7OmPWt2NcS7R5dBlQM6PtRyQY7D3fBsMfT/pNqOIUfPo1PHieyc6rYdkc03V6dRfWo1kNKovcUbf8heUA02HYxvSU8ZrV7f/AGbBsafSU8ZUrH7en0t/EyXyenp1Ph1PsMhbdn0p/EyVyfn8x/h1PsMcpwlVcQVqEb99NNIA472LW+YX6CTtlltmeXj/ALpSfE6ifOWFKm2rVbjZTbUQNwJ6he17b7X4cZmuT7L2xGb4WwuMOalep+1VQqp/83QfXsi+Fj0JERMNEREBERAREQEREBERAREQEREBERAREQEREBMVtBs3g8wTm8ZhqdYdRYWdPccdJfkZlYgcU2m5FqqXfLcQKq9WGxZsw7qdcf8AAYW7SZpGVYSrgcbTpYujWw1RmsqVlsH9yoOi438RPUUjZhl9HEoaWIo06yHilVA6n5ES7Sx5M24a+Kfcd5PEEH6GTNgL86ygEko4AALG5UjgJ3nFck2SVDc4HT3U69ZB8lD2H0leC5KslotqXAq3dVq1aqnxRnKn5iNmu2nKci2VxePbTQpjSps9UsObSxIINQXW4t6q6m6iF4ztOx2ydDLKRWmA1WoF5+vaxqEcALkkKLmwJPHiTvmeo0lRQiKqKoAVVAUKBwAA3ASuNmiIiRSIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiB//2Q==' },
  { name: 'Mobile Cases', image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxITEhUSEhIVFRUXGBcYFRUVFxUVFRUXFRgXFhUVFRUYHSggGBolHRUWITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGislIB4yLS0vLjYtLTAtKy0tLS0tLS0tKy0tLS4rLi0rLS0tLS0tLS0rLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAACAwEBAQEAAAAAAAAAAAAABgQFBwMCAQj/xABDEAABAgIGBQkFBwMEAwEAAAABAAIDEQQFBhIhMSIyQVFxEyMzYXKBkbGyJDRzocEHQlJigsLwktHhFENTohYXYxX/xAAbAQACAwEBAQAAAAAAAAAAAAAABgIEBQMBB//EADERAAICAAUDAwQBAQkAAAAAAAABAgMEESExMgUzcRJBsRMjUWEiQgYUFSQ0YnKR8P/aAAwDAQACEQMRAD8A3FCEIAEIQgAQhCABCEIAEIQgAQhCABCEIAEIQgAQhCABCEIAEIQgAQhCABCEIAEIQgAQhCABCF8c4AEnADElAH1fJrL6xtTEpMR11xbCBN1gwvDe/eTuyHzVW6sqU8F8AMYz7romiDI5gZy68iuf1NdEaS6c1BSnJI2GPHawTcQB1+Q3riKe3cZbzIfVZzUdZxYz2CM+84DYZtBOd3qyE9sl0tDTGzcYsRzYTMJNMi4jAzPGYAEsjjvx/wDEL7sQ6qIrJe7+fBwlRCCzkx6rGu4MFoc84nBrRi5x6v7qpj2rDG333WDcZk+OCy9lOa6K0wy4wzItLjeJmBMg7p5JhrR0FgMSO0PDAA1jsW3i0OJLTgTIiU8pHgtqlTaSlln+tjAxGIslb6K3khk/9gQCxxYQ9wyAmMTgCepeIdfP5N0aI7AY7mjgFl0CtmUibocCHBDXFvNtay+MCC4AbMfHYnyq2gwYV7IPvH9DSR4Oun9K65G9g63CnOzVnQW2pTDN1Ei3N5Y8YbyLuHeusf7RWxIY5Fpa4mRc6WEs7oyJ8ln1p7dxxEuUd4YBiTda48DeByxUSFW8WkhsaKQXnAkANndJbOQwmQ0ZLrVBOepGU4T0UdTUP/0oohgsBiRHYNExMmU83GQEgSScAAoYr+tIWk6il7P/AJkRPkwklcv9byNE5XGd26JZ6b2NmOsZ9yzqk1hGivdHc8hwcJSdIsnMtDBO8AJHEZYTzE+1klF5ZJnGTyNYq/7SYJN2M0w3DMOEiOO5W1Z2ygMhB8Mh7nGTRPDeXHqH1HFKlmqwh02je0MZEewljr7WmcgC14ByJB2bQcksWgZAZFlR4bobZaQcXYumdJocSQ0iUvJeKFcsnkcLp+mDaNDoFeuc0xHuJ+Q7gMF8/wDMIkM87R4zW/iLHSHGY0e9U9lYoEG+7Jpn/S1zvNoPcleubU0p8VxhRHsbDlO4SBmAHHeCSJA75L230x/pKNEZz19TRqtW2wosaUogBOw4H5q8hUhrsnArMqg/09YQS6NBZyzTdiOaOTcdrXXmSMjjhlMHYq+OItHMR1EjRua0nwIwBvw/xwiM24HAifkef0oS2eR0+tbDks8jYl8DhvWXwrbPjCG3VbIF29xOw9Q3daZHV2Q0XAFjYjHwpscGs8jUw9TvipR9xtQlmj2llg9veMfkVa0WuYT8nCe44HwKnVj6LNpZeSdmFthuixQvLXg5FelbTT2K4IQhegCEIQAKutE6VFpBH/DE9BViqy0/udI+DE9BXj2J1815Maq2JIRJbGuPeAUufaHXDugYbrBo4YTAa0y8T8lf1dqxeyfmly2NAL4hkJh0sNoIGY7vl3Ecoe5sdQTcEkaBZZvPN6pJd+0uM9zS1uM7zpDbi1x+QcU1WZbzw4patgwOYHEykGmeUjISM981hdG1vsf6KGL0iiDZ0TZRvhw/SFa29cTDLZyF8TPBl0E9U5T6pqDUA6DboM9IV5aCAHh4dled8if7Jkq3FqHfzEqxbXck8PbK6+WQmcAZk7c8+oLUIZ9nYBuf6Qs5s69hbEDHBzRElMZEhrZy6sVo1HPMwuET9imtxpr7Ji9e0Z7HlzTJzdFzSQ0ylIObPNpGffPAidtZ0HkIcxLWw/W5FsK7gCMWcjfIzOXdns858T3qqOx7GOhtutOTd2JB+c1Zqy9e5Tjl6s0aHT6GYlCuDMtw6iDMHxAWb0xhmTgx33mEGUxtZhiDmtTFNbBovKOyazLrmfLPuWb0y10R0YvEGEYYODCJkgbb+d6W0YdWxeWtZ6kJDBUThQ6G6LGdK+b0tsgJDPbmq+lV6KYWxrrhcaIWlKZLCXB2BwweMOrrUS2dP5ejw4kKd0tcQ3CYcJTacdgD59nBVVl4wdBMgBJ5HE3WH6y7lKHJIp38DVLNMvUcg/eMj3sekCsqse15bhfZNt0kNvs2OYThOWY/h0WxkjCE/wAQ9L0r2itcwRS1tHhxJHC+Dq7MQcz8spGUz7dl7lfDer2LGwtGNGo8WPGIaIhbLESkwPOBnIiTiSchI7ivtYWsokbnIZPKMY5pvNu32ktMxPE6owzVbaeuRSqJBdBEgS9jof4XgNdd/pDpHaCs9rCNJrS3ObR44HukuMmo5fosJOalnuxkq5+MOWxrR4LR6EJw28Fl9n33mwz1LUqB0beCTMb3X5fybfTdInp2HFRnNUh65OVFm1E9QKdFZqvPDMeBThZ2tDGYQ7XaRPrByPyPgkkq9sa7nXjeyfg4f3V7pt84Xxjno9CrjqYSqcstUN6EITUL4IQhAAqu1HudI+FE9JVoqy1HudJ+DF9BXj2J1815RidBfJsTh5ZqgtbWh5ZsJpkDEhhx3ibSRPZiQrqiPwJImMQRsIxBHBLVdwQ54niC5pDsLwIIAPE4AjCcgRkuEZJZo28fVKVakvY1Czj5RRPekL7R4ruTDBPBrZ90w6fcJd/WnSqRpukqe21Xl45Vkr2N5pkL085TwM9oMscZzS70zERpxElL+pFHEwcop/giVG+XIn8jPSFJt3Fdce1mZcSCM8QYgP8AST34KvqdsuTEpc3CnxukGfgB3KytIwRIcibrhkcROWIxGIIOR/gaoMVFNQvzYr2EcORcMjyh79Fv87lpLiTRSBmA4d0Rsp+IaO9Z/ZqGQyJMATiCcpSOoZ6JlPhLLJaTVjea34SIORBzBU08htoylUv2YdX8ItjOe4GUXSDtxniAd4IIPemKzg5mH3/NxKvrUVDDk5zXluMyx2qTvJk4HdqzwzKpqtbdDADPZMGY7sB5BWKORVdThIda+a51AEpm6dIDOWBw4i/4LOKROGCx07pIewjVcJHEeK12iMlDExNrhJzTtH0O2ap41mod69DiACc7j3xIXzYHNce5q621NvNHCUcxPo1CcKDpTBvue3MFuDRMbjNp4EKJZgDk4kj/ALrssMbrJ4f2TbaKE8QyxsGYAlOG+E5ol1Fwd/1StZ+FdZE0S08o4yIIMy1mIn9F7COTRTxKaiabZU8y8flJHgQfkSe5ZpWUAsLp5aTHGUy1169PI3Zkg4YyMtq0qyZIhgjMKRT7Oworr7XNY45tdNo7ntnhuBaZTwXtscylRb6HqI9jauMaBSAZhpcwtP5he0m9f+FSV7VmjEeIkN91xY4sGleGsHYyDscSACZ9a16FQnQodxkAEbeSiw3Ena437pJSBa6g8nDiNh0eM0xHF7iYb7t52ZvYjZkFx9H8cix9b+Ta9yisx0cL+bStUq482Fk1S0lsOFDvGUy4AYzwcZnqzGPWtVqh84TSEl4+LVjf7fyb3TZZkh65OXV65OWa2bkTmVc2SPP/AKHebVTFW1lj7QOy7yn9F3wT/wAxDyiGKX2ZeB2QhCcxYBCEIAFXWkHslI+DF9DlYqvtF7rSPgxfQ5ePYnXzXkwmjZO4nzKWqcefZ2m+oJlox0XcT5lLdOYeXYdz2Tyw0hmNio2DVLtGmVO3SJVbbA6CsKoiTcTKWcp4HAy+nhJV1sNRKsNL0jIs4lNVmszsQ/IqbaDUPBQKsdNzc8A0eDZ4f1KdaE6B4J3jsJF3MpbK9G/4v0YtMqoc0FmFlX824YzMUywOxrCZnZgNq0+qujCmthywfZj4Fq1/Ru4JYqpsmwyf5/lNFsMIbilOrXzucJnqmcPr4FWaOR5eajQ8YbeC5R2LpV55tvBfKQr5TFavGyaUsVCdCJ2z6Wppr7VPBKdQuk1/xPMNRL2KmK4Gm2S6NXhaqGyB0EwFQluY5wjMkEpWojPDHSccjtTdGSharUdwKnA5WbCTVQBh4ic+VGP6ifp4LTbOGcBqzOpcWy64nl/laRZUzgNSF1PnLy/ljb0x6rwWblycuz1yIWO2MMTmArSzbpUlg7XpcqslT7PH2mHxPza5dcLLK+H/ACXyeYhZ1S8P4H1CEJ3FYEIQgAVdaP3Sk/Bi+hysVAr/AN1pHwYvocvHsTr5IwmC2QO5L9PpE4zAGym9kz+sHzTEHzmlele8Q+2z1BUbHoxqsX2zS6s1iq22J5sqzqzWVVbLoylSrvxMm3iVVCzZwHkpNoOjPBR6FmzgPJd7QdGeCeI7CNbyKiyXRP8Ain0sWmVVhDHBZtZFsoTyf+U+hi0irDzamth0wnZj4Fy2r5wyOKVaqOhD4BMttOjclqqdWHwCtYfkRvNMq7o28F9pC+Vd0beC+0hXimLFfap4JUs6TKIBtd9AmuvBolLFQaN/fP6f4RLdFPFcDRrJGTSCr9xS5ZQ4JiKhLcyDlFSlanUdwKbIqVLT6juBU4HGzYQ6lY4g3XNEnkOvbWuDZy68PmtOswyUIBZjUBxidv8Aa1ajZ3o0h9V7kl+xs6W9V4LBwXi/LYusTco7lhyeWwxQ1ObiplRu9ohdrzmoRUmqDz8Ltt8wiiWV0H+18nS1Z1y8P4NFQhCfxSBCEIAFAtB7rSPgxfQ5T1Br33aP8KJ6CvHsShyRhDPvJapI9oh/EZ6gmZn3ktUn3iH8RnqCoW7DbZ2zS6uGkqm2XRlW1XayqradGUqU9+Jj28Srog0m8ApNekBhnuXCi6zeAXa0I5s8E8x2EazkU9kzOG/4p9LFpVV9Gs1sl0T/AIp9DFpVV9GprYdMH2Y+BYtp0ZSzVWrD4BM1tOjKWaq1YfAK1h+RG/c0urujavUdeat6Nq9R1eKYt14ZNdvkk+oTjE4jyTfXuqeCT6h1onEfVEt0VMV22aPZM4JkKWbJlMxUJbmMcYyVbSjQPApqjJXtGNE8FOByt2M/qLWidoeQWpWcdzYkstqXXicQtOsydBInV+7IaelPUtnrg5SHqO9YExlgcXLrVp56F8RnqC5PXqhmURh/M3zChW8rI+Ud5awZpiEIX0QTwQhCABQq6Hs8b4UT0FTVErYcxF+G/wBJXjJQ5IwZn3kt0n3iH8RnrCZW7Ut0ke0Q/iM9YVC3ZjbPtmlVdrKsto3mnT3GStqubJ2Kp7a9GUq09+Jj28Sto2s3gF2tB0Z4LjRtZvALtX/RngniOwi28imsl0T/AIp9DFpVV9Gs2sl0b/iH0sWk1V0anHYdMH2Y+BYtp0ZSzVQ0YfAJntoObKXarwYwbZD6K1h+R5eaPV7ZQ2719jrxVh5sL3GV4pi3XmqUm1GdOL+j96c67GiUmVL0sX9Hm9Et0VcV23/73NEsmUzlKtlDimpRkYpyiBLVoholMsY4Jbr4aJUoHK3Yzup+kid31WmWXOgsyqnpoo6m+blpdlDopH6wvuyGbpT1RdvXB6kxAo70uzGatnB6+QcwdxC9lq5PK5LR5llarI1BC+Ar6vownghCEACjVkOZidh/pKkrhT+if2HeRQex3MDbmVQ0uCeXYd0SHP8ArAwPFMLWZk+CXafHcYzAThfZ6hms+zZjdPtmj0E6SqLadGVb0HWVVbPoylOnvxMi3iVlGzbwC7V+ObPBcaLm3gF3r7ozwT1HYRLeRS2T6N/xD6WLSanHNrN7JDm3/E/a1aTVGDFOOw6YPsR8C5bVsoZKVarOjD4BNNtnThlK1V6sPgFaw/I8vNJqvowvcZc6r6MLrGV4pi7XORSVU3SxODfNydq4yKS6nbz7x1DzKJexVxPbY/WUGKa3YJTss6TsCmtyjIxfc4xUvV4NEphiqgroaJUoHKzYzerenicB5uWkWTOCzmhD2h/D6laJZJJPWl92QydKeq8DG9cXMUlzVwc4pdl+xmg/wRnri4Lu4LkQqzLcWaVRzNrT1DyXRcKCZw2H8jfILuvo0HnFMUZLJsEIQpEQXGmDm39l3kV2XiONF3A+SD1bmAgzJ4Jap/Ts7bPUEytz7ktVmZRWn8zfUFQs2G+fbNMoWsqu2Q5sq0oWsq62A5spRq78THs4lPRPucB5KTXg5s8FHon3OA8lKrl0oZ4J7jsItvIprKCUN++/+1q0OpzoLOrJ6kTt/tC0WptRTWw5YLsR8C9bMc2UrVVqs4BNdshzbkp1XqM4K1h+R7eaRVfRhdYy4VT0YXeMFeKRQ1q2YKS6AZR3gbj6k71qdEpEoB9ocPyn1N/uiXsVsR22Pdl9ZNxSfZg6ScHKMjE92cYioq5GiVexFSVvqlSgc7NjNqN7y7gfNaFZALPWe9nsu9TVoFk34ySZ1xfdkMHSXxGqKozwpT1HeliYz1nBy5OC7uXIhcGWos0CqjzMLsM9IUpQqlPMQ+yPkpq+h0POqL/S+BWt0m/LBCELqcwXl4wPBekIA/PzM+5LFdGT59Y800MGPcla0OZ4FUZjhLgafQ9ZQLXDmyrCh66iWslyR2pPr70TIs4lDQxgzst8gpVdDmzwUWg6sPst8gpVcdGeCfI7CJfyZS2S1Inb/aFolSaizyyY0YnbHkFodR6imhywPYj4KK2Y5tyUar1GfzanC2Q5tyUaobNje/zKs4fke4g0SqOjC7xVxqmXJiXiu8RXykUlajApDog9qPZd6mJ+rTIpCo49qPZd5tRL2K+I4MdbNa6cykuzuuE6FRkYb3OMRUtajRKu3hU9b5FSgc57GZuHtfc79qerJHSSNSPex3+Sd7KnTSf15fdZu9JekRzeuDwpDwuLwlWQ0QZHcFzIXZwXghcmizFjrUB9nh8D8iVYKss2fZ2fq9blZp+wjzw9b/2r4Fq/S2Xl/IIQhWDkCEIQBgJGkUrWhGJ4FNTtdw6z5qgtNR5Bx3ZHfj/bFUpIcM/4GiUMyI61CtX0ZUmrvu8B5LjahvNlJy7yMifEXqv1IfYZ6QplcdGeCiVeObh9lvkplbDmzwT3DihGxHNlJZHKL2h5LQ6j1Vntkf8Ad7TfIrRKhGC6LYb8B/p4lLa9s4bko1Y6TGgb3eopytk2UM96San1G8Xeoqzh+RLEGiVN0YUqIolS9GFLiK+UimrMYFIcL3rud9E/VlkUgs977nfREtkV7+DHKzx0wnWSS7Osm/wTo8KMjDe5yilU9ZjAq3eqmshgVKBznsZnWGFKZxPpKc7MHTSbWw9qh9o+lycLNnnAlH+0C+6/Bt9IekR6cuLlIcF4uJUazGiLyIxC4xF2euEV4GZXKRZgOFlz7O3i7zKtlAqOjlkBjTgZTI3XjOXzU9PuEi40Qi90l8C7iGpWya/LBCEKwcQQhCAMXthVZo1KeCDdiOdEhnYWuMy3i0mXgdqSq/beX6PreqYNJh8nGYHNzGxzT+JrhiCkGsvska881THMG58JsQ+LXM8lXsqfsbuG6jX9P02aNFJZ6mCJAhRBndAd1ObouHiCpNf6UIq9qP7MGUZrw2lxHudjItYIYd+K7ichLW8lFrSy9MAIbCEQb2Pb5OIKW8T026FvqjHNZ+xwd9cs0mJdB6NvVh4GSl1jjD7lNoNkKxvuH+lLWHGbokIY9QDp45eCgU+G+GTDitMN254ununmOCZqG3Ws1kxRxtDha/wymseJujN62HxvD6LQqlcJSWZ0CsGwaQJYh+i4NxOORAGJkd2wlP1FiFjsQQdoIkRxBXdMZOmzUqEvdHK1zebdwSTVA5scXetyeLQRWvhngkyrSAXQyROZLesbZcD5qxQ8pnfELTMe6kPNqbFVBUdMuaLsldxI7ZZhaBQZWVjkUiMZ7YJ5G93ybP6J3rClMkZlJVIhxYsYOo0KJFc1wN2Gxz8thugyEsO8rybSRytj6otDZUjgIiddiSn0WJCcBEY6G6QN1wkZHLq8NxTLQKwaWieaHqs0YEk09SXECq6wGBUuJTQTdYC925oLj4BfRUFNjZQ2wgdsQy/6tmfEBeepR5M8Vcp6RWZlVomFsVr/AMJBPDb8ppjqt8i14yMjNO0D7LYLzepMd8T8sMCG3gTi49xCuXWDoYY1kFroQaJC64un2r858c0v9Wo/vL9Ve5sdPrlSv5kCjUhrmAz2KNGpbQbom5xya0Ek8AFeUOx8JuvEiPG6YaO+WPzV5RKFDhCUNjW75DE8TmVg1dFulzaS/wC2bbxkI7LMToFTUuL9wQm7359zBj4yV1VlloUNwfEc6K8YguwYDvDB9SVfoWvh+mYenVLN/llazF2T0zyQIQhaBWBCEIAEIQgAQhCABCEIAF4iwmuEnNDhuIBHgV7QgDlAozGajGt7LQPJR6wqqDG6WGHHfiHcLwkVNQg9Ta1QuusVQjrQ3O6jEiS+Tgp1Es5Q4QIh0WC2YkTybZuBzDnETPerRCCTslLdibTvs/gucTCiuhg/dIvgcMQfElfaNYCGOkjxHdTQ1g+cz804oXX69mWWZHNlLRLJ0KHlR2OO+JOJjv05y7lcQ2Bok0AAZACQHcvSFzcm9zwi0+r4UYARYbXgZTGI4HMdyr4NlaI0zELuLnkeBcrpC9U5LRMg64t5tI5wIDGCTGtaNzQAPALohCiTBCEIAEIQgAQhCABCEIAEIQgAQhCABCEIAEIQgAQhCABCEIAEIQgAQhCABCEIAEIQgAQhCABCEIAEIQgAQhCABCEIAEIQgD//2Q==' },
  { name: 'Screen Protectors', image: 'data:image/jpeg;base64,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' },
  { name: 'Neckbands', image: 'data:image/jpeg;base64,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' },
  { name: 'Tablets', image: 'data:image/jpeg;base64,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' },
];

const REVIEWS = [
  { name: 'Raj Kumar', location: 'Chennai', text: 'Best prices in Tamil Nadu! Got my iPhone 15 Pro Max delivered the next day.', product: 'iPhone 15 Pro Max', rating: 5, color: '2563EB' },
  { name: 'Priya S', location: 'Trichy', text: 'Very genuine products and amazing customer service. Will buy again!', product: 'Samsung Galaxy S24', rating: 5, color: '10B981' },
  { name: 'Karthik N', location: 'Madurai', text: 'The EMI process was so smooth. Highly recommend AK Mobiles.', product: 'OnePlus 12', rating: 5, color: 'F97316' },
  { name: 'Divya M', location: 'Coimbatore', text: 'Flash sale deal was unbelievable. Saved ₹5000 on my new Redmi.', product: 'Redmi Note 13 Pro', rating: 4, color: '7C3AED' },
  { name: 'Suresh V', location: 'Virudhachalam', text: 'Our local trusted shop. Always gives the best exchange value for old phones.', product: 'Vivo V30', rating: 5, color: 'EF4444' },
];

// Reusable Product Card Component
const ProductCardUI = ({ product, disableHover = false }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const productId = product._id || product.id;
  const detailUrl = typeof productId === 'string' && productId.length > 10 ? `/products/${productId}` : `/products`;
  const isWishlisted = typeof productId === 'string' ? isInWishlist(productId) : false;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    navigate('/checkout');
  };

  return (
    <motion.div
      whileHover={disableHover ? {} : { y: -8, transition: { duration: 0.2 } }}
      className={`${disableHover ? 'bg-white rounded-[14px]' : 'card-solid'} relative group h-full flex flex-col p-4`}
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <span className="bg-brand-danger text-white text-[10px] font-bold px-2 py-1 rounded-sm tracking-wider uppercase shadow-md">
          {product.discount}% OFF
        </span>
        {product.tag && (
          <span className={`text-white text-[10px] font-bold px-2 py-1 rounded-sm tracking-wider uppercase shadow-md ${product.tag === 'NEW' ? 'bg-brand-success' :
              product.tag === 'HOT' ? 'bg-brand-orange' : 'bg-brand-blue'
            }`}>
            {product.tag}
          </span>
        )}
      </div>

      <button
        className="absolute top-4 right-4 z-10 p-2 bg-white/90 rounded-full text-slate-400 hover:text-brand-danger hover:bg-red-50 transition-colors shadow-sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (typeof productId === 'string') {
            toggleWishlist(productId);
          } else {
            toast.success("Added to wishlist");
          }
        }}
      >
        <FiHeart className={isWishlisted ? "fill-brand-danger text-brand-danger" : ""} />
      </button>

      {/* Image */}
      <Link to={detailUrl} className="block relative h-48 sm:h-56 mb-4 mt-2 overflow-hidden flex items-center justify-center p-4">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-grow">
        <div className="flex items-center gap-1 mb-1 text-yellow-400 text-xs font-medium">
          <FiStar className="fill-yellow-400" size={12} />
          <span>{product.rating}</span>
          <span className="text-brand-slate ml-1">({product.reviews})</span>
        </div>

        <Link to={detailUrl}>
          <h3 className="font-bold text-slate-800 text-sm sm:text-base mb-1 line-clamp-2 group-hover:text-brand-blue transition-colors" title={product.name}>
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 mb-2 font-medium">{product.brand}</p>
        </Link>

        <div className="mt-auto pt-3 border-t border-slate-100">
          <div className="flex items-end gap-2 mb-1">
            <span className="text-lg sm:text-xl font-bold text-brand-blue">
              ₹{product.offer.toLocaleString('en-IN')}
            </span>
            <span className="text-xs sm:text-sm text-slate-400 line-through mb-1">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-brand-success">
              Save ₹{(product.price - product.offer).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
              EMI from ₹{Math.round(product.offer / 12).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              onClick={handleAddToCart}
              className="text-xs sm:text-sm font-semibold border-2 border-brand-blue text-brand-blue rounded-full py-1.5 hover:bg-brand-blue hover:text-white transition-colors flex justify-center items-center gap-1"
            >
              <FiShoppingCart size={14} /> Add
            </button>
            <button
              onClick={handleBuyNow}
              className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-brand-orange to-red-500 text-white rounded-full py-1.5 hover:scale-105 hover:shadow-md hover:brightness-105 active:scale-95 transition-all duration-200 flex justify-center items-center text-center shadow-sm"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Map a real product document onto the shape the homepage card expects.
const toCard = (p) => ({
  _id: p._id,
  id: p._id,
  name: p.name,
  brand: p.brand,
  price: p.originalPrice,
  offer: p.offerPrice,
  offerPrice: p.offerPrice,
  originalPrice: p.originalPrice,
  discount: p.discount,
  rating: p.rating,
  reviews: p.numReviews,
  stock: p.stock,
  image: p.images?.[0]?.url,
  images: p.images,
});

const HomePage = () => {
  const [filter, setFilter] = useState('All');
  const [realProducts, setRealProducts] = useState([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [flashSettings, setFlashSettings] = useState(null);

  useEffect(() => {
    const fetchRealProducts = async () => {
      try {
        const { data } = await api.get('/products?limit=26');
        setRealProducts(data.products || []);
      } catch (err) {
        console.error('Error fetching real products:', err);
      }
    };
    const fetchFlashSale = async () => {
      try {
        const [prodRes, setRes] = await Promise.all([
          api.get('/products?flashSale=true&limit=12'),
          api.get('/settings'),
        ]);
        setFlashSaleProducts(prodRes.data.products || []);
        setFlashSettings(setRes.data.settings || null);
      } catch (err) {
        console.error('Error fetching flash sale:', err);
      }
    };
    fetchRealProducts();
    fetchFlashSale();
  }, []);

  // Whether the storefront should show a live, admin-driven flash sale.
  const flashActive = Boolean(flashSettings?.flashSaleActive && flashSaleProducts.length > 0);
  const flashCards = flashActive ? flashSaleProducts.map(toCard) : null;

  // Flash sale countdown — only targets the admin-set end time when the sale is
  // actually LIVE; otherwise it falls back to a decorative ~14h ticking timer.
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 25, seconds: 40 });
  useEffect(() => {
    const endsAt = (flashActive && flashSettings?.flashSaleEndsAt)
      ? new Date(flashSettings.flashSaleEndsAt).getTime()
      : null;
    const timer = setInterval(() => {
      if (endsAt) {
        const totalSec = Math.max(0, Math.floor((endsAt - Date.now()) / 1000));
        setTimeLeft({
          hours: Math.floor(totalSec / 3600),
          minutes: Math.floor((totalSec % 3600) / 60),
          seconds: totalSec % 60,
        });
      } else {
        setTimeLeft(prev => {
          if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
          if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
          return prev;
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [flashActive, flashSettings]);

  const getMappedProduct = (demoProduct) => {
    if (!realProducts || realProducts.length === 0) return demoProduct;

    // Find matching real product
    let match = realProducts.find(p => p.name === demoProduct.name);
    if (!match) {
      const cleanDemoName = demoProduct.name.toLowerCase().replace(/gb/g, '').trim();
      match = realProducts.find(p => {
        const cleanRealName = p.name.toLowerCase();
        return cleanRealName.includes(cleanDemoName) || cleanDemoName.includes(cleanRealName);
      });
    }
    if (!match) {
      match = realProducts.find(p => p.brand.toLowerCase() === demoProduct.brand.toLowerCase());
    }

    if (match) {
      return {
        ...demoProduct,
        _id: match._id,
        id: match._id,
        name: match.name,
        brand: match.brand,
        price: match.originalPrice,
        offer: match.offerPrice,
        offerPrice: match.offerPrice,
        originalPrice: match.originalPrice,
        discount: match.discount,
        rating: match.rating,
        reviews: match.numReviews,
        stock: match.stock,
        image: match.images?.[0]?.url || demoProduct.image,
        images: match.images,
      };
    }
    return demoProduct;
  };

  const filteredProducts = filter === 'All'
    ? DEMO_PRODUCTS.map(getMappedProduct)
    : DEMO_PRODUCTS.filter(p => p.brand === filter).map(getMappedProduct);

  return (
    <div className="bg-transparent overflow-hidden">
      <Helmet>
        <title>AK Mobiles | Premium Mobile Store in Virudhachalam</title>
      </Helmet>

      {/* HERO SECTION (Attractive Floating Light Modern glass) */}
      <section className="relative pt-10 pb-20 md:pt-20 md:pb-32 overflow-hidden bg-gradient-to-tr from-blue-50/60 via-white/80 to-purple-50/60 text-slate-800 mx-4 mt-4 rounded-3xl shadow-[0_15px_35px_rgba(0,0,0,0.05)] border border-slate-200/60">
        {/* Animated Light Background Mesh */}
        <div className="absolute inset-0 z-0 overflow-hidden opacity-60">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, -30, 0],
              rotate: [0, 90, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-blue-200/30 to-purple-200/30 blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -40, 0],
              y: [0, 40, 0],
              rotate: [0, -90, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-[40%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-blue-100/20 to-purple-100/20 blur-[120px]"
          />
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzOXYyMWgyNHYtMjFINzZ6bTAtMzl2MjFINzZWLjEySDM2em0yNC41IDU4LjV2LTE4aC0yM3YxOGgyM3ptMC0zOXYtMThoLTIzdjE4aDIzeiIgZmlsbD0iIzAwMDAwMCIgZmlsbC1vcGFjaXR5PSIwLjAyIi8+PC9nPjwvc3ZnPg==')] opacity-40"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full md:w-1/2 flex flex-col items-start"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-50 to-red-50 text-brand-orange font-bold text-sm mb-6 border border-orange-200 shadow-md backdrop-blur-md hover:scale-105 transition-transform cursor-pointer">
                <span className="relative flex h-3 w-3 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                Mega Sale Active - Up to 40% Off
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight drop-shadow-sm">
                Upgrade to the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 animate-gradient-x">
                  Ultimate Experience
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-700 mb-8 max-w-lg leading-relaxed font-medium">
                Discover next-gen smartphones with stunning cameras and lightning speed. Don't miss out on our limited-time exclusive offers!
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
                <Link to="/products" className="group w-full sm:w-auto text-lg font-bold px-8 py-4 rounded-full bg-gradient-to-r from-brand-blue to-indigo-600 text-white shadow-[0_10px_25px_rgba(79,70,229,0.4)] hover:shadow-[0_15px_35px_rgba(79,70,229,0.6)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                  Shop Now <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/products" className="w-full sm:w-auto text-lg font-bold px-8 py-4 rounded-full bg-white text-slate-800 border-2 border-slate-200 shadow-sm hover:border-brand-blue hover:text-brand-blue transition-all flex items-center justify-center">
                  View Offers
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm font-bold text-slate-700">
                <div className="flex items-center gap-2 bg-white/80 border border-slate-200/50 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow">
                  <FiCheckCircle className="text-brand-success text-xl" /> Free Delivery
                </div>
                <div className="flex items-center gap-2 bg-white/80 border border-slate-200/50 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow">
                  <FiCheckCircle className="text-brand-success text-xl" /> Genuine Products
                </div>
                <div className="flex items-center gap-2 bg-white/80 border border-slate-200/50 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow">
                  <FiCheckCircle className="text-brand-success text-xl" /> Easy Returns
                </div>
              </div>
            </motion.div>

            {/* Right Image Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full md:w-1/2 relative flex justify-center"
            >
              {/* Floating Chips */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 left-0 md:-left-10 z-20 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3 text-slate-800"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-brand-blue font-bold text-xl">5G</div>
                <div className="font-bold text-slate-800 text-sm">5G Ready<br /><span className="text-slate-500 font-normal text-xs">Lightning fast</span></div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 right-0 md:-right-10 z-20 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3 text-slate-800"
              >
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600 font-bold text-xl"><FiShield /></div>
                <div className="font-bold text-slate-800 text-sm">1 Yr Warranty<br /><span className="text-slate-500 font-normal text-xs">Brand protection</span></div>
              </motion.div>

              {/* Glowing behind phone */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full bg-gradient-to-tr from-blue-300/20 to-transparent blur-3xl z-0"></div>

              {/* Phone Image - Floating */}
              <motion.img
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                src="https://m.media-amazon.com/images/I/81SigpJN1KL._SX679_.jpg"
                alt="iPhone 15 Pro - Latest Smartphone"
                className="relative z-10 max-w-[280px] md:max-w-[350px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] rounded-3xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* MARQUEE BRAND STRIP (Interactive & Faster) */}
      <section className="py-6 overflow-hidden relative mx-4 rounded-3xl glass-effect my-8 border border-slate-200/50">
        <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none rounded-l-3xl"></div>
        <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none rounded-r-3xl"></div>

        <div className="px-4">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={24}
            slidesPerView="auto"
            loop={true}
            speed={1500}
            autoplay={{ delay: 0, disableOnInteraction: false }}
            className="swiper-continuous-ticker"
            grabCursor={true}
          >
            {BRAND_DATA.map((brand, idx) => (
              <SwiperSlide key={idx} style={{ width: 'auto' }}>
                <div
                  className="group w-auto min-w-[160px] px-6 h-[64px] shrink-0 bg-white/80 py-4 rounded-xl shadow-sm border border-slate-200/50 flex items-center justify-center hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-grab active:cursor-grabbing"
                  style={{
                    '--hover-border': `${brand.color}40`,
                    '--hover-shadow': `${brand.color}15`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = brand.color + '40';
                    e.currentTarget.style.boxShadow = `0 10px 25px ${brand.color}15`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <div className="flex items-center gap-3">
                    {brand.logo && (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        loading="lazy"
                        decoding="async"
                        className="w-7 h-7 object-contain shrink-0 pointer-events-none"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    <BrandLogo brand={brand} size="md" />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* FEATURED CATEGORIES SECTION */}
      <section className="py-16 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-slate-900">Shop by Category</h2>
            <p className="text-slate-500 text-lg">Everything you need in one place. Authentic accessories to complement your perfect smartphone.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {CATEGORIES.map((cat, idx) => (
              <Link to={`/products?category=${encodeURIComponent(
                cat.name === 'Mobile Cases' || cat.name === 'Screen Protectors' 
                  ? 'Accessories' 
                  : cat.name === 'Earbuds' || cat.name === 'Bluetooth Speakers' || cat.name === 'Neckbands' 
                    ? 'Earbuds' 
                    : cat.name
              )}`} key={idx}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className={`bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/50 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 group flex flex-col items-center h-full`}
                >
                  <div className="w-24 h-24 mb-4 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-full p-2 group-hover:scale-110 transition-transform duration-300 overflow-hidden shadow-sm">
                    <img src={cat.image} alt={cat.name} loading="lazy" decoding="async" className="max-w-full max-h-full object-contain" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800 mb-1 text-center">{cat.name}</h3>
                  <div className="flex items-center text-slate-500 text-xs font-medium">
                    {cat.count} Products <FiArrowRight className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND SHOP SECTION */}
      <section id="brands" className="py-16 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-slate-900">Shop by Brand</h2>
            <p className="text-slate-500 text-lg">Authorized dealer for all major brands. 100% genuine guaranteed.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 max-w-5xl mx-auto">
            {BRAND_DATA.map((brand, idx) => (
              <Link to={`/products?brand=${brand.name}`} key={idx}>
                <motion.div
                  whileHover={{ scale: 1.1, y: -4 }}
                  className="p-4 rounded-full shadow-sm border border-slate-200/60 flex items-center justify-center hover:shadow-lg transition-all duration-300 group w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-white/90"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = brand.color + '60';
                    e.currentTarget.style.boxShadow = `0 8px 24px ${brand.color}15`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      loading="lazy"
                      decoding="async"
                      className="w-12 h-12 sm:w-14 sm:h-14 object-contain group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const parent = e.target.parentElement;
                        if (!parent.querySelector('.logo-fallback')) {
                          const fallback = document.createElement('span');
                          fallback.className = 'logo-fallback font-bold text-sm sm:text-base text-center px-1 leading-tight';
                          fallback.style.color = brand.color;
                          fallback.innerText = brand.name;
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <span className="logo-fallback font-bold text-sm sm:text-base text-center px-1 leading-tight" style={{ color: brand.color }}>
                      {brand.name}
                    </span>
                  )}
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS (HOT DEALS) */}
      <section id="offers" className="py-16 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 flex items-center gap-3 text-slate-900">
                <FiZap className="text-brand-orange" /> Hot Deals Today
              </h2>
              <p className="text-slate-500 text-lg">Limited time offers — grab them before they're gone!</p>
            </div>
            <Link to="/products" className="text-brand-blue font-semibold hover:underline hidden md:flex items-center gap-1">
              View All Offers <FiArrowRight />
            </Link>
          </div>

          {/* Filters */}
          <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 pb-2">
            {['All', 'Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Vivo'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2.5 rounded-full font-semibold whitespace-nowrap transition-all duration-300 backdrop-blur-md ${filter === f
                    ? 'bg-brand-blue text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80 shadow-sm'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map(product => (
              <ProductCardUI key={product.id} product={product} />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-10 text-slate-400">
              No deals found for this brand right now. Check back later!
            </div>
          )}
        </div>
      </section>

      {/* FLASH SALE BANNER */}
      <section className="py-12 bg-gradient-to-r from-blue-50/90 via-indigo-50/90 to-purple-50/90 border border-slate-200/60 backdrop-blur-xl mx-4 rounded-3xl my-10 shadow-[0_15px_35px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

            <div className="w-full lg:w-1/3 text-center lg:text-left text-slate-800">
              <h2 className="text-4xl font-black text-brand-blue mb-2 italic flex items-center justify-center lg:justify-start gap-2">
                <FiZap /> {(flashActive && flashSettings?.flashSaleTitle) ? flashSettings.flashSaleTitle.toUpperCase() : 'FLASH SALE'}
              </h2>
              <p className="text-xl text-slate-600 mb-6 font-medium">{(flashActive && flashSettings?.flashSaleSubtitle) ? flashSettings.flashSaleSubtitle : 'Deals ending soon! Lowest prices of the month.'}</p>

              <div className="flex items-center justify-center lg:justify-start gap-4">
                <div className="bg-white/80 backdrop-blur-md rounded-xl p-3 border border-slate-200 min-w-[70px] text-slate-800 shadow-sm">
                  <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="text-xs text-slate-500 uppercase">Hours</div>
                </div>
                <div className="text-2xl font-bold text-slate-400 animate-pulse">:</div>
                <div className="bg-white/80 backdrop-blur-md rounded-xl p-3 border border-slate-200 min-w-[70px] text-slate-800 shadow-sm">
                  <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="text-xs text-slate-500 uppercase">Mins</div>
                </div>
                <div className="text-2xl font-bold text-slate-400 animate-pulse">:</div>
                <div className="bg-white/80 backdrop-blur-md rounded-xl p-3 border border-slate-200 min-w-[70px] text-slate-800 shadow-sm">
                  <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="text-xs text-slate-500 uppercase">Secs</div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-2/3 relative pb-4 flex justify-center lg:justify-start">
              <Swiper
                modules={[Autoplay]}
                spaceBetween={24}
                slidesPerView="auto"
                slidesPerGroup={1}
                breakpoints={{
                  640: { slidesPerGroup: 2 },
                  1024: { slidesPerGroup: 3 }
                }}
                loop={true}
                speed={800}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                className="pb-4 pt-2 w-full max-w-[280px] sm:max-w-[584px] lg:max-w-[888px] mx-auto lg:mx-0 overflow-hidden"
              >
                {(flashCards || DEMO_PRODUCTS.map(getMappedProduct)).map(product => (
                  <SwiperSlide key={product.id || product._id} className="h-auto !w-[250px] sm:!w-[280px]">
                    <ProductCardUI product={{ ...product, tag: 'SALE' }} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="py-16 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 flex items-center justify-center gap-3 text-slate-900">
              <FiStar className="text-brand-blue" /> Just Arrived
            </h2>
            <p className="text-slate-500 text-lg">Be the first to own the latest technology</p>
          </div>

          <div className="relative pb-8 -mx-4 sm:mx-0">
            <Swiper
              modules={[Navigation]}
              spaceBetween={24}
              slidesPerView="auto"
              navigation
              className="px-8 sm:px-12 md:px-16 py-4 swiper-custom-nav"
            >
              {DEMO_PRODUCTS.map(getMappedProduct).map(product => (
                <SwiperSlide key={product.id || product._id} className="h-auto !w-[250px] sm:!w-[300px]">
                  <motion.div 
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    className="p-[2px] rounded-2xl bg-gradient-to-br from-brand-blue via-slate-100 to-purple-400 shadow-md h-full"
                  >
                    <ProductCardUI product={{ ...product, tag: 'NEW' }} disableHover={true} />
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-slate-900">Why Customers Love AK Mobiles</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <FiTruck />, color: 'bg-blue-50', text: 'text-blue-600', title: 'Free Delivery', desc: 'Free shipping on orders above ₹499 across Tamil Nadu.' },
              { icon: <FiCheckCircle />, color: 'bg-green-50', text: 'text-green-600', title: '100% Genuine', desc: 'All products are brand authorized, sealed and genuine.' },
              { icon: <FiRefreshCw />, color: 'bg-orange-50', text: 'text-orange-600', title: 'Easy Returns', desc: '7-day hassle-free return and exchange policy.' },
              { icon: <FiCreditCard />, color: 'bg-purple-50', text: 'text-purple-600', title: 'EMI Options', desc: '0% EMI available on all major credit and debit cards.' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="card-solid p-8 text-center"
              >
                <div className={`w-20 h-20 mx-auto rounded-full ${feature.color} ${feature.text} flex items-center justify-center text-4xl mb-6 shadow-inner`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section className="py-16 bg-transparent overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-slate-900">What Our Customers Say</h2>
            <p className="text-slate-500 text-lg">Trusted by 10,000+ happy customers across Tamil Nadu</p>
          </div>

          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            className="pb-16"
          >
            {REVIEWS.map((review, idx) => (
              <SwiperSlide key={idx} className="h-auto">
                <div className="card-solid p-8 h-full flex flex-col">
                  <div className="flex text-yellow-400 mb-4 text-lg">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < review.rating ? '' : 'text-slate-200'}>★</span>
                    ))}
                  </div>
                  <p className="text-slate-600 font-medium italic mb-6 flex-grow leading-relaxed">
                    "{review.text}"
                  </p>
                  <div className="flex items-center gap-4 mt-auto pt-4 border-t border-slate-100">
                    <img
                      src={`https://ui-avatars.com/api/?name=${review.name.replace(' ', '+')}&background=${review.color}&color=fff&size=48`}
                      alt={review.name}
                      loading="lazy"
                      decoding="async"
                      className="w-12 h-12 rounded-full shadow-sm"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">{review.name}</h4>
                      <p className="text-xs text-slate-500">{review.location} • Bought {review.product}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-blue-50/80 to-purple-50/80 border border-slate-200/60 shadow-md backdrop-blur-xl text-slate-800 mx-4 rounded-3xl my-10">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-40 rounded-full blur-[100px] -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-40 rounded-full blur-[100px] -ml-20 -mb-20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-slate-900">Get Exclusive Deals & Offers!</h2>
            <p className="text-xl text-slate-600 mb-10">Subscribe to our newsletter and get ₹500 off your first order.</p>

            <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mb-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-grow px-6 py-4 rounded-full text-slate-900 bg-white border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-blue/20 shadow-sm"
                required
              />
              <button type="submit" className="bg-brand-orange hover:bg-brand-orangeHover text-white font-bold px-8 py-4 rounded-full transition-colors shadow-xl shadow-brand-orange/40 whitespace-nowrap">
                Subscribe Now
              </button>
            </form>
            <p className="text-sm text-slate-500">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
