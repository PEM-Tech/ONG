const Card = ({ title, value, color }) => {
    return (
      <div
        className={`p-4 ${color} text-white rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl flex flex-col items-center`}
      >
        <h2 className="text-lg font-bold text-center">{title}</h2>
        <p className="text-2xl mt-2">{value ?? "Carregando..."}</p>
        {/* Adicionando uma borda decorativa */}
        <div
          className={`mt-2 w-full h-1 bg-opacity-75 rounded-lg`}
          style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
        ></div>
      </div>
    );
  };
  
  export default Card;
  