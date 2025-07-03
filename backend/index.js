const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const db = require('./db');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();

// Разрешаем CORS для всех источников (для разработки)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500'); // <-- именно этот адрес!
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'my_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    sameSite: 'lax',
    secure: false
  }
}));

app.use(express.static('views'));
app.use('/uploads', express.static('uploads'));

// Главная
app.get('/', (req, res) => {
  if (req.session.user) {
    res.send(`<h1>Привет, ${req.session.user.username}!</h1><a href="/logout">Выйти</a>`);
  } else {
    res.redirect('/login.html');
  }
});

// Регистрация
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  const sql = 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)';
  db.query(sql, [username, email, hash], (err) => {
    if (err) return res.status(400).send('Ошибка регистрации.');
    res.status(200).send('Успешная регистрация');
  });
});

// Авторизация
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], async (err, results) => {
    if (err || results.length === 0) return res.status(400).send('Неверный логин или пароль');

    const user = results[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).send('Неверный логин или пароль');

    req.session.user = { id: user.id, username: user.username };
    res.status(200).send('OK');
  });
});

// Выход
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login.html');
});

// API: получить данные текущего пользователя
app.get('/api/user', (req, res) => {
  if (!req.session.user) return res.json({ user: null });
  const sql = 'SELECT id, username, email, avatar_url FROM users WHERE id = ?';
  db.query(sql, [req.session.user.id], (err, results) => {
    if (err || results.length === 0) return res.json({ user: null });
    res.json({ user: results[0] });
  });
});

// Смена пароля пользователя
app.post('/api/change-password', async (req, res) => {
  if (!req.session.user) return res.status(401).send('Не авторизован');
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) return res.status(400).send('Заполните все поля');
  const sql = 'SELECT * FROM users WHERE id = ?';
  db.query(sql, [req.session.user.id], async (err, results) => {
    if (err || results.length === 0) return res.status(400).send('Пользователь не найден');
    const user = results[0];
    const match = await bcrypt.compare(oldPassword, user.password_hash);
    if (!match) return res.status(400).send('Старый пароль неверен');
    const newHash = await bcrypt.hash(newPassword, 10);
    db.query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, user.id], (err2) => {
      if (err2) return res.status(500).send('Ошибка обновления пароля');
      res.send('Пароль успешно изменён!');
    });
  });
});

// Загрузка аватара
app.post('/api/upload-avatar', upload.single('avatar'), (req, res) => {
  if (!req.session.user) return res.status(401).send('Не авторизован');
  const avatarPath = '/uploads/' + req.file.filename;
  db.query('UPDATE users SET avatar_url = ? WHERE id = ?', [avatarPath, req.session.user.id], (err) => {
    if (err) return res.status(500).send('Ошибка сохранения аватара');
    res.json({ avatar_url: avatarPath });
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
