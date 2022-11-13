const handlePrice = (valor: string | number): string => {
    const val =
        typeof valor == "string"
            ? valor.replace(/\D/g, "")
            : valor.toString();
    const valFixed =
        typeof valor == "string"
            ? `${(parseInt(val) / 100).toFixed(2)}`
            : `${parseFloat(val).toFixed(2)}`;
    if (val.length < 18) {
        const result = valFixed
            .replace(".", ",")
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        valor = isNaN(parseInt(val) / 100) ? "0,00" : result;
    }
    return valor as string;
};

export {handlePrice}