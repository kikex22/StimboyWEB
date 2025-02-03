import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword,GoogleAuthProvider,signInWithPopup} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore,setDoc,doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB_HEU7dpE2yj1x8SwoSnoKxNZXkuwYRzg",
  authDomain: "stimboy-1ca74.firebaseapp.com",
  projectId: "stimboy-1ca74",
  databaseURL:"https://stimboy-1ca74-default-rtdb.firebaseio.com",
  storageBucket: "stimboy-1ca74.firebasestorage.app",
  messagingSenderId: "417573823836",
  appId: "1:417573823836:web:4ec9fc13e99305267c8d99",
  measurementId: "G-CR431YXJN6"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

const vueApp=Vue.createApp({
  data(){
    return{
      email:'',
      password:'',
      name:'',
      country:'',
      birthdate:'',
      message:'',
      paises:[],
    };
  },
  methods:{
    async createAccount(){
      const auth=getAuth();
      const db=getFirestore();
      try{
        const userCredential=await createUserWithEmailAndPassword(auth,this.email,this.password);
        const user=userCredential.user;
        const userData={
          email:this.email,
          name:this.name,
          country:this.country,
          birthdate:this.birthdate,
        };
        const docRef=doc(db,"users",user.uid);
        await setDoc(docRef,userData);
        this.message='Account created successfully';
        setTimeout(()=>{
          window.location.href='index.html';
        },2000);
      }
      catch(error){
        console.error("Error al crear la cuenta:",error);
        this.message='Error al crear la cuenta';
      }
  },
    // google sign in
    // --- NUEVA FUNCIONALIDAD: Inicio de sesión con Google ---
    GoogleSignIn() {
      alert("funciona");
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      signInWithPopup(auth, provider)
        .then((result) => {
          const user = result.user;
          const db = getFirestore();
          const userData = {
            email: user.email,
            name: user.displayName,
            photoURL: user.photoURL,
            lastLogin: new Date(),
          };
          const docRef = doc(db, "users", user.uid);
          setDoc(docRef, userData, { merge: true })
            .then(() => console.log("Datos del usuario guardados en Firestore"));
            console.log("Redirigiendo al menú principal...");
          setTimeout(()=>{
            window.location.href='index.html';
          },2000);
          
        });
    },

    // Facebook sign in
    facebookSignIn() {
      alert("si funciona");
    },

    // microsoft sign in
    microsoftSignIn() {
      alert("microsoft si funciona");
    },
    //API de paises
    async cargarpaises(){
      try{
        const response=await fetch('https://restcountries.com/v3.1/all');
        const data=await response.json();
        this.paises=data.sort((a, b) => a.name.common.localeCompare(b.name.common));
      }catch(error){
        console.error("Error al obtener los paises:",error);
      }
    
    }
  },
  mounted(){
    this.cargarpaises();
  }
});


vueApp.mount("#app");

  