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
        console.log("Added document with ID:", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error in adding document:", e);
        throw e;
    }
};