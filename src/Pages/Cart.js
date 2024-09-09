import React, { useState, useEffect } from 'react'
import minus from "../assets/minus.png"
import pluse from "../assets/pluse.png"
import "../Styles/Cart.css"
import { useProdValue } from '../productContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { toast } from "react-toastify";
function Cart() {
    const {tempMessage,setTempMessage, decreaseQTY, increaseQTY, cart, removeProdFromCart,placeOrder,setCart } = useProdValue();
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const calculatedTotalPrice = cart.reduce((total, prod) => total + prod.price * prod.qty, 0);
        setTotalPrice(calculatedTotalPrice);
        
    }, [cart]);

    const handlePurchase = () => {
        placeOrder(); // Place the order
        setCart([]); // Empty the cart
        navigate('/orders'); // Navigate to the Orders page
    };
    const handleRemove = (prod) => {
        setTempMessage(prev => ({ ...prev, [prod.id]: 'Removing...' }));
        setTimeout(() => {
            removeProdFromCart(prod);
            toast.success('Product removed successfully!');
            setTempMessage(prev => ({ ...prev, [prod.id]: '' }));
        }, 1000);
    };
    return (
        <>
            {cart.length === 0 ? (<div>
                <h1>Cart is Empty!</h1>
                </div>) : (
                <div className='cartPage'>
                    <aside className='totalPrice'>
                        <p>TotalPrice:-{totalPrice} &#x20B9;</p>
                        <Link to="/orders"><button className='cartBtn' onClick={handlePurchase} >Purchase</button></Link>
                    </aside>
                    <div className='ProductGrid'>
                        {cart.map((prod, i) => {
                            return (
                                <div className='productContainer' key={i}>
                                    <div className='productImage'>
                                        <img src={prod.img} alt='product' width="100%" height="100%" />
                                    </div>
                                    <div className='productDetails'>
                                        <div className='productName'>
                                            {prod.name}
                                        </div>
                                        <div className='productOption'>
                                            <p className='productOption_Price'>&#x20B9; {prod.price} </p>
                                            <div className='productQuantity'>
                                                <img onClick={() => decreaseQTY(prod)} src={minus} alt='minus' width="100%" height="100%" />
                                                
                                                    {prod.qty}
                                               
                                                <img onClick={() => increaseQTY(prod)} src={pluse} alt='pluse' width="100%" height="100%" />
                                            </div>
                                        </div>
                                        {/* <button onClick={() => handleRemove(prod)} class="ProductDetails_removeBtn" title="Remove from Cart">{tempMessage}</button> */}
                                        <button 
                                        onClick={() => handleRemove(prod)} 
                                        className="ProductDetails_removeBtn" 
                                        title="Remove from Cart">
                                        {tempMessage[prod.id] || 'Remove From Cart'}
                                    </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )
            }
        </>
    )
}

export default Cart;