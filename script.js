// 🔥 Importamos Firebase y Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// 🔧 Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA8sndXPT5CN-ZzypweOPiQ3mbgmPnJUDk",
  authDomain: "miappvendible.firebaseapp.com",
  projectId: "miappvendible",
  storageBucket: "miappvendible.appspot.com",
  messagingSenderId: "149501151545",
  appId: "1:149501151545:web:8e6430073d82409e2400e8",
  measurementId: "G-BFFFHXC9J4"
};

// 🚀 Inicializamos Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// 📝 Registro con email y contraseña
window.registrar = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      document.getElementById("mensaje").innerText = "Registro exitoso 🎉";
    })
    .catch((error) => {
      document.getElementById("mensaje").innerText = "Error: " + error.message;
    });
};

// 🔐 Login con Google
document.getElementById("btnGoogle").addEventListener("click", async () => {
  try {
    await signOut(auth); // 👈 Esto fuerza el selector de cuentas
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "usuarios", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        nombre: user.displayName,
        rol: "usuario",
        creado: new Date()
      });
    }

    document.getElementById("mensaje").innerText = `Bienvenido ${user.displayName} 🎉`;
    await redirigirPorRol(user.uid);
  } catch (error) {
    document.getElementById("mensaje").innerText = "Error: " + error.message;
  }
});

// 🚦 Redirigir según el rol
async function redirigirPorRol(uid) {
  const userRef = doc(db, "usuarios", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const rol = userSnap.data().rol;
    if (rol === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "usuario.html";
    }
  } else {
    document.getElementById("mensaje").innerText = "No se encontró el rol del usuario.";
  }
}