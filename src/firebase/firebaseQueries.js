import { collection, getDocs, addDoc, doc, getDoc, query, where } from "firebase/firestore";
import { db } from './firebaseConfig';

export const fetchAll = async (collectionName) => {
    const result = [];
    const querySnapshot = await getDocs(collection(db, collectionName));
    querySnapshot.forEach((doc) => {
        result.push({ id: doc.id, ...doc.data() });
    });
    return result;
};

export const addData = async (collectionName, data) => {
    try {
        const docRef = await addDoc(collection(db, collectionName), data);
        console.log("Added document with ID:", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error in adding document:", e);
        throw e;
    }
};

export const fetchWhere = async (collectionName, field, operator, value) => {
    try {
        const colRef = collection(db, collectionName);
        const q = query(colRef, where(field, operator, value));
        const querySnapshot = await getDocs(q);
        const result = [];
        querySnapshot.forEach((doc) => {
            result.push({ id: doc.id, ...doc.data() });
        });
        return result;
    } catch (e) {
        console.error("Error in fetchWhere:", e);
        throw e;
    }
};