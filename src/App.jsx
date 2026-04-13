import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function App() {
  const [products, setProducts] = useState([]);

  const storage = getStorage();

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    imageFile: null
  });

  // 📦 PRODUKTE LADEN
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

  // 🚀 PRODUKT ERSTELLEN + BILD UPLOAD
  const addProduct = async () => {
    let imageUrl = "";

    if (newProduct.imageFile) {
      const imageRef = ref(storage, `products/${Date.now()}`);

      await uploadBytes(imageRef, newProduct.imageFile);

      imageUrl = await getDownloadURL(imageRef);
    }

    await addDoc(collection(db, "products"), {
      name: newProduct.name,
      price: newProduct.price,
      description: newProduct.description,
      images: imageUrl ? [imageUrl] : []
    });

    setNewProduct({
      name: "",
      price: "",
      description: "",
      imageFile: null
    });

    loadProducts();
  };

  return (
    <div style={styles.page}>

      <div style={styles.header}>
        <h1>VibeFree Shop</h1>
      </div>

      {/* ➕ PRODUKT HINZUFÜGEN */}
      <div style={styles.adminBox}>
        <h3>Neues Produkt erstellen</h3>

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

        <textarea
          placeholder="Beschreibung"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
        />

        {/* 📸 IMAGE UPLOAD */}
        <input
          type="file"
          onChange={(e) =>
            setNewProduct({ ...newProduct, imageFile: e.target.files[0] })
          }
        />

        <button onClick={addProduct} style={styles.button}>
          Produkt speichern
        </button>
      </div>

      {/* 📦 PRODUKTE */}
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
};}
};