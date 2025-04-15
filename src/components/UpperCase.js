const capitalizarNome = (nome) => {
    if (!nome) return "";
    return nome
      .toLowerCase()
      .split(" ")
      .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1))
      .join(" ");
  };
  
  export default capitalizarNome;  