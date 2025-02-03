import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword,GoogleAuthProvider,signInWithPopup } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore,doc,setDoc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
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



const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const vueApp=Vue.createApp({
    data(){
      return{
        email:'',
        password:'',
        loginMessage:'',
      };
    },
methods:{
  iniciarSesion(){
    if(!this.email || !this.password){
      this.loginMessage='Por favor, completa todos los campos.';
      return;
    }


signInWithEmailAndPassword(auth,this.email,this.password)
.then((userCredential)=>{
  const user=userCredential.user;
  this.loginMessage=`Bienvenido, ${user.email.split('@')[0]}`;
  setTimeout(()=>{
    window.location.href='index.html';
  },2000);
})
.catch((error)=>{
  console.error("Error al iniciar sesión:",error);
  this.errorMessage='Correo o contraseña incorrectos.';
});
},



// google sign in
// --- NUEVA FUNCIONALIDAD: Inicio de sesión con Google ---
googleSignIn(){
  const provider=new GoogleAuthProvider();
  signInWithPopup(auth,provider)
  .then((result)=>{
    const user=result.user;
    const db= getFirestore();
    const userData={
      email:user.email,
      name:user.displayName,
      photoURL:user.photoURL,
      lastLogin:new Date()
    };
  const docRef=doc(db,'users',user.uid);
  setDoc(docRef,userData,{merge:true})
  .then(()=>
  console.log("Datos del usuario guardados en Firestore"))
  setTimeout(()=>{
    window.location.href='index.html';
  },2000);
  
})
  .catch((error)=>{
    console.error("Error en el inicio de sesión con Google:",error);
  });
},




// Facebook sign in

 facebookSignIn (){
  alert("si funciona");
},



// microsoft sign in
microsoftSignIn (){
  alert("si funciona");
}
}
});

vueApp.mount('#app');

