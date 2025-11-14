const express = require('express');
const cors = require('cors');
const mysql = require('mysql2'); // Importer MySQL
require('dotenv').config(); // Charger les variables d'environnement
const app = express();
const PORT = 5000;
const JWT_SECRET = 'G7$k9!mQ2@xZ3#bF8^tR1&uL5*eW0';
const multer = require('multer');
const path = require('path');
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/status', (req, res) => {
  res.json({ message: 'Le serveur fonctionne correctement !' });
});

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    // Fetch user from the database
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'Identifiants invalides' });
        }

        const user = results[0];

        // Compare the password with the hashed password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Identifiants invalides' });
        }

        // Create a token
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    });
});
app.get('/api/stats', (req, res) => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM doctorants) AS total_doctorants,
      (SELECT COUNT(*) FROM doctorants WHERE statut = 'Actif') AS doctorants_actifs,
      (SELECT COUNT(*) FROM doctorants WHERE statut = 'Suspendu') AS doctorants_suspendus,
      (SELECT COUNT(*) FROM theses) AS total_theses,
      (SELECT COUNT(*) FROM theses WHERE date_soutenance > CURDATE()) AS theses_en_cours,

      (SELECT COUNT(*) FROM theses WHERE date_soutenance < CURDATE()) AS theses_soutenues,
      (SELECT COUNT(*) FROM theses WHERE date_soutenance > CURDATE()) AS theses_annee_en_cours
    FROM dual;
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des doctorants :', err);
      res.status(500).send('Erreur serveur');
    } else {
      res.json(results);
    }
  });
});
// Route pour récupérer toutes les thèses avec les informations des doctorants
app.get('/api/theses', (req, res) => {
  const query = `
    SELECT theses.*, doctorants.nom, doctorants.prenom
    FROM theses
    JOIN doctorants ON theses.doctorant_id = doctorants.id
  `;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération des thèses' });
    }
    res.json(results);
  });
});

app.post('/api/theses', (req, res) => {
  const { titre, sujet, dateDebut, dateSoutenance, doctorantId } = req.body;

  // Vérification des dates
  console.log('Date de début:', dateDebut);
  console.log('Date de soutenance:', dateSoutenance);

  const query = `
    INSERT INTO theses (titre, sujet, date_debut, date_soutenance, doctorant_id)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(query, [titre, sujet, dateDebut, dateSoutenance, doctorantId], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'ajout de la thèse:', err);
      return res.status(500).json({ error: 'Erreur lors de l\'ajout de la thèse' });
    }
    res.status(201).json({
      id: result.insertId,
      titre,
      sujet,
      dateDebut,
      dateSoutenance,
      doctorantId
    });
  });
});

// Configuration de la connexion MySQL
const db = mysql.createConnection({
  host: 'localhost', // Remplacez par votre adresse (si différente)
  user: 'root', // Votre utilisateur MySQL
  password: 'root', // Votre mot de passe
  database: 'gestion_doctorants', // La base de données créée
});

// Vérifier la connexion
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à MySQL :', err);
    return;
  }
  console.log('Connecté à la base de données MySQL');
});

// Exporter la connexion pour utilisation dans d'autres fichiers
module.exports = db;
// Activer le parsing JSON
app.use(express.json());

// Route pour récupérer tous les doctorants
app.get('/api/doctorants', (req, res) => {
  const sql = 'SELECT * FROM doctorants';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des doctorants :', err);
      res.status(500).send('Erreur serveur');
    } else {
      res.json(results);
    }
  });
});

// Route pour ajouter un doctorant
app.post('/api/doctorants', async (req, res) => {
  const { nom, prenom, statut, dateFinPredite, sujetThese, email, password } = req.body;

  // Validation simple
  if (!nom || !prenom || !statut || !dateFinPredite || !sujetThese || !email || !password) {
      return res.status(400).send('Tous les champs sont requis.');
  }

  // Hash the password for the user
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert into users table
  const userSql = `
      INSERT INTO users (email, password, role) 
      VALUES (?, ?, 'doctorant')
  `;
  db.query(userSql, [email, hashedPassword], (err, result) => {
      if (err) {
          console.error('Erreur lors de l’ajout de l’utilisateur :', err);
          return res.status(500).send('Erreur lors de l’ajout de l’utilisateur.');
      }

      // Get the user ID of the newly created user
      const userId = result.insertId;

      // Insert into doctorants table
      const doctorantSql = `
          INSERT INTO doctorants (nom, prenom, statut, date_fin_predite, sujet_these, user_id) 
          VALUES (?, ?, ?, ?, ?, ?)
      `;
      const doctorantValues = [nom, prenom, statut, dateFinPredite, sujetThese, userId];

      db.query(doctorantSql, doctorantValues, (err, result) => {
          if (err) {
              console.error('Erreur lors de l’ajout du doctorant :', err);
              return res.status(500).send('Erreur lors de l’ajout du doctorant.');
          }
          res.status(201).send('Doctorant ajouté avec succès.');
      });
  });
});
// backend/routes/stats.js
// Route to send notifications
app.post('/api/notifications', (req, res) => {
  const { message, doctorantIds } = req.body;

  if (!message) {
      return res.status(400).json({ error: 'Message is required' });
  }

  // If no specific doctorants are selected, send to all
  if (!doctorantIds || doctorantIds.length === 0) {
      const query = 'INSERT INTO notifications (message) VALUES (?)';
      db.query(query, [message], (err, result) => {
          if (err) {
              return res.status(500).json({ error: 'Error sending notification' });
          }
          res.status(201).json({ message: 'Notification sent to all doctorants' });
      });
  } else {
      // Send notification to specific doctorants
      const query = 'INSERT INTO notifications (message, doctorant_id) VALUES ?';
      const values = doctorantIds.map(id => [message, id]);
      db.query(query, [values], (err, result) => {
          if (err) {
              return res.status(500).json({ error: 'Error sending notification' });
          }
          res.status(201).json({ message: 'Notification sent to selected doctorants' });
      });
  }
});

// Route to get notifications for a specific doctorant
app.get('/api/notifications/:doctorantId', (req, res) => {
  const { doctorantId } = req.params;
  const query = 'SELECT * FROM notifications WHERE doctorant_id = ? ORDER BY created_at DESC';
  db.query(query, [doctorantId], (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Error retrieving notifications' });
      }
      res.json(results);
  });
});


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ 
  storage, 
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5 MB
  fileFilter: (req, file, cb) => {
    // Accept only certain file types
    const filetypes = /pdf|doc|docx|txt|jpg|jpeg|png/; // Add other types as needed
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb('Error: File type not supported');
  }
});

// Route to upload documents
app.post('/api/documents', upload.single('document'), (req, res) => {
  if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
  }
  const { doctorantId } = req.body;
  const doc_ID = doctorantId -1;
  const sql = 'INSERT INTO documents (doctorant_id, file_path) VALUES (?, ?)';
  db.query(sql, [doc_ID, req.file.path], (err, result) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Error saving document' });
      }
      res.status(201).json({ message: 'Document uploaded successfully' });
  });
});
// Route to fetch all documents for admins
app.get('/api/documents', (req, res) => {
  const sql = 'SELECT documents.*, doctorants.nom, doctorants.prenom FROM documents JOIN doctorants ON documents.doctorant_id = doctorants.id';
  db.query(sql, (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Error fetching documents' });
      }
      
      res.json(results);
  });
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Le serveur est en cours d'exécution sur http://localhost:${PORT}`);
});
