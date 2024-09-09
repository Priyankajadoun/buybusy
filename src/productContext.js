


import { createContext, useContext, useState, useEffect } from "react";
import productData from './data/data.json';
import { addDoc, collection, doc, onSnapshot, deleteDoc, getDocs, query, where, updateDoc } from "firebase/firestore";
import { useAuthValue } from "./authContext";
import { db } from "./firebase-Init";
import { toast } from "react-toastify";

const productContext = createContext();

// Custom hook
function useProdValue() {
    const value = useContext(productContext);
    return value;
}

function CustomProdContext({ children }) {
    const [searchedProduct, setSearchedProduct] = useState("");
    const [filteredProducts, setFilteredProducts] = useState(productData);
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);
    const [tempMessage, setTempMessage] = useState({});
    const [cartId, setCartId] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state
    const { userId } = useAuthValue();

    // Function for increasing the qty
    function increaseQTY(prod) {
        const updatedCart = cart.map((p) =>
            p.id === prod.id ? { ...p, qty: p.qty + 1 } : p
        );
        setCart(updatedCart);
    }

    // Function for decreasing the qty
    function decreaseQTY(prod) {
        const updatedCart = cart.map((p) =>
            p.id === prod.id && p.qty > 0 ? { ...p, qty: p.qty - 1 } : p
        );
        const filteredCart = updatedCart.filter((p) => p.qty > 0);
        setCart(filteredCart);
    }

    // Function for adding product to cart
    async function Cart(product) {
        if (!userId) {
            console.error("User ID is not available", "userId:", userId);
            return;
        }

        try {
            const UsersDocRef = doc(db, "users", userId);
            const CartCollectionRef = collection(UsersDocRef, "cart");

            // Check if the product already exists in Firestore
            const q = query(CartCollectionRef, where("id", "==", product.id));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Product exists, increase its quantity
                const existingProductDoc = querySnapshot.docs[0];
                const existingProductData = existingProductDoc.data();
                const newQty = existingProductData.qty + 1;

                await updateDoc(existingProductDoc.ref, { qty: newQty });

                // Update local cart state
                setCart((prevState) =>
                    prevState.map((p) =>
                        p.docId === existingProductDoc.id
                            ? { ...p, qty: newQty }
                            : p
                    )
                );

                // Show toast message
                toast.success('Increase product count!');

                console.log("Product quantity increased in Cart:", product);
                return;
            }

            // Product does not exist, add it to the cart
            const cartDocRef = await addDoc(CartCollectionRef, { ...product, qty: 1 });
            const productWithDocId = { ...product, qty: 1, docId: cartDocRef.id };
            // setCart((prevState) => [productWithDocId, ...prevState]);

            // Show toast message
            toast.success('Product added successfully!');

            console.log("Product added successfully in Cart:", productWithDocId);
        } catch (error) {
            console.error("Error adding product: ", error);
        }
    }

    // Function for removing product from cart
    async function removeProdFromCart(prod) {
        try {
            const UsersDocRef = doc(db, "users", userId);
            const CartCollectionRef = collection(UsersDocRef, "cart");
            const ProductDocRef = doc(CartCollectionRef, prod.docId);

            await deleteDoc(ProductDocRef);
            console.log("Product deleted successfully from cart:", prod);
            const updatedCart = cart.filter((p) => p.docId !== prod.docId);
            setCart(updatedCart);
        } catch (error) {
            console.error("Error deleting product: ", error);
        }
    }

    // Function for placing an order
    async function placeOrder() {
        if (!userId) {
            console.error("User ID is not available", "userId:", userId);
            return;
        }
    
        const newOrder = {
            date: new Date().toLocaleDateString(),
            items: [...cart],
            total: cart.reduce((acc, item) => acc + item.price * item.qty, 0),
        };
    
        try {
            const UsersDocRef = doc(db, "users", userId);
            const OrderCollectionRef = collection(UsersDocRef, "orders");
            await addDoc(OrderCollectionRef, newOrder);
            console.log("Order placed successfully:", newOrder);
    
            // Clear the cart after placing an order
            setCart([]);
    
            // Delete the cart data from Firestore
            const CartCollectionRef = collection(UsersDocRef, "cart");
            const querySnapshot = await getDocs(CartCollectionRef);
            querySnapshot.forEach(doc => {
                deleteDoc(doc.ref);
            });
            console.log("Cart data deleted successfully from Firestore");
        } catch (error) {
            console.error("Error placing order: ", error);
        }
    }
    

    // Set up real-time updates for orders
    useEffect(() => {
        if (!userId) return;

        const UsersDocRef = doc(db, "users", userId);
        const OrderCollectionRef = collection(UsersDocRef, "orders");

        const unsub = onSnapshot(OrderCollectionRef, (snapshot) => {
            const Orders = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setOrders(Orders);
            setLoading(false); // Set loading to false after fetching data
        });

        return () => unsub();
    }, [userId]);

    // Set up real-time updates for cart
    useEffect(() => {
        if (!userId) return;

        setLoading(true); // Set loading to true before fetching orders

        const UsersDocRef = doc(db, "users", userId);
        const CartCollectionRef = collection(UsersDocRef, "cart");

        const unsub = onSnapshot(CartCollectionRef, (snapshot) => {
            const CartItems = snapshot.docs.map((doc) => ({
                docId: doc.id,
                ...doc.data(),
            }));
            setCart(CartItems);
            setLoading(false); // Set loading to false after fetching data
        });

        return () => unsub();
    }, [userId]);

    // Function for sidebar filter
    function applyFilters(price, categories) {
        const filteredByPrice = productData.filter(p => p.price <= price);
        const filteredByCategories = categories.length > 0 ?
            filteredByPrice.filter(p => categories.includes(p.category)) :
            filteredByPrice;
        const filteredByName = searchedProduct.trim() !== '' ?
            filteredByCategories.filter(p =>
                p.name.toLowerCase().includes(searchedProduct.toLowerCase())
            ) :
            filteredByCategories;

        setFilteredProducts(filteredByName);
    }

    return (
        <productContext.Provider value={{ loading, tempMessage, setTempMessage, placeOrder, orders, decreaseQTY, increaseQTY, removeProdFromCart, setCart, setSearchedProduct, Cart, cart, searchedProduct, filteredProducts, applyFilters }}>
            {children}
        </productContext.Provider>
    );
}

export { productContext, CustomProdContext, useProdValue };

