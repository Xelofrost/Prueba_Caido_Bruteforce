const express = require('express');
const app = express();
const rateLimit = require('express-rate-limit');
const port = 3000;

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, 
    message: "Te has venido arribisima, relajate un minutito"
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require('cors');
const randomNumber = Math.floor(Math.random() * 999999);
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.static('public'));
const fs = require('fs');
const path = require('path');
const passwordList = fs.readFileSync(path.join(__dirname, 'passwords.txt'), 'utf-8').split('\n');

const randomPass = () => {
    const randomIndex = Math.floor(Math.random() * passwordList.length);
    return passwordList[randomIndex].trim();
};

const randomPass2 = () => {
    const randomIndex = Math.floor(Math.random() * passwordList.length);
    return passwordList[randomIndex].trim();
};

const admin = {
    username: randomPass(),
    password: randomPass2(),
};

const generateUsers = (numUsers) => {
    const users = [];
    for (let i = 0; i < numUsers; i++) {
        users.push({
            username: randomPass(),
            password: randomPass2(),
        });
    }
    return users;
};

const users = generateUsers(10); // Genera 10 usuarios
console.log(users);
console.log(`Random number: ${randomNumber}`);
console.log(`User: ${admin.username}`);
console.log(`Password: ${admin.password}`);

app.get(`/${randomNumber}`, (req, res) => {
    res.send("The flag is guacamole")
});

app.post('/api/login', limiter , (req, res) => {
    const { username, password } = req.body;
    if (username === admin.username && password === admin.password) {
        res.json({ success: true, redirectUrl: `/${randomNumber}` });
    } else {
        const user = users.find(user => user.username === username && user.password === password);
        if (user) {
            res.status(200).json({ success: true });
        } else {
            res.status(401).json({ message: 'Invalid username or password', success: false });
        }
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});