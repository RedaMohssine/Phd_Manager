import React, { useEffect, useState } from 'react';

const DoctorantTable = () => {
  const [doctorants, setDoctorants] = useState([]);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [statut, setStatut] = useState('');
  const [dateFinPredite, setDateFinPredite] = useState('');
  const [sujetThese, setSujetThese] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Fetch doctorants data from the API
  useEffect(() => {
    fetch('http://localhost:5000/api/doctorants')
      .then((response) => response.json())
      .then((data) => setDoctorants(data))
      .catch((error) => console.error('Erreur:', error));
  }, []);

  const handleAddDoctorant = async (e) => {
    e.preventDefault();

    // Validate fields
    if (!nom || !prenom || !statut || !dateFinPredite || !sujetThese || !email || !password) {
      setMessage('Veuillez remplir tous les champs.');
      return;
    }

    // Call the API to add the doctorant
    try {
      const response = await fetch('http://localhost:5000/api/doctorants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nom, prenom, statut, dateFinPredite, sujetThese, email, password }),
      });

      if (response.ok) {
        setMessage('Doctorant ajouté avec succès !');
        // Clear the form fields
        setNom('');
        setPrenom('');
        setStatut('');
        setDateFinPredite('');
        setSujetThese('');
        setEmail('');
        setPassword('');
        // Refresh the doctorants list
        const updatedDoctorants = await fetch('http://localhost:5000/api/doctorants');
        setDoctorants(await updatedDoctorants.json());
      } else {
        setMessage('Erreur lors de l’ajout du doctorant.');
      }
    } catch (error) {
      setMessage('Erreur réseau. Impossible de se connecter au serveur.');
    }
  };

  return (
    <div>
      <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4 text-center">Liste des Doctorants</h1>
    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
      <thead className="bg-gray-200">
        <tr>
          <th className="py-2 px-4 text-left text-gray-600">ID</th>
          <th className="py-2 px-4 text-left text-gray-600">Nom</th>
          <th className="py-2 px-4 text-left text-gray-600">Prénom</th>
          <th className="py-2 px-4 text-left text-gray-600">Statut</th>
          <th className="py-2 px-4 text-left text-gray-600">Date prédite de fin</th>
          <th className="py-2 px-4 text-left text-gray-600">Sujet de thèse</th>
        </tr>
      </thead>
      <tbody>
        {doctorants.map((doc) => (
          <tr key={doc.id} className="border-b hover:bg-gray-100">
            <td className="py-2 px-4 text-center">{doc.id}</td>
            <td className="py-2 px-4 text-center">{doc.nom}</td>
            <td className="py-2 px-4 text-center">{doc.prenom}</td>
            <td className="py-2 px-4 text-center">{doc.statut}</td>
            <td className="py-2 px-4 text-center">{new Date(doc.date_fin_predite).toLocaleDateString()}</td>
            <td className="py-2 px-4 text-center">{doc.sujet_these}</td>
          </tr>
        ))}
      </tbody>
      </table>
       </div>

      {/* Form to add a new Doctorant */}
      <h2 className="text-xl font-semibold mb-4">Ajouter un Doctorant</h2>
      <form onSubmit={handleAddDoctorant} className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Prénom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Statut"
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="date"
            placeholder="Date Prédite de Fin"
            value={dateFinPredite}
            onChange={(e) => setDateFinPredite(e.target.value)}
            className="p-2 border rounded"
            />
            <textarea
              placeholder="Sujet de Thèse"
              value={sujetThese}
              onChange={(e) => setSujetThese(e.target.value)}
              className="p-2 border rounded col-span-2"
            ></textarea>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border rounded col-span-2"
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border rounded col-span-2"
            />
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Ajouter
          </button>
        </form>
  
        {/* Message de feedback */}
        {message && <p className="text-sm text-red-500">{message}</p>}
      </div>
    );
  };
  
  export default DoctorantTable;