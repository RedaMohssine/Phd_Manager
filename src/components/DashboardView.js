// src/components/DashboardView.js
import React, { useState, useEffect } from 'react';

const DashboardView = () => {
  const [stats, setStats] = useState({
    totalDoctorants: 0,
    totalTheses: 0,
    soutenancesAvenir: 0,
    progressionMoyenne: 0,
    doctorantsActifs: 0,
    doctorantsTermines: 0
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/stats')
      .then((response) => response.json())
      .then((data) => {
        const statsData = data[0]; // L'objet de stats est le premier élément du tableau
        setStats({
          totalDoctorants: statsData.total_doctorants || 0,
          totalTheses: statsData.total_theses || 0,
          soutenancesAvenir: statsData.theses_annee_en_cours || 0, // Pas de clé pour "soutenances à venir", donc on suppose "theses_annee_en_cours"
          progressionMoyenne: statsData.theses_soutenues / statsData.total_theses * 100 || 0, // Calcul de la progression moyenne
          doctorantsActifs: statsData.doctorants_actifs || 0,
          doctorantsTermines: statsData.theses_soutenues || 0
        });
      })
      .catch((error) => console.error('Erreur:', error));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="p-6 rounded-lg shadow bg-blue-100 flex flex-col">
          <h3 className="text-lg font-semibold mb-2">Total des Doctorants</h3>
          <p className="text-4xl font-bold">{stats.totalDoctorants}</p>
        </div>
        <div className="p-6 rounded-lg shadow bg-green-100 flex flex-col">
          <h3 className="text-lg font-semibold mb-2">Total des Thèses</h3>
          <p className="text-4xl font-bold">{stats.totalTheses}</p>
        </div>
        <div className="p-6 rounded-lg shadow bg-yellow-100 flex flex-col">
          <h3 className="text-lg font-semibold mb-2">Soutenances à venir</h3>
          <p className="text-4xl font-bold">{stats.soutenancesAvenir}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="p-6 rounded-lg shadow bg-purple-100 flex flex-col">
          <h3 className="text-lg font-semibold mb-2">Progrès moyen des thèses</h3>
          <p className="text-4xl font-bold">{stats.progressionMoyenne}%</p>
        </div>
        <div className="p-6 rounded-lg shadow bg-red-100 flex flex-col">
          <h3 className="text-lg font-semibold mb-2">Doctorants actifs</h3>
          <p className="text-4xl font-bold">{stats.doctorantsActifs}</p>
        </div>
        <div className="p-6 rounded-lg shadow bg-gray-100 flex flex-col">
          <h3 className="text-lg font-semibold mb-2">Doctorants terminés</h3>
          <p className="text-4xl font-bold">{stats.doctorantsTermines}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
