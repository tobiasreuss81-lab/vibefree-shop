import { useEffect, useState } from "react";
import { db } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";

export default function ProductPage() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [i, setI] = useState(0);

  const isAdmin = window.location.search.includes("admin=1");
  const WHATSAPP = "4915147407518";

  const load = async () => {
    const snap = await getDoc(doc(db, "products", id));
    setP(snap.data());
  };

  useEffect(() => {
    load();
  }, []);

  const update = async (field, value) => {
    await updateDoc(doc(db, "products", id), {
      [field]: value
    });
    load();
  };

  // 🔥 IMAGE UPLOAD
  const upload = async (files) => {
    const arr = Array.from(files).slice(0, 5);

    const imgs = await Promise.all(
      arr.map(file =>
        new Promise(res => {
          const r = new FileReader();
          r.onload = () => res(r.result);
          r.readAsDataURL(file);
        })
      )
    );

    await update("images", imgs);
  };

  if (!p) return <div style={{ color: "white" }}>Loading...</div>;

  return (
    <div style={styles.page}>

      {/* NAME */}
      {isAdmin ? (
        <input
          value={p.name || ""}
          onChange={(e) => update("name", e.target.value)}
          style={styles.titleInput}
        />
      ) : (
        <h1>{p.name}</h1>
      )}

      {/* IMAGE */}
      <div style={styles.bigBox}>
        {p.images?.length > 0 && (
          <img src={p.images[i]} style={styles.bigImg} />
        )}
      </div>

      {/* THUMBS */}
      <div style={styles.row}>
        {p.images?.map((img, index) => (
          <img
            key={index}
            src={img}
            style={styles.thumb}
            onClick={() => setI(index)}
          />
        ))}
      </div>

      {/* UPLOAD */}
      {isAdmin && (
        <input type="file" multiple onChange={(e) => upload(e.target.files)} />
      )}

      {/* PRICE */}
      {isAdmin ? (
        <input
          value={p.price || ""}
          onChange={(e) => update("price", e.target.value)}
          placeholder="Preis"
          style={styles.input}
        />
      ) : (
        <h2>{p.price}</h2>
      )}

      {/* DESCRIPTION */}
      {isAdmin ? (
        <textarea
          value={p.description || ""}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Beschreibung"
          style={styles.textarea}
        />
      ) : (
        <p style={styles.text}>{p.description}</p>
      )}

      {/* BUTTON */}
      <a
        href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
          `Interesse an ${p.name}`
        )}`}
        style={styles.btn}
      >
        Kontakt per WhatsApp
      </a>

    </div>
  );
}

/* DESIGN */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    padding: 20
  },

  titleInput: {
    fontSize: 26,
    width: "100%",
    marginBottom: 10,
    padding: 8,
    borderRadius: 8
  },

  bigBox: {
    maxWidth: 600
  },

  bigImg: {
    width: "100%",
    borderRadius: 12
  },

  row: {
    display: "flex",
    gap: 10,
    marginTop: 10
  },

  thumb: {
    width: 80,
    height: 80,
    objectFit: "cover",
    borderRadius: 8,
    cursor: "pointer"
  },

  input: {
    marginTop: 10,
    width: "100%",
    padding: 8,
    borderRadius: 8
  },

  textarea: {
    marginTop: 10,
    width: "100%",
    height: 120,
    padding: 8,
    borderRadius: 8
  },

  text: {
    opacity: 0.8,
    marginTop: 10
  },

  btn: {
    display: "inline-block",
    marginTop: 20,
    padding: 12,
    background: "#22c55e",
    color: "white",
    borderRadius: 10,
    textDecoration: "none"
  }
};