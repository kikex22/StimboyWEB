// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB_HEU7dpE2yj1x8SwoSnoKxNZXkuwYRzg",
  authDomain: "stimboy-1ca74.firebaseapp.com",
  projectId: "stimboy-1ca74",
  databaseURL: "https://stimboy-1ca74-default-rtdb.firebaseio.com",
  storageBucket: "stimboy-1ca74.firebasestorage.app",
  messagingSenderId: "417573823836",
  appId: "1:417573823836:web:4ec9fc13e99305267c8d99",
  measurementId: "G-CR431YXJN6"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
console.log("✅ Firebase inicializado");

// Inicializar Auth
const auth = getAuth();

// Vue.js Application
const appVue = Vue.createApp({
  data() {
    return {
      user: null,
      loginText: "Iniciar Sesión",
      loginLink: "login.html",
      logoutVisible: false,
      firebaseData: {}, // ✅ Inicializar vacío para evitar errores
      dataLoaded: false,
      isVisible: [],
      isVisibleAcerca: [],
      acercaDeItems: [
        { imagen: "gocho.JPEG", texto: "Gocho texto ", alt: "Gocho" },
        { imagen: "senales.jpg", texto: "Señales texto prueba", alt: "Señales" },
        { imagen: "mpu.JPEG", texto: "MPU text", alt: "MPU" },
        { imagen: "ems.jpg", texto: "EMS text", alt: "EMS" },
        { imagen: "wilker.png", texto: "Wilker text bts", alt: "Wilker" }
      ],
      servicios: [
        { nombre: "Evaluación Inicial", descripcion: "Sesión de diagnóstico inicial con análisis personalizado y configuración del dispositivo.", precio: "$50 USD" },
        { nombre: "Terapia Básica", descripcion: "Programa estándar de electroestimulación y monitoreo de rodilla.", precio: "$200 USD por mes" },
        { nombre: "Terapia Avanzada", descripcion: "Incluye personalización completa, análisis de datos y soporte prioritario.", precio: "$350 USD por mes" },
        { nombre: "Plan Profesional", descripcion: "Acceso a dispositivos múltiples con soporte técnico avanzado.", precio: "$800 USD por mes" },
        { nombre: "Alquiler de Dispositivo", descripcion: "Alquiler mensual del sistema completo de StimBoy para uso personal o profesional.", precio: "$150 USD por mes" }
      ],
      Service: false,
      Acercade: false,
    };
  },

  mounted() {
    this.isVisible = new Array(this.servicios.length).fill(false);
    this.isVisibleAcerca = new Array(this.acercaDeItems.length).fill(false);
    
    // Detectar cambios en el estado de autenticación
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
        this.loginText = `Hola, ${user.displayName || user.email.split("@")[0]}`;
        this.loginLink = "#";
        this.logoutVisible = true;
      } else {
        this.user = null;
        this.loginText = "Iniciar Sesión";
        this.loginLink = "login.html";
        this.logoutVisible = false;
      }
    });

    window.addEventListener("scroll", this.handleScroll);

   // Leer datos de Firebase
   const dataRef = ref(database, "test");
   onValue(dataRef, (snapshot) => {
    if (snapshot.exists()) {
      console.log("📌 Datos recibidos de Firebase:", snapshot.val());
      this.firebaseData = { ...snapshot.val() };
      this.dataLoaded = true;
    } else {
      console.log("⚠️ No hay datos en Firebase.");
      this.firebaseData = {}; 
      this.dataLoaded = false;
    }
  }, (error) => {
    console.error("❌ Error al leer datos de Firebase:", error);
    this.dataLoaded = false;
  });
  },  


  methods: {
    handleScroll() {
      if (this.$refs.Service) {
        const tituloTop = this.$refs.Service.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (tituloTop < windowHeight - 200) {
          this.Service = true;
        }
      }

      if (this.$refs.Acercade) {
        const tituloTop = this.$refs.Acercade.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (tituloTop < windowHeight - 300) {
          this.Acercade = true;
        }
      }

      this.$refs.fadeSections?.forEach((section, index) => {
        const elementTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementTop < windowHeight - 300) {
          this.isVisible[index] = true;
        }
      });

      this.$refs.fadeAcerca?.forEach((section, index) => {
        const elementTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementTop < windowHeight - 300) {
          this.isVisibleAcerca[index] = true;
        }
      });
    },

    logout() {
      signOut(auth)
        .then(() => {
          console.log("✅ Sesión cerrada");
          this.user = null;
          this.loginText = "Iniciar Sesión";
          this.loginLink = "login.html";
          this.logoutVisible = false;
        })
        .catch((error) => {
          console.error("❌ Error al cerrar sesión:", error);
        });
    }
  }
});

// Montar la aplicación Vue en el div con id "app"
appVue.mount("#app");
