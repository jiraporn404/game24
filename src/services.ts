import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

const infoCollection = collection(db, "information");

export const getInfo = async () => {
  const info = await getDoc(doc(infoCollection, "info"));
  return info.data();
};

export const updateInfo = async (data: any) => {
  await setDoc(doc(infoCollection, "info"), data);
};
