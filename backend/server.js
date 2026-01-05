require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const Income = require('./models/Income')
const Expense = require('./models/Expense')
const Category = require('./models/Category')



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

// Dodawanie dochodu
app.post('/api/income', async (req, res) => {
  try {
    const { userId, type, amount, category, subcategory, date } = req.body

    if (!userId || !type || !amount || !category) {
      return res
        .status(400)
        .json({ error: 'userId, type, amount i category są wymagane' })
    }

    const income = new Income({
      userId,
      type,
      amount,
      category,
      subcategory: subcategory || '',
      createdAt: date ? new Date(date) : undefined
    })

    await income.save()

    res.status(201).json({
      message: 'Dochód zapisany',
      income
    })
  } catch (err) {
    console.error('Błąd dodawania dochodu:', err)
    res.status(500).json({ error: 'Błąd serwera przy dodawaniu dochodu' })
  }
})


app.get('/api/income', async (req, res) => {
    try {
      const { userId } = req.query
  
      if (!userId) {
        return res.status(400).json({ error: 'Brak parametru userId' })
      }
  
      const incomes = await Income.find({ userId }).sort({ createdAt: -1 })
  
      res.json(incomes)
    } catch (err) {
      console.error('Błąd pobierania dochodów:', err)
      res.status(500).json({ error: 'Błąd serwera przy pobieraniu dochodów' })
    }
})

// Dodawanie wydatku
app.post('/api/expense', async (req, res) => {
  try {
    const { userId, type, amount, category, subcategory, date } = req.body

    if (!userId || !type || !amount || !category) {
      return res.status(400).json({ error: 'Brak wymaganych pól wydatku' })
    }

    const expense = new Expense({
      userId,
      type,
      amount,
      category,
      subcategory: subcategory || '',
      createdAt: date ? new Date(date) : undefined
    })

    await expense.save()

    res.status(201).json({
      message: 'Wydatek zapisany',
      expense
    })
  } catch (err) {
    console.error('Błąd dodawania wydatku:', err)
    res.status(500).json({ error: 'Błąd serwera przy dodawaniu wydatku' })
  }
})

// Pobieranie wydatków użytkownika
app.get('/api/expense', async (req, res) => {
  try {
    const { userId } = req.query

    if (!userId) {
      return res.status(400).json({ error: 'Brak parametru userId' })
    }

    const expenses = await Expense.find({ userId }).sort({ createdAt: -1 })

    res.json(expenses)
  } catch (err) {
    console.error('Błąd pobierania wydatków:', err)
    res.status(500).json({ error: 'Błąd serwera przy pobieraniu wydatków' })
  }
})

// Pobranie kategorii użytkownika (opcjonalnie filtrowanie po kind)
app.get('/api/categories', async (req, res) => {
  try {
    const { userId, kind } = req.query

    if (!userId) {
      return res.status(400).json({ error: 'Brak parametru userId' })
    }

    const filter = { userId }
    if (kind) {
      filter.kind = kind // 'income' lub 'expense'
    }

    const categories = await Category.find(filter).sort({ name: 1 })
    res.json(categories)
  } catch (err) {
    console.error('Błąd pobierania kategorii:', err)
    res.status(500).json({ error: 'Błąd serwera przy pobieraniu kategorii' })
  }
})

// Dodawanie kategorii / podkategorii
app.post('/api/categories', async (req, res) => {
  try {
    const { userId, kind, name, parentId } = req.body

    if (!userId || !kind || !name) {
      return res.status(400).json({ error: 'userId, kind i name są wymagane' })
    }

    const category = new Category({
      userId,
      kind,
      name,
      parentId: parentId || null
    })

    await category.save()

    res.status(201).json({
      message: 'Kategoria zapisana',
      category
    })
  } catch (err) {
    console.error('Błąd dodawania kategorii:', err)
    res.status(500).json({ error: 'Błąd serwera przy dodawaniu kategorii' })
  }
})

// Usuwanie kategorii z blokadą, gdy jest używana
app.delete('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params

    const category = await Category.findById(id)
    if (!category) {
      return res.status(404).json({ error: 'Kategoria nie istnieje' })
    }

    // UWAGA: sprawdzamy po nazwie, bo w Income/Expense trzymasz category jako string
    const hasIncomes = await Income.exists({ category: category.name })
    const hasExpenses = await Expense.exists({ category: category.name })

    if (hasIncomes || hasExpenses) {
      return res
        .status(400)
        .json({
          error:
            'Nie można usunąć kategorii powiązanej z istniejącymi dochodami lub wydatkami'
        })
    }

    await Category.findByIdAndDelete(id)

    res.json({ message: 'Kategoria usunięta' })
  } catch (err) {
    console.error('Błąd usuwania kategorii:', err)
    res.status(500).json({ error: 'Błąd serwera przy usuwaniu kategorii' })
  }
})

// Aktualizacja kategorii + zmiana nazwy we wszystkich dochodach/wydatkach
app.put('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Nowa nazwa kategorii jest wymagana' })
    }

    const category = await Category.findById(id)
    if (!category) {
      return res.status(404).json({ error: 'Kategoria nie istnieje' })
    }

    const oldName = category.name
    const newName = name.trim()

    // aktualizacja samej kategorii
    category.name = newName
    await category.save()

    // HURTOWA aktualizacja dochodów i wydatków po nazwie kategorii
    await Income.updateMany(
      { category: oldName },
      { category: newName }
    )
    await Expense.updateMany(
      { category: oldName },
      { category: newName }
    )

    res.json({
      message: 'Kategoria zaktualizowana',
      category
    })
  } catch (err) {
    console.error('Błąd aktualizacji kategorii:', err)
    res.status(500).json({ error: 'Błąd serwera przy aktualizacji kategorii' })
  }
})
    
// Usuwanie pojedynczego dochodu
app.delete('/api/income/:id', async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Income.findByIdAndDelete(id)
    if (!deleted) {
      return res.status(404).json({ error: 'Dochód nie istnieje' })
    }
    res.json({ message: 'Dochód usunięty' })
  } catch (err) {
    console.error('Błąd usuwania dochodu:', err)
    res.status(500).json({ error: 'Błąd serwera przy usuwaniu dochodu' })
  }
})

// Usuwanie pojedynczego wydatku
app.delete('/api/expense/:id', async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Expense.findByIdAndDelete(id)
    if (!deleted) {
      return res.status(404).json({ error: 'Wydatek nie istnieje' })
    }
    res.json({ message: 'Wydatek usunięty' })
  } catch (err) {
    console.error('Błąd usuwania wydatku:', err)
    res.status(500).json({ error: 'Błąd serwera przy usuwaniu wydatku' })
  }
})


// Aktualizacja kwoty dochodu
app.put('/api/income/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { amount } = req.body

    if (amount === undefined || amount === null) {
      return res.status(400).json({ error: 'Pole amount jest wymagane' })
    }

    const updated = await Income.findByIdAndUpdate(
      id,
      { amount: Number(amount) },
      { new: true }
    )

    if (!updated) {
      return res.status(404).json({ error: 'Dochód nie istnieje' })
    }

    res.json({
      message: 'Dochód zaktualizowany',
      income: updated
    })
  } catch (err) {
    console.error('Błąd aktualizacji dochodu:', err)
    res.status(500).json({ error: 'Błąd serwera przy aktualizacji dochodu' })
  }
})

// Aktualizacja kwoty wydatku
app.put('/api/expense/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { amount } = req.body

    if (amount === undefined || amount === null) {
      return res.status(400).json({ error: 'Pole amount jest wymagane' })
    }

    const updated = await Expense.findByIdAndUpdate(
      id,
      { amount: Number(amount) },
      { new: true }
    )

    if (!updated) {
      return res.status(404).json({ error: 'Wydatek nie istnieje' })
    }

    res.json({
      message: 'Wydatek zaktualizowany',
      expense: updated
    })
  } catch (err) {
    console.error('Błąd aktualizacji wydatku:', err)
    res.status(500).json({ error: 'Błąd serwera przy aktualizacji wydatku' })
  }
})


app.listen(process.env.PORT, () => {
    console.log(`Serwer na http://localhost:${process.env.PORT}`);
});
