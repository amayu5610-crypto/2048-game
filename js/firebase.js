import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot
};

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  await signInWithPopup(auth, provider);
}


export async function logoutFirebase() {
  await signOut(auth);
}

export async function handleRedirectLogin() {
  try {
    const result = await getRedirectResult(auth);

    if (result?.user) {
      console.log("リダイレクトログイン成功:", result.user.email);
    } else {
      console.log("リダイレクト結果なし");
    }

    return result;
  } catch (error) {
    console.error("リダイレクトログインエラー", error);
    alert(`${error.code}\n${error.message}`);
    return null;
  }
}

export function normalizeName(name) {
  return String(name || "").trim().toLowerCase().replace(/\s+/g, "_");
}

export async function ensurePlayer(user) {
  if (!user?.uid) return null;
  const ref = doc(db, "players2048", user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return { uid: user.uid, ...snap.data() };
  const defaultName = (user.displayName || "Player").slice(0, 12);
  const data = {
    uid: user.uid,
    game_name: defaultName,
    google_name: user.displayName || "",
    email: user.email || "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  await setDoc(ref, data, { merge: true });
  await setDoc(doc(db, "userNames2048", normalizeName(defaultName)), {
    name_id: normalizeName(defaultName),
    uid: user.uid,
    game_name: defaultName,
    updated_at: new Date().toISOString()
  }, { merge: true });
  return data;
}

export async function saveNickname(user, nickname) {
  if (!user?.uid) throw new Error("ログインしてから保存してください。");
  const gameName = String(nickname || "").trim().slice(0, 12);
  if (!gameName) throw new Error("ニックネームを入力してください。");

  const nameId = normalizeName(gameName);
  const nameRef = doc(db, "userNames2048", nameId);
  const nameSnap = await getDoc(nameRef);
  if (nameSnap.exists() && nameSnap.data().uid !== user.uid) {
    throw new Error("このニックネームはすでに使われています。");
  }

  await setDoc(nameRef, {
    name_id: nameId,
    uid: user.uid,
    game_name: gameName,
    updated_at: new Date().toISOString()
  }, { merge: true });

  await setDoc(doc(db, "players2048", user.uid), {
    uid: user.uid,
    game_name: gameName,
    google_name: user.displayName || "",
    email: user.email || "",
    updated_at: new Date().toISOString()
  }, { merge: true });

  return gameName;
}

export async function savePlayerProgress(user, stats) {
  if (!user?.uid) return;

  const achievements = JSON.parse(
    localStorage.getItem("achievements2048") || "[]"
  );

  await setDoc(doc(db, "players2048", user.uid, "progress", "summary"), {
    stats,
    achievements,
    updated_at: new Date().toISOString()
  }, { merge: true });
}

export async function loadPlayerProgress(user) {
  if (!user?.uid) return null;

  const snap = await getDoc(
    doc(db, "players2048", user.uid, "progress", "summary")
  );

  if (!snap.exists()) return null;

  return snap.data();
}