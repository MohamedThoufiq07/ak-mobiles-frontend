import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiHome } from 'react-icons/fi';

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found | AK Mobiles</title>
      </Helmet>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-9xl font-black text-slate-200 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Page Not Found</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="btn-primary flex items-center gap-2">
          <FiHome /> Back to Homepage
        </Link>
      </div>
    </>
  );
};

export default NotFoundPage;
