

import React, { useState, useEffect } from 'react';
import "../Styles/Home.css";
import { useProdValue } from '../productContext';
import { toast } from "react-toastify";

function Home() {
    const { Cart, setSearchedProduct, filteredProducts, applyFilters,tempMessage,setTempMessage } = useProdValue();
    const [price, setPrice] = useState(100000); // Initial price value
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        applyFilters(price, categories);
    }, [price, categories, applyFilters]);

    const handlePriceChange = (e) => {
        setPrice(parseInt(e.target.value));
    };

    const handleCategoryChange = (e) => {
        const category = e.target.name;
        const isChecked = e.target.checked;

        if (isChecked) {
            setCategories([...categories, category]);
        } else {
            setCategories(categories.filter((cat) => cat !== category));
        }
    };
    const handleCart = (prod) => {
        setTempMessage(prev => ({ ...prev, [prod.id]: 'Adding...' }));
        setTimeout(() => {
            Cart(prod);
            setTempMessage(prev => ({ ...prev, [prod.id]: '' }));
        }, 1000);
    };

    return (
        <>
            <div className='HomePage'>
                <aside className='filerSidebar'>
                    <h2>Filter</h2>
                    <form>
                        <label htmlFor="price">
                            <p>Price: {price}</p>
                        </label>
                        <input type='range' id="price" name="price" className="priceSlider"
                            min="1" max="100000" step="10" value={price} onChange={handlePriceChange}></input>
                        <h2>Category</h2>
                        <div className='sidebar-category'>
                            <div>
                                <input type='checkbox' id="mensFashion" name='Men' onChange={handleCategoryChange}></input>
                                <label htmlFor="mensFashion">Men's Clothing</label>
                            </div>
                            <div>
                                <input type='checkbox' id="womensFashion" name='Women' onChange={handleCategoryChange}></input>
                                <label htmlFor="womensFashion">Women's Clothing</label>
                            </div>
                            <div>
                                <input type='checkbox' id="jewelery" name='Jewelery' onChange={handleCategoryChange}></input>
                                <label htmlFor="jewelery">Jewelery</label>
                            </div>
                            <div>
                                <input type='checkbox' id="electronics" name='Electronics' onChange={handleCategoryChange}></input>
                                <label htmlFor="electronics">Electronics</label>
                            </div>
                        </div>
                    </form>
                </aside>

                <form className='home_searchbar'>
                    <input type='search' placeholder='Search By Name' className='searchbar'
                        onChange={(e) => setSearchedProduct(e.target.value)} />
                </form>
                <div className='Product_Grid'>
                    {filteredProducts.map((prod, i) => {
                        return (
                            <div className='productContainer' key={i}>
                                <div className='productImage'>
                                    <img src={prod.img} className='productImage' width="100%" height="100%" alt={prod.name} />
                                </div>
                                <div className='ProductDetails'>
                                    <div className='ProductName'>
                                        {prod.name}
                                    </div>
                                    <div className='productPrice'>
                                        &#x20B9; {prod.price}
                                    </div>
                                    <button onClick={() => handleCart(prod)} className='CartBtn'>{tempMessage[prod.id] ||"Add To Cart"}</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

export default Home;
