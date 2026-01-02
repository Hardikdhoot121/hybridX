const Section = ({ title, children }) => {
    return (
      <div className="bg-white rounded-xl border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            {title}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
          {children}
        </div>
      </div>
    );
  };
  
  export default Section;
  