import React, { Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { Link } from "react-router-dom";
import "./Profile.css";
import { useHistory } from 'react-router-dom';
import MetaData from "../layout/MetaData"

const Profile = () => {
    var data = useSelector((state) => state.user);
    var user = data.user;
    var loading = data.loading;
    var isAuthenticated = data.isAuthenticated;
    var history = useHistory();

    useEffect(() => {
        if (isAuthenticated === false) {
            history.push("/login");
        }
    }, [isAuthenticated]);
    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title={`${user.name}'s Profile`} />
                    <div className="profileContainer">
                        <div>
                            <h1>My Profile</h1>
                            <img src={user.avatar.url} alt={user.name} />
                            <Link to="/me/update">Edit Profile</Link>
                        </div>
                        <div>
                            <div>
                                <h4>Full Name</h4>
                                <p>{user.name}</p>
                            </div>
                            <div>
                                <h4>Email</h4>
                                <p>{user.email}</p>
                            </div>
                            <div>
                                <h4>Joined On</h4>
                                <p>{String(user.createdAt).substr(0, 10)}</p>
                            </div>

                            <div>
                                <Link to="/orders">My Orders</Link>
                                <Link to="/password/update">Change Password</Link>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default Profile;
