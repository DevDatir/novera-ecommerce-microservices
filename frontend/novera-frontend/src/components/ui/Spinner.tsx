const Spinner = () => {
  return (
    <div className="flex justify-center py-16">

      <div
        className="
          h-10
          w-10
          animate-spin
          rounded-full
          border-4
          border-blue-600
          border-t-transparent
        "
      />

    </div>
  );
};

export default Spinner;