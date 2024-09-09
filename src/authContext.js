

import { createContext, useContext, useState, useEffect } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "firebase/auth";
import { auth } from "./firebase-Init";
import { db } from "./firebase-Init";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

const authContext = createContext();

// custom hook
function useAuthValue() {
    const value = useContext(authContext);
    return value;
}

function CustomAuthContext({ children }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState(null);

    console.log("userId:", userId);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
                setUserId(user.uid);
            } else {
                setIsAuthenticated(false);
                setUserId(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleSignIn = async (navigate) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            const user = auth.currentUser;
            console.log(user);
            setIsAuthenticated(true);
            setUserId(user.uid);
            navigate('/');
            toast.success('User signed in successfully!');
            console.log('User signed in successfully!');
        } catch (error) {
            setError(error.message);
            toast.error(error.message);
        }
    };

    const handleSignUp = async (navigate) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log(user);
            console.log(user.uid);
            navigate('/');
            if (user) {
                await setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    username: name,
                });
            }
            console.log('User signed up successfully!');
            toast.success('User signed up successfully!', { position: "top-center" });
        } catch (error) {
            setError(error.message);
            toast.error(error.message, { position: "top-center" });
        }
    };

    const logout = (navigate) => {
        signOut(auth).then(() => {
            setIsAuthenticated(false);
            setUserId(null);
            navigate('/');
            toast.success('User signed out successfully!');
        }).catch((error) => {
            toast.error('Error signing out: ' + error.message);
        });
    };

    function LogInOnSubmit(e, navigate) {
        e.preventDefault();
        setEmail(email);
        setPassword(password);
        handleSignIn(navigate);
    }

    function SignUpOnSubmit(e) {
        e.preventDefault();
        setEmail(email);
        setPassword(password);
        handleSignUp();
    }

    return (
        <authContext.Provider value={{
            email, password, setEmail, setPassword, name, setName,
            handleSignUp, handleSignIn, LogInOnSubmit, SignUpOnSubmit,
            logout, isAuthenticated, userId
        }}>
            {children}
        </authContext.Provider>
    );
}

export { authContext, CustomAuthContext, useAuthValue };
