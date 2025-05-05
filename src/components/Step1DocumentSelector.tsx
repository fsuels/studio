tsx
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Step1DocumentSelector({ onDocumentSelect, onStateChange }) {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState([]);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");

  useEffect(() => {
    async function fetchDocuments() {
      const docsSnapshot = await getDocs(collection(db, "documents"));
      const docs = docsSnapshot.docs.map(doc => doc.data());
      setDocuments(docs);
    }
    fetchDocuments();
  }, []);

  const categories = ["All", ...new Set(documents.map(doc => doc.category))];

  const filteredDocs = documents.filter(doc =>
    (category === "All" || doc.category === category) &&
    doc.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{t("Step 1: Choose Your Legal Need")}</h2>
      <p className="text-sm text-gray-600">{t("Select a legal category and then pick a document. We'll guide you through the rest.")}</p>

      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 rounded-full border ${category === cat ? 'bg-black text-white' : 'bg-white text-black'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder={t("Search documents...")}
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="w-full border rounded p-2"
      />

      <select
        className="w-full mt-2 border rounded p-2"
        value={selectedState}
        onChange={(e) => {
          setSelectedState(e.target.value);
          onStateChange(e.target.value);
        }}
      >
        <option value="">{t("Select State (optional)")}</option>
        {[
          "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
          "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
          "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana",
          "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina",
          "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
          "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
          "Wisconsin", "Wyoming"
        ].map(state => (
          <option key={state} value={state}>{state}</option>
        ))}
      </select>

      <div className="grid md:grid-cols-2 gap-4">
        {filteredDocs.map(doc => (
          <div
            key={doc.id}
            onClick={() => onDocumentSelect(doc)}
            className="border rounded-xl p-4 shadow cursor-pointer hover:shadow-md"
          >
            <h3 className="font-bold text-lg">{doc.name}</h3>
            <p className="text-sm text-gray-600">{doc.description}</p>
            <p className="text-xs mt-2">💲{doc.basePrice} {t("Base Price")}</p>
            {doc.requiresNotarization && <p className="text-xs">📝 {t("Requires notarization")}</p>}
            {doc.canBeRecorded && <p className="text-xs">🏛️ {t("Can be recorded")}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}