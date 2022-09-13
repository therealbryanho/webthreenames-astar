export const toWei = (etherValue) => {
    return (parseFloat(etherValue) * 1000000000000000000).toString()
}

export const toEther = (weiValue) => {
    return (parseFloat(weiValue) / 1000000000000000000).toString();
}
