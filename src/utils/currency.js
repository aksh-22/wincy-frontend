export const currency = ["USD", "SAR", "INR"];

export const currencySymbol = (currency) => {
    switch (currency) {
      case "USD":
        return <>$</>;
      case "INR":
        return <>&#8377;</>;
      case "SAR":
        return <>SAR</>;
      case "EURO":
        return <>&euro;</>;
      default:
        return <>$</>;
    }
  };
  
