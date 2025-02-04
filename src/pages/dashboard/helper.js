export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

export function formatDateForInput(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export const convertToDateInputFormat = (dateString) => {
  if (!dateString) return "";
  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}`;
};

export  const getItemById = (id, data) => {
  console.log("data---",id,data)
    return data.find((item) => item.id === id);
  };

export  const getProductById = (id, data) => {
      return data.find((item) => item.id === id);
    };


export  const orderItemById = (id, data) => {
    return data.find((item) => item.order_id === id);
  };

  export  const categoryItemById = (id, data) => {
    return data.find((item) => item.id === id);
  };


export  const getBrandById = (id, data) => {
    return data?.find((item) => item.brand_id === id);
  };


export  const getCountryById = (id, data) => {
    return data?.find((item) => item.country_id === id);
  };


export  const getMadeofById = (id, data) => {
    return data?.find((item) => item.madeof_id === id);
  };

  export  const getStaffById = (id, data) => {
    return data?.find((item) => item.staff_id === id);
  };

  export  const getIUserById = (id, data) => {
    return data?.find((item) => item.id === id);
  };

  export const findOutOfStockItems = (products) => {
    return products?.filter((product) => product.stock_quantity === 0);
  };

  export const findInactiveItems = (products) => {
    return products?.filter((product) => product.is_active === false);
  };

  export const findActiveItems = (products) => {
    return products?.filter((product) => product.is_active === true);
  };

  export const timeStampToLocalString = (utcTimestamp)=>{
    const localDate = new Date(utcTimestamp);
    const formattedDate = localDate.toLocaleString();
    return formattedDate
  }

// export function formatDate(dateString) {
//   const date = new Date(dateString);
//   const day = String(date.getDate()).padStart(2, '0');
//   const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
//   const year = date.getFullYear();

//   return `${day}/${month}/${year}`;
// }

  


export const  formatBarGraphData = (data) => {
  return data.map(item => ({
    date: item.date,
    value: item.order_count
  }));
};

export const  formatActiveUsersBarGraphData = (data) => {
  return data.map(item => ({
    date: item.date,
    value: item.logged_in_users_count
  }));
};



  