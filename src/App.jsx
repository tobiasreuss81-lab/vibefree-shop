import { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc
} from "firebase/firestore";

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth";

import { useNavigate } from "react-router-dom";

export default function App() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);

  const auth = getAuth();
  const navigate = useNavigate();

  // LOGIN FORM
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ADMIN PRODUCT
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

  // LOGIN
  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert("Login fehlgeschlagen");
    }
  };

  // LOGOUT
  const logout = () => {
    signOut(auth);
  };

  // PRODUCTS LOAD
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

  // ADD PRODUCT (nur wenn eingeloggt)
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

  /* ================= UI ================= */

  // ❌ NICHT LOGGED IN → LOGIN SCREEN
  if (!user) {
    return (
      <div style={styles.page}>
        <h2>Admin Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login} style={styles.button}>
          Login
        </button>
      </div>
    );
  }

  // ✅ LOGGED IN → ADMIN PANEL
  return (
    <div style={styles.page}>

      <div style={styles.header}>
        <h1>Admin Dashboard</h1>

        <button onClick={logout} style={{ marginLeft: "auto" }}>
          Logout
        </button>
      </div>

      {/* ADD PRODUCT */}
      <div style={styles.adminBox}>
        <h3>Neues Produkt</h3>

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

      {/* PRODUCTS */}
      <div style={styles.grid}>
        {products.map(p => (
          <div key={p.id} style={styles.card}>
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
    display: "flex",
    alignItems: "center",
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
  }
};