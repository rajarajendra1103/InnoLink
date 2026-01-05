import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    auth, db
} from '../firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import {
    doc,
    setDoc,
    getDoc
} from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                // Fetch profile from Firestore
                const docRef = doc(db, 'profiles', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserProfile(docSnap.data());
                }
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    async function signup(email, password, profileData) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;

        // Save profile to Firestore
        const profile = {
            uid: user.uid,
            email: email,
            role: profileData.role || 'User',
            fullName: profileData.fullName || '',
            username: profileData.username || email.split('@')[0],
            status: 'active',
            violationCount: 0,
            createdAt: new Date().toISOString(),
            ...profileData
        };

        await setDoc(doc(db, 'profiles', user.uid), profile);

        // Also save to specialized collections for easy admin management as requested
        const collectionName = profile.role === 'Admin' ? 'admins' :
            (profile.role === 'Investor' ? 'investers' : 'innovators');
        await setDoc(doc(db, collectionName, user.uid), { uid: user.uid, email: email });

        setUserProfile(profile);
        return user;
    }

    async function login(email, password) {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result.user;
    }

    function logout() {
        return signOut(auth);
    }

    const value = {
        currentUser,
        userProfile,
        signup,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
