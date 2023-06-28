export const sumPrice = (totalPrice) => {
    let sum = 0;
    for (let i = 0; i < totalPrice?.length; i++){
      sum += totalPrice[i];
    }
    return sum;
  } 