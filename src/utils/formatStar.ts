export const formatStar = (listRates) => {
    let sum = 0;
    for (let i = 0; i < listRates.length; i++){
      sum += listRates[i];
    }
    const result =  sum / listRates.length;
    return Number(result.toFixed());
}