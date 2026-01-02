const Detail = ({ label, value }) => {
    return (
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium text-gray-800">{value}</p>
      </div>
    );
  };
  
  export default Detail;
  