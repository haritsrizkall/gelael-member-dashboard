
export const formatCurrency = (value: number) => {
    let IDR = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    });

    return IDR.format(value);
}