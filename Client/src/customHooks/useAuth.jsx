import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [fetchBrand, setFetchBrand] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryLength, setCategoryLength] = useState([]);
  const [stockData, setStockData] = useState({});
  const [catStock, setCatStock] = useState({});
  const fetchBrandData = async (catName) => {
    const categoryName = catName.charAt(0).toUpperCase() + catName.slice(1);
    // console.log(categoryName);
    try {
      const response = await fetch(`http://localhost:3000/api/brandList`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoryName }),
      });
      const data = await response.json();
      if (!response.ok) {
        setFetchBrand([]);
        console.log("Network error occurred", response.statusText);
        return;
      }
      console.log(data);
      setFetchBrand(data.brands);
      setStockData(data.stockByBrand);
      return data.brands;
    } catch (error) {
      console.error(error);
    }
  };
  const fetchCategory = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/category", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) {
        console.log("Error while fetching data");
        return;
      }
      setCatStock(data.catStocks);
      setCategoryLength(data.cats.length);
      setCategories(data.cats);
    } catch (error) {
      console.error(error);
    }
  };

  const authenticateUser = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        console.log(response.statusText);
        return;
      }
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        fetchBrand,
        fetchCategory,
        categories,
        setCategories,
        fetchBrandData,
        categoryLength,
        authenticateUser,
        stockData,
        catStock,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const AuthContextValue = useContext(AuthContext);
  if (!AuthContextValue) {
    throw new Error("useAuth is outside the provider");
  }
  return AuthContextValue;
};
