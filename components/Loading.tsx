const Loading = () => {
  return (
    <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-sm text-center mx-auto">
      <h1 className="text-3xl font-bold">
        <span className="text-black">Porn</span>
        <span className="text-pink-400">Leaks</span>
      </h1>
      <div className="flex items-center justify-center my-8">
        <div className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="text-lg font-bold text-pink-400">Loading...</p>
    </div>
  );
};

export default Loading;
