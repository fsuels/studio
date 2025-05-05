'use client'

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getDocs, collection } from "firebase/firestore";
import { app, getFirestore } from "@/lib/firebase";

export default function Step1DocumentSelector({ onDocumentSelect, onStateChange }) {
  const { t } = useTranslation();
  const [view, setView] = useState<'categories' | 'documents'>('categories');
  const [allDocs, setAllDocs] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [filteredDocs, setFilteredDocs] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');

  // Fetch documents and derive categories
  useEffect(() => {
    async function load() {
      const db = getFirestore(app);
      const snap = await getDocs(collection(db, 'documents'));
      const docs = snap.docs.map(doc => ({...doc.data(), id: doc.id}));
      setAllDocs(docs);
      const cats = Array.from(new Set(docs.map(d => d.category))).sort();
      setCategories(cats);
    }
    load();
  }, []);

  // When category or search changes, filter docs
  useEffect(() => {
    if (view === 'documents') {
      let docs = allDocs.filter(d => d.category === currentCategory);
      if (search.trim()) {
        docs = docs.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
      }
      setFilteredDocs(docs);
    }
  }, [view, currentCategory, search, allDocs]);

  const handleCategoryClick = (cat: string) => {
    setCurrentCategory(cat);
    setSearch('');
    setView('documents');
  };

  const renderCategories = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => handleCategoryClick(cat)}
          className="flex items-center justify-center p-6 border rounded-lg shadow-sm hover:shadow-md transition"
        >
          <span className="text-center font-medium">{cat}</span>
        </button>
      ))}
    </div>
  );

  const renderDocuments = () => (
    <>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setView('categories')}
          className="text-sm text-blue-600 hover:underline"
        >
          ← {t('Back to Categories')}
        </button>
        <h3 className="text-lg font-semibold">{currentCategory}</h3>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          placeholder={t('Search documents in this category...')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border rounded p-2"
        />
        <select
          className="w-full border rounded p-2"
          value={selectedState}
          onChange={e => {
            setSelectedState(e.target.value);
            onStateChange(e.target.value);
          }}
        >
          <option value="">{t('Select State (optional)')}</option>
          {[
            'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware',
            'Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana',
            'Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana',
            'Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina',
            'North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina',
            'South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
            'Wisconsin','Wyoming'
          ].map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {filteredDocs.map(doc => (
          <div
            key={doc.id}
            onClick={() => onDocumentSelect(doc)}
            className="border rounded-lg p-4 shadow hover:shadow-md cursor-pointer transition"
          >
            <h4 className="font-semibold text-md mb-1">{doc.name}</h4>
            <p className="text-sm text-gray-600 truncate">{doc.description}</p>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span>💲{doc.basePrice}</span>
              {doc.requiresNotarization && <span>📝</span>}
              {doc.canBeRecorded && <span>🏛️</span>}
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('Step 1: Choose Your Legal Need')}</h2>
      <p className="text-gray-600">{t("Select a category below to see available templates.")}</p>
      {view === 'categories' ? renderCategories() : renderDocuments()}
    </div>
  );
}

