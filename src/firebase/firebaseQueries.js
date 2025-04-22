import { collection, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
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
        console.log("Dodano dokument z ID:", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Błąd przy dodawaniu dokumentu:", e);
        throw e;
    }
};