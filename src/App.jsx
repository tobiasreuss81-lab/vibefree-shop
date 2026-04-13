import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function App() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // 👉 NEW: Admin Form State
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: ""
  });

  const loadProducts = async () => {
    const snap = await getDocs(collection(db, "products"));

    let items = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setProducts(items.slice(0, 10)); // jetzt flexibel
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // 👉 NEW: Produkt speichern
  const addProduct = async () => {
    if (!newProduct.name) return;

    await addDoc(collection(db, "products"), {
      name: newProduct.name,
      price: newProduct.price,
      description: newProduct.description,
      images: newProduct.image ? [newProduct.image] : []
    });

    setNewProduct({
      name: "",
      price: "",
      description: "",
      image: ""
    });

    loadProducts(); // reload
  };

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <img src="/logo.png" style={styles.logo} />

        <div>
          <h1 style={styles.title}>
            VibeFree – Diskreter Online Shop
          </h1>
          <p style={styles.sub}>
            Premium • Versand DE & CH • Schnell & sicher
          </p>
        </div>
      </div>

      {/* 👉 ADMIN PANEL */}
      <div style={styles.adminBox}>
        <h3>Admin – Neues Produkt</h3>

        <input
          placeholder="Name"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
        />

        <input
          placeholder="Preis"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
        />

        <input
          placeholder="Bild URL"
          value={newProduct.image}
          onChange={(e) =>
            setNewProduct({ ...newProduct, image: e.target.value })
          }
        />

        <textarea
          placeholder="Beschreibung"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
        />

        <button onClick={addProduct} style={styles.button}>
          + Produkt erstellen
        </button>
      </div>

      {/* PRODUKTE */}
      <div style={styles.grid}>
        {products.map(p => (
          <div key={p.id} style={styles.card}>
            {p.images?.length > 0 ? (
              <img src={p.images[0]} style={styles.img} />
            ) : (
              <div style={styles.placeholder}>Kein Bild</div>
            )}

            <h3>{p.name}</h3>
            <p>{p.price}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

/* STYLES */
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
    gap: 15,
    marginBottom: 20
  },

  logo: {
    width: 90,
    height: 90,
    borderRadius: 10
  },

  title: {
    fontSize: 24
  },

  sub: {
    opacity: 0.7
  },

  adminBox: {
    background: "rgba(255,255,255,0.05)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    maxWidth: 400
  },

  button: {
    padding: 10,
    background: "#22c55e",
    border: "none",
    color: "white",
    borderRadius: 8,
    cursor: "pointer"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
    gap: 15
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    padding: 10,
    borderRadius: 10
  },

  img: {
    width: "100%",
    height: 150,
    objectFit: "cover",
    borderRadius: 8
  },

  placeholder: {
    height: 150,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#1e293b"
  }
};