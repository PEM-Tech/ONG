// backend/models/anamnese.js
module.exports = (sequelize, DataTypes) => {
    const Anamnese = sequelize.define("Anamnese", {
      // Campo para associar a ficha do assistido (pode ser chamado de assistido_id ou ficha)
      assistido_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // se cada assistido tiver uma única ficha de anamnese
      },
      // Demais campos da anamnese – ajuste conforme os campos do seu formulário:
      historico: DataTypes.STRING,
      medicamentos: DataTypes.STRING,
      quais: DataTypes.STRING,
      // ... (adicione todos os campos necessários)
    });
  
    // Se houver associações, defina-as aqui, por exemplo:
    Anamnese.associate = (models) => {
      Anamnese.belongsTo(models.Assistido, {
        foreignKey: "assistido_id",
        targetKey: "ficha", // supondo que o modelo Assistido use "ficha" como identificador
      });
    };
  
    return Anamnese;
  };
  