import React from 'react'
import "../Styles/Orders.css";
import { useProdValue } from '../productContext';
import Spinner from 'react-spinner-material';

function Orders() {
    const {orders, loading} = useProdValue();

    if (loading) {
        return (
            <div className="spinner-container">
                <Spinner radius={50} color={"#333"} stroke={2} visible={true} />
            </div>
        );
    }

    return (
        <div className='OrdersPage'>
            <h1>Your Orders</h1>
            {[...orders].reverse().map(order => (
                // ... rest of the component code remains unchanged
                <div key={order.id} className='order'>
                <div className='orderOn'>
                    <h2>Ordered On: {order.date}</h2>
                </div>
                <table className='orderTable'>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map(item => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>₹ {item.price}</td>
                                <td>{item.qty}</td>
                                <td>₹ {item.price * item.qty}</td>
                            </tr>
                        ))}
                        <tr className='orderTable_totalPrice'>
                            <td>₹ {order.total}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            ))}
        </div>
    )
}

export default Orders;