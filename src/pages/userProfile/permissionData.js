export const permission_data = [
  { id: 1, name: "CREATE INVOICE", value: "CREATE_INVOICE" },
  { id: 2, name: "GET INVOICES", value: "GET_INVOICES" },
  { id: 3, name: "GIVE PERMISSION", value: "GIVE_PERMISSION" },
  { id: 4, name: "BASIC USER", value: "BASIC_USER" },
  { id: 5, name: "ADMIN USER", value: "ADMIN_USER" },
  { id: 6, name: "MARKETING", value: "MARKETING" },
];

export const getSelectedPermission = (arr) => {
  let a = [];
  permission_data.forEach((el) => {
    if (arr.includes(el.value)) {
      a.push(el);
    }
  });
  return a;
};

export const getNotSelectedPermission = (arr) => {
  let a = [];
  permission_data.forEach((el) => {
    if (!arr.includes(el.value)) {
      a.push(el);
    }
  });
  return a;
};
