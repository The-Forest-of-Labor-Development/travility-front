import React, { useState } from "react";
import styles from "../../../styles/accountbook/AccountBookDetail.module.css";

const categoryImages = {
  TRANSPORTATION: "transportation.png",
  ACCOMMODATION: "accommodation.png",
  FOOD: "food.png",
  TOURISM: "tourism.png",
  SHOPPING: "shopping.png",
  OTHERS: "others.png",
};

const ExpenseItem = ({
  type,
  category,
  currency,
  amount,
  description,
  imgName,
}) => {
  const [imgError, setImgError] = useState(false);
  const categoryImage = categoryImages[category] || "others.png";

  return (
    <div className={styles.expenseItem}>
      <span className={styles.type}>{type}</span>
      <img
        className={styles.categoryImg}
        src={`/images/account/category/${categoryImage}`}
        alt={category}
      />
      <span className={styles.currency}>{currency}</span>
      <span className={styles.amount}>{amount}</span>
      <span className={styles.description}>{description}</span>
      {imgError || !imgName ? (
        <div className={`${styles.expenseImg} ${styles.defaultImg}`}></div>
      ) : (
        <img
          className={styles.expenseImg}
          src={`/images/account/${imgName}`}
          alt=""
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );
};

export default ExpenseItem;
