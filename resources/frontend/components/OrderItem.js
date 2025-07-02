import React from "react";
import styles from "./OrderItem.module";
import Button from "./Button";
import { setFulfill } from "../ajax/backend";
import { useFlashMessage } from "../context/FlashMessage";

export default function OrderItem({
    orderID,
    orderItems,
    isFulfilled,
    isActive,
    setFulfillStatus,
}) {
    const { setFlashMessage, setFlashStatus } = useFlashMessage();

    const handleFulfill = (orderID) => {
        setFulfill(orderID, setFlashMessage, setFlashStatus);
        setFulfillStatus("Fulfilled");
    };

    return (
        <div className={styles.orderItemContainer}>
            {orderItems &&
                orderItems.map((item, index) => (
                    <div key={index} className={styles.orderItemInfo}>
                        <div className={styles.orderItemImageContainer}>
                            <img
                                src={`${process.env.REACT_APP_R2_PUBLIC_URL}/${item.productImage}`}
                                alt={item.productName}
                                className={styles.orderItemImage}
                            />
                        </div>
                        <div className={styles.description}>
                            <p>{item.productName}</p>
                        </div>
                        <div className={styles.priceQuantity}>
                            <span>₱ {item.productPrice}</span>
                            <span>x</span>
                            <span>{item.orderItemQuantity}</span>
                        </div>
                        <span className={styles.itemTotalPrice}>
                            ₱ {item.orderItemTotal}
                        </span>
                    </div>
                ))}
            {!isFulfilled && isActive && (
                <Button
                    label="Pack order"
                    className={styles.orderItemButton}
                    onClick={() => handleFulfill(orderID)}
                />
            )}
        </div>
    );
}
