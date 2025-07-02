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
                                src={`https://pub-4ccc84ea168e4aa58beb7628465ec31e.r2.dev/${item.productImage}`}
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
