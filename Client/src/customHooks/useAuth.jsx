import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [fetchBrand, setFetchBrand] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchBrandData = async (catName) => {
    const categoryName = catName.toLowerCase();
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
      // console.log(data);
      setCategories(data.cats);
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
