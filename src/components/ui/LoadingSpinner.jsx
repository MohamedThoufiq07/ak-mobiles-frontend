const LoadingSpinner = ({ fullScreen = false }) => {
  const spinner = (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 z-50 flex justify-center items-center">
        {spinner}
      </div>
    );
  }

  return <div className="py-12">{spinner}</div>;
};

export default LoadingSpinner;
