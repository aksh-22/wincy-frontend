import { createContext } from "react";

export const InvoiceFilterContext = createContext({
  filter: {
    financialYear: null,
    sortBy: "asc",
    subsiduary: null,
  },
  setFilter: () => null,
});
