// Ваш файл api/server.js

const express = require('express');
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Добавим парсер для обработки данных в формате JSON
server.use(express.json());

server.use(middlewares);

// Обработка запроса на регистрацию
server.post('/register', (req, res) => {
  const { username, email, password,login,dateOfBirth } = req.body;

  // Логика проверки данных пользователя (например, уникальность email и т.д.)

  // Добавление нового пользователя в базу данных
  const newUser = {
    id: Date.now(), // Используем timestamp в качестве временного id
    username,
    email,
    password,
    login,
    dateOfBirth
  };
  server.get('/users', (req, res) => {
    const users = router.db.get('users').value();
    res.json(users);
  });
  
  // Эндпоинт для получения информации о конкретном пользователе по ID
  server.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = router.db.get('users').find({ id: userId }).value();
  
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });

  // Эндпоинт для входа
server.post('/login', (req, res) => {
    const { login, password } = req.body;
  
    // Поиск пользователя по логину
    const user = router.db.get('users').find({ login, password }).value();
  
    if (user) {
      res.json({ message: 'Login successful', user });
    } else {
      res.status(401).json({ message: 'Invalid login credentials' });
    }
  });
  
  // Получаем текущие данные из файла db.json
  const currentData = router.db.getState();

  // Обновляем данные добавлением нового пользователя
  currentData.users.push(newUser);

  // Обновляем данные в базе данных
  router.db.setState(currentData);

  // Возвращаем информацию о новом пользователе
  res.json(newUser);
});

server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running');
});

module.exports = server;
