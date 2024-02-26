// controllers/userController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import database from '../infra/database.js'; // Importe a instância do Sequelize
import env from '../config/config.js';

export async function signUp(req, res) {
  try {
    const { username, password, email } = req.body;
    console.log(req.body);
    const hashedPassword = await bcrypt.hash(password, 10);
    await database.query('INSERT INTO users (username, password,email,createdAt,UpdatedAt) VALUES (?, ?,?,NOW(),NOW())', { replacements: [username, hashedPassword,email , ] });
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function signIn(req, res) {
  try {
    const { username, password } = req.body;
    const [rows] = await database.query('SELECT * FROM users WHERE username = ?', { replacements: [username] });
    if (rows.length === 0) {
      throw new Error('Usuário não encontrado');
    }
    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Senha incorreta');
    }
    const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}


export function protect(req, res, next) {
    // Extrai o token do cabeçalho Authorization da requisição
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  
    // Verifica se o token está presente
    if (!token) {
      return res.status(401).json({ error: 'Token de autenticação não fornecido' });
    }
  
    try {
      // Verifica se o token é válido e decodifica o payload
      const decoded = jwt.verify(token, env.JWT_SECRET);
  
      // Define o ID do usuário decodificado na requisição para uso posterior
      req.userId = decoded.userId;
  
      // Permite o acesso ao próximo middleware ou rota
      next();
    } catch (error) {
      // Retorna um erro de não autorizado se o token for inválido
      res.status(401).json({ error: 'Token de autenticação inválido' });
    }
  }