import moment from "moment";

export const formatCurrency = (value: number) => {
    let IDR = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    });

    return IDR.format(value);
}

export const toUtcDate = (date: string) => {
    return moment(date).utc()
}

export const toLocalDate = (date: string) => {
    return moment(date).local();
}