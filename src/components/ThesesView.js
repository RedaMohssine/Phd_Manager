// ThesesView.js
import React, { useState, useEffect } from 'react';

const ThesesView = () => {
  const [theses, setTheses] = useState([]);
  const [message, setMessage] = useState('');

  // Pour stocker les informations du formulaire
  const [titre, setTitre] = useState('');
  const [sujet, setSujet] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateSoutenance, setDateSoutenance] = useState('');
  const [doctorantId, setDoctorantId] = useState('');

  // Liste des doctorants pour les afficher dans le formulaire
  const [doctorants, setDoctorants] = useState([]);

  // Récupérer toutes les thèses
  useEffect(() => {
    const fetchTheses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/theses');
        if (response.ok) {
          const data = await response.json();
          setTheses(data);
        } else {
          setMessage('Erreur lors de la récupération des thèses.');
        }
      } catch (error) {
        setMessage('Erreur réseau. Impossible de se connecter au serveur.');
      }
    };

    fetchTheses();
  }, []);

  // Récupérer tous les doctorants
  useEffect(() => {
    const fetchDoctorants = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/doctorants');
        if (response.ok) {
          const data = await response.json();
          setDoctorants(data);
        } else {
          setMessage('Erreur lors de la récupération des doctorants.');
        }
      } catch (error) {
        setMessage('Erreur réseau. Impossible de se connecter au serveur.');
      }
    };

    fetchDoctorants();
  }, []);

  // Fonction pour formater la date au format yyyy-mm-dd
  const formatDate = (date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      console.error("Invalid Date:", date);
      return null; // Retourner null si la date est invalide
    }
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Soumettre le formulaire pour ajouter une thèse
  const handleAddThesis = async (e) => {
    e.preventDefault();

    // Valider les champs
    if (!titre || !sujet || !dateDebut || !dateSoutenance || !doctorantId) {
      setMessage('Veuillez remplir tous les champs.');
      return;
    }

    // Debugging: Vérification des dates avant envoi
    console.log('Date de début avant formatage:', dateDebut);
    console.log('Date de soutenance avant formatage:', dateSoutenance);

    // Formater les dates avant de les envoyer
    const formattedDateDebut = formatDate(dateDebut);
    const formattedDateSoutenance = formatDate(dateSoutenance);

    // Vérifier si les dates sont valides
    if (!formattedDateDebut || !formattedDateSoutenance) {
      setMessage('Date invalide. Veuillez vérifier les dates.');
      return;
    }

    // Debugging: Vérification des dates après formatage
    console.log('Date de début après formatage:', formattedDateDebut);
    console.log('Date de soutenance après formatage:', formattedDateSoutenance);

    // Appel à l'API pour ajouter une thèse
    try {
      const response = await fetch('http://localhost:5000/api/theses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titre,
          sujet,
          dateDebut: formattedDateDebut,
          dateSoutenance: formattedDateSoutenance,
          doctorantId,
        }),
      });

      if (response.ok) {
        setMessage('Thèse ajoutée avec succès !');
        setTitre('');
        setSujet('');
        setDateDebut('');
        setDateSoutenance('');
        setDoctorantId('');
        // Recharger la liste des thèses
        const data = await response.json();
        setTheses((prevTheses) => [...prevTheses, data]);
      } else {
        setMessage('Erreur lors de l’ajout de la thèse.');
      }
    } catch (error) {
      setMessage('Erreur réseau. Impossible de se connecter au serveur.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Gestion des Thèses</h1>

      {/* Feedback message */}
      {message && <p className="text-sm text-red-500">{message}</p>}

      {/* Thesis addition form */}
      <form onSubmit={handleAddThesis} className="mb-6 p-6 bg-white shadow-md rounded">
        <h2 className="text-xl font-semibold mb-4">Ajouter une Thèse</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Titre"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Sujet"
            value={sujet}
            onChange={(e) => setSujet(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="date"
            placeholder="Date de Début"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="date"
            placeholder="Date de Soutenance"
            value={dateSoutenance}
            onChange={(e) => setDateSoutenance(e.target.value)}
            className="p-2 border rounded"
          />
              {/* Select a doctorant */}
              <select
                value={doctorantId}
                onChange={(e) => setDoctorantId(e.target.value)}
                className="p-2 border rounded col-span-2"
              >
                <option value="">Choisir un doctorant</option>
                {doctorants.map((doctorant) => (
                  <option key={doctorant.id} value={doctorant.id}>
                    {doctorant.nom} {doctorant.prenom}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Ajouter
            </button>
          </form>
    
          {/* Theses table */}
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left text-gray-600">Titre</th>
                <th className="py-2 px-4 text-left text-gray-600">Sujet</th>
                <th className="py-2 px-4 text-left text-gray-600">Doctorant</th>
                <th className="py-2 px-4 text-left text-gray-600">Date de Soutenance</th>
                <th className="py-2 px-4 text-left text-gray-600">Date de Début</th>
              </tr>
            </thead>
            <tbody>
              {theses.length > 0 ? (
                theses.map((thesis) => (
                  <tr key={thesis.id} className="border-b hover:bg-gray-100">
                    <td className="py-2 px-4 text-center">{thesis.titre}</td>
                    <td className="py-2 px-4 text-center">{thesis.sujet}</td>
                    <td className="py-2 px-4 text-center">
                      {thesis.nom} {thesis.prenom}
                    </td>
                    <td className="py-2 px-4 text-center">
                      {new Date(thesis.date_soutenance).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 text-center">
                      {new Date(thesis.date_debut).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center px-4 py-2">
                    Aucune thèse à afficher
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      );
};

export default ThesesView;
