import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./CatBrandList.css";
import AddBrand from "../../popups/AddBrand/AddBrand";

export default function CatBrandList() {
    //new thing -> we need to use the variable we defined for dynamic routing here to get the param
    const { categoryName } = useParams();
    const [fetchBrand, setFetchBrand] = useState([]);

    const [brandIsOpen, setBrandIsOpen] = useState(false);

    const setBrandModel = () => {
        setBrandIsOpen(!brandIsOpen);
    };

    const fetchBrandData = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/brand", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            if (!response.ok) {
                console.log("Network error occured", response.statusText);
                return;
            }
            setFetchBrand(data.brands);
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };
    const newBrand = () => {
        fetchBrandData();
    };

    useEffect(() => {
        fetchBrandData();
    }, []);

    return (
        <>
            <section>
                <h1>{categoryName} Brands</h1>
                <div className="brand-list-top">
                    <div className="search-box">
                        <i className="bx bx-search-alt"></i>
                        <input
                            type="text"
                            placeholder="Search brands..."
                            aria-label="Search input"
                        />
                    </div>
                    <div className="btn-container">
                        <button onClick={setBrandModel} className="primary-btn">
                            <i className="bx bx-plus-circle"></i> New Brand
                        </button>
                    </div>
                </div>
                <div className="brand-list">
                    {fetchBrand?.map((item) => (
                        <div className="brand-box" key={item._id}>
                            <h3>
                                {item.brandName} {item.parentCategory}
                            </h3>
                            <p className="brand-stock-availability">Stock available : 80</p>
                            <div className="action-container">
                                <i className="bx bx-edit-alt edit-icon"></i>
                                <i className="bx bx-trash del-icon"></i>
                            </div>
                        </div>
                    ))}
                </div>
                <AddBrand
                    isOpen={brandIsOpen}
                    onClose={setBrandModel}
                    parentCategory={categoryName}
                    newBrand={newBrand}
                />
            </section>
        </>
    );
}
