import React, { Fragment, useState } from 'react'
import MetaData from '../layout/MetaData';
import "./Search.css"
import { useHistory } from 'react-router-dom';

const Search = () => {
    const histroy = useHistory();
    const [keyword, setKeyword] = useState("");

    const searchSubmitHandler = (e) => {
        e.preventDefault();

        if (keyword.trim()) {
            histroy.push(`/products/${keyword}`);
        } else {
            histroy.push("/products");
        }

    };
    return (
        <Fragment>
            <MetaData title="Search A Product -- ECOMMERCE" />
            <form className='searchBox' onSubmit={searchSubmitHandler}>
                <input
                    type="text"
                    placeholder="Search a Product ..."
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <input type="submit" value="Search" />
            </form>
        </Fragment>
    )
}

export default Search