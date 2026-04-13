import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function App() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const loadProducts = async () => {
    try {
      const snap = await getDocs(collection(db, "products"));

      let items = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (items.length === 0) {
        const defaults = [
          { name: "Produkt 1", price: "", description: "", images: [] },
          { name: "Produkt 2", price: "", description: "", images: [] },
          { name: "Produkt 3", price: "", description: "", images: [] },
          { name: "Produkt 4", price: "", description: "", images: [] },
        ];

        for (let p of defaults) {
          await addDoc(collection(db, "products"), p);
        }

        return loadProducts();
      }

      setProducts(items.slice(0, 4));

    } catch (err) {
      console.error("Fehler beim Laden:", err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <img src="/logo.png" style={styles.logo} />

        <div>
          <h1 style={styles.title}>VibeFree Erotic Products</h1>
          <p style={styles.sub}>Premium • Diskret • Hochwertig</p>
        </div>
      </div>

      {/* PRODUKTE */}
      <div style={styles.grid}>
        {products.map(p => (
          <div
            key={p.id}
            style={styles.card}
            onClick={() => navigate(`/product/${p.id}`)}
          >
            {p.images?.length > 0 ? (
              <img src={p.images[0]} style={styles.img} />
            ) : (
              <div style={styles.placeholder}>Kein Bild</div>
            )}

            <h3>{p.name || "Produkt"}</h3>
            <p style={styles.price}>{p.price || ""}</p>
          </div>
        ))}
      </div>

      {/* VERTRAUENSTEXT */}
      <div style={styles.trust}>
        <p>
          ✔ Kostenloser Versand innerhalb Deutschland & Schweiz (3 Tage)<br/>
          ✔ Diskrete Verpackung & sicherer Versand<br/>
          ✔ Direkter Kontakt & Bestellung über WhatsApp<br/>
          ✔ Persönlicher Support bei Fragen<br/>
          ✔ 100% zuverlässige Lieferung garantiert
        </p>
      </div>

      {/* WHY BOX */}
      <div style={styles.trustBox}>
        <h3>Warum VibeFree?</h3>
        <ul>
          <li>✔ Schnelle Lieferung (ca. 3 Tage)</li>
          <li>✔ Diskret & anonym verpackt</li>
          <li>✔ Kein Risiko – erst Kontakt, dann Bestellung</li>
          <li>✔ Direkt & unkompliziert</li>
        </ul>
      </div>

      {/* FOOTER (JETZT MIT KONTAKT) */}
      <div style={styles.footer}>
        Kontakt: vibe-free@gmx.de
      </div>

    </div>
  );
}

/* DESIGN */

const styles = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle,#0f172a,#020617)",
    color: "white",
    fontFamily: "Arial",
    padding: 20
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: 15,
    marginBottom: 30
  },

  logo: {
    width: 110,
    height: 110,
    borderRadius: 14,
    objectFit: "cover"
  },

  title: {
    margin: 0,
    fontSize: 32
  },

  sub: {
    opacity: 0.6
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: 20
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 14,
    padding: 12,
    cursor: "pointer",
    transition: "0.2s"
  },

  img: {
    width: "100%",
    height: 160,
    objectFit: "cover",
    borderRadius: 10
  },

  placeholder: {
    height: 160,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#1e293b",
    borderRadius: 10
  },

  price: {
    opacity: 0.7
  },

  trust: {
    marginTop: 40,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 1.6,
    opacity: 0.85
  },

  trustBox: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    maxWidth: 500,
    marginLeft: "auto",
    marginRight: "auto"
  },

  footer: {
    marginTop: 40,
    textAlign: "center",
    opacity: 0.6,
    fontSize: 13
  }
};