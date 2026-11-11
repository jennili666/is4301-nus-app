// Firebase settings are reused from the IS4301 tutorial project
// (src/firebase-public-config.json). Values in a local .env file override them.
import publicFirebaseConfig from "./firebase-public-config.json";
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  limit,
  query,
  where,
} from "firebase/firestore";
import { isAmbiguousCredentialError } from "./authErrors";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || publicFirebaseConfig.apiKey,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || publicFirebaseConfig.authDomain,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || publicFirebaseConfig.projectId,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || publicFirebaseConfig.storageBucket,
  messagingSenderId:
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || publicFirebaseConfig.messagingSenderId,
  appId: process.env.REACT_APP_FIREBASE_APP_ID || publicFirebaseConfig.appId,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || publicFirebaseConfig.measurementId,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

const authError = (code) => {
  const error = new Error(code);
  error.code = code;
  return error;
};

// Look up the profile saved in Firestore when the account was created.
// Returns null if no account uses this email.
const findUserProfile = async (email) => {
  const typed = email.trim();
  const emails = Array.from(new Set([typed, typed.toLowerCase()]));
  const q = query(collection(db, "users"), where("email", "in", emails), limit(1));
  const snapshot = await getDocs(q);
  return snapshot.empty ? null : snapshot.docs[0].data();
};

export const logInWithEmailAndPassword = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email.trim(), password);
    return result.user;
  } catch (err) {
    // With email-enumeration protection, Firebase returns one generic error for
    // both "wrong password" and "no such user". Use the saved profiles to tell
    // the user which case applies.
    if (isAmbiguousCredentialError(err)) {
      let profile;
      try {
        profile = await findUserProfile(email);
      } catch (lookupError) {
        console.error(lookupError);
        throw err;
      }
      if (profile === null) throw authError("auth/user-not-found");
      if (profile.authProvider === "google") throw authError("app/google-account");
      throw authError("auth/wrong-password");
    }
    throw err;
  }
};

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  try {
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.empty) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
  }
  return user;
};

export const registerWithEmailAndPassword = async (name, email, password) => {
  const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const user = result.user;
  await updateProfile(user, { displayName: name });
  try {
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email: email.trim(),
    });
  } catch (err) {
    console.error(err);
  }
  return user;
};

export const logout = () => signOut(auth);
