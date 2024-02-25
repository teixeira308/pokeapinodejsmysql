const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");

const jwtSecret = process.env.JWT_SECRET;

// Conexão com o banco de dados MySQL
const connection = mysql.createConnection({
  host: env.DATABASE_HOST+":"+env.DATABASE_PORT,
  user: env.DATABASE_USER,
  password: env.DATABASE_PASS,
  database: env.DATABASE_NAME,
});


connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados MySQL: ", err);
    return;
  }
  console.log("Conexão com o banco de dados MySQL estabelecida!");
});


// Função para gerar token de usuário
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "7d",
  });
};

// Registro de usuário e login
const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Verifica se o usuário já existe no banco de dados
  const checkUserQuery = `SELECT * FROM users WHERE email = ?`;
  connection.query(checkUserQuery, [email], (err, results) => {
    if (err) {
      console.error("Erro ao verificar usuário no banco de dados: ", err);
      res.status(500).json({ errors: ["Erro interno do servidor."] });
      return;
    }

    if (results.length > 0) {
      res.status(422).json({ errors: ["Por favor, utilize outro e-mail."] });
      return;
    }

    // Gera o hash da senha
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        console.error("Erro ao gerar salt para senha: ", err);
        res.status(500).json({ errors: ["Erro interno do servidor."] });
        return;
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          console.error("Erro ao gerar hash para senha: ", err);
          res.status(500).json({ errors: ["Erro interno do servidor."] });
          return;
        }

        // Insere o usuário no banco de dados
        const insertUserQuery = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
        connection.query(insertUserQuery, [name, email, hash], (err, result) => {
          if (err) {
            console.error("Erro ao inserir usuário no banco de dados: ", err);
            res.status(500).json({ errors: ["Erro interno do servidor."] });
            return;
          }

          res.status(201).json({
            _id: result.insertId,
            token: generateToken(result.insertId),
          });
        });
      });
    });
  });
};

// Obter usuário atualmente logado
const getCurrentUser = async (req, res) => {
  // Obter informações do usuário a partir do token no cabeçalho da solicitação
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, jwtSecret);
  const userId = decoded.id;

  // Consulta para obter informações do usuário
  const getUserQuery = `SELECT * FROM users WHERE id = ?`;
  connection.query(getUserQuery, [userId], (err, results) => {
    if (err) {
      console.error("Erro ao obter informações do usuário: ", err);
      res.status(500).json({ errors: ["Erro interno do servidor."] });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ errors: ["Usuário não encontrado!"] });
      return;
    }

    const user = results[0];
    delete user.password; // Não envie a senha no corpo da resposta

    res.status(200).json(user);
  });
};


// Login do usuário
const login = async (req, res) => {
  const { email, password } = req.body;

  // Verifica se o usuário existe no banco de dados
  const checkUserQuery = `SELECT * FROM users WHERE email = ?`;
  connection.query(checkUserQuery, [email], (err, results) => {
    if (err) {
      console.error("Erro ao verificar usuário no banco de dados: ", err);
      res.status(500).json({ errors: ["Erro interno do servidor."] });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ errors: ["Usuário não encontrado!"] });
      return;
    }

    const user = results[0];

    // Compara a senha fornecida com a senha armazenada no banco de dados
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error("Erro ao comparar senhas: ", err);
        res.status(500).json({ errors: ["Erro interno do servidor."] });
        return;
      }

      if (!isMatch) {
        res.status(422).json({ errors: ["Senha inválida!"] });
        return;
      }

      res.status(200).json({
        _id: user.id,
        profileImage: user.profileImage,
        token: generateToken(user.id),
      });
    });
  });
};


// Atualizar informações do usuário
const update = async (req, res) => {
  const { name, password, bio } = req.body;
  const userId = req.user.id;

  let profileImage = null;
  if (req.file) {
    profileImage = req.file.filename;
  }

  // Monta a query SQL dinamicamente
  let updateFields = [];
  let params = [];

  if (name) {
    updateFields.push("name = ?");
    params.push(name);
  }

  if (password) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        console.error("Erro ao gerar salt para senha: ", err);
        res.status(500).json({ errors: ["Erro interno do servidor."] });
        return;
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          console.error("Erro ao gerar hash para senha: ", err);
          res.status(500).json({ errors: ["Erro interno do servidor."] });
          return;
        }

        updateFields.push("password = ?");
        params.push(hash);

        // Executa a atualização no banco de dados
        performUpdate();
      });
    });
  } else {
    performUpdate();
  }

  function performUpdate() {
    if (profileImage) {
      updateFields.push("profileImage = ?");
      params.push(profileImage);
    }

    if (bio) {
      updateFields.push("bio = ?");
      params.push(bio);
    }

    params.push(userId);

    const updateQuery = `UPDATE users SET ${updateFields.join(
      ", "
    )} WHERE id = ?`;

    connection.query(updateQuery, params, (err, result) => {
      if (err) {
        console.error("Erro ao atualizar usuário no banco de dados: ", err);
        res.status(500).json({ errors: ["Erro interno do servidor."] });
        return;
      }

      res.status(200).json({ message: "Usuário atualizado com sucesso." });
    });
  }
};

// Obter usuário por ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  const getUserQuery = `SELECT * FROM users WHERE id = ?`;
  connection.query(getUserQuery, [id], (err, results) => {
    if (err) {
      console.error("Erro ao obter usuário do banco de dados: ", err);
      res.status(500).json({ errors: ["Erro interno do servidor."] });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ errors: ["Usuário não encontrado!"] });
      return;
    }

    const user = results[0];
    delete user.password; // Não envie a senha no corpo da resposta

    res.status(200).json(user);
  });
};

module.exports = {
  register,
  getCurrentUser,
  login,
  update,
  getUserById,
};