import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function App() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);

  const auth = getAuth();
  const navigate = useNavigate();

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: ""
  });

  // 🔐 CHECK LOGIN STATUS
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsub();
  }, []);

  const loadProducts = async () => {
    const snap = await getDocs(collection(db, "products"));

    let items = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setProducts(items.slice(0, 10));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addProduct = async () => {
    if (!user) return;

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

    loadProducts();
  };

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <h1>VibeFree Shop</h1>
      </div>

      {/* 🔐 ADMIN PANEL (NUR LOGGED IN) */}
      {user && (
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
            Produkt speichern
          </button>
        </div>
      )}

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
    background: "#0f172a",
    color: "white",
    fontFamily: "Arial",
    padding: 20
  },

  header: {
    marginBottom: 20
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