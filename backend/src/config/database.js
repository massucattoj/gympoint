/*
  configuracoes do banco de dados

  timestamp: true -> garante que eu vou ter uma coluna createde@ e uma coluna
  updated@ dentro de cada tabela do banco de dados
*/
module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'torresmo',
  database: 'gympoint',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true
  }
};
