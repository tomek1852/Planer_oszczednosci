require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const app = express();

app.use(cors());

app.use(express.json());

mongoose.connect(process.env.DB_URI)
    .then(() => console.log('Połączono'))
    .catch(err => console.error('Błąd:',err));

app.get('/',(req,res)=>{
    res.send('Działa!');
});

//Rejestracja nowego użytkownika
app.post('/api/register', async (req, res) => {
    try {
        const {email, password } = req.body;

        //Walidacja 
        if (!email || !password) {
            return res.status(400).json({error: 'Email i hasło jest wymagane'});
        }
    
        //Sprawdzanie czy istnieje taki użytkownik
        const existing = await User.findOne({email});
        if (existing){
            return res.status(409).json({error : 'Użytkownik o tym adresie email już istnieje'});
        }
    
        //hashowanie hasła
        const hashedPassword = await bcrypt.hash(password, 10);

        //Nowy urzytkownik
        const user = new User ({
            email,
            password: hashedPassword
        });

        await user.save();
    
        //Zwracanie odpowiedzi czy operacja wykonana została pomyślnie
        res.status(201).json({
            message: 'Uzytkownik zarejestrowany',
            user: {id: user._id, email: user.email}
        });
    } catch (err){
        console.error('Błąd rejestracji:',err);
        res.status(500).json({error: 'Błąd serwera przy rejestracji'});
    }
});

//Logowanie użytkowanika
app.post('/api/login', async (req, res) => {
    try {
        const {email,password} = req.body;

        if (!email || !password){
            return res.status(400).json({error: 'Email i hasło są wymagane'});
        }

        const user = await User.findOne({email});
        if (!user){
            return res.status(401).json({error: 'Nieprawidłowe dane logowania'});
        }

        const passwordOk = await bcrypt.compare(password, user.password);
        if(!password){
            return res.status(401).json({error: 'Nieprawidłowe dane logowania'});
        }
        //token 
        const fakeToken = `FAKE_TOKEN-${user._id}`;

        res.json({
            message: 'Zalogowano',
            token: fakeToken,
            user:{
                id: user._id,
                email: user.email
            }
        });
    } catch(err){
        console.error('Błąd logowania:',err);
        res.status(500).json({error: 'Błąd serwera przy logowaniu'});
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Serwer na http://localhost:${process.env.PORT}`);
});
