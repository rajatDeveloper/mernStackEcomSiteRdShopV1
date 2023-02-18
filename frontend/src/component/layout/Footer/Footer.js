import React from 'react'
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import "./Footer.css";
function Footer() {
    return (
        <footer id='footer'>
            <div className='leftFooter'>
                <h4>Downoload our App ! </h4>
                <p>Downoload App for Android and IOS mobile phone ! </p>
                <img src={playStore} alt="playstore" />
                <img src={appStore} alt="appstore" />
            </div>

            <div className='midFooter'>
                <h1>Rd Shop ! </h1>
                <p>High Quality is our first priority !</p>

                <p>Copyrights 2023 &copy; Rd Software</p>
            </div>
            <div className='rightFooter'>
                <h4>Follow Us ! </h4>
                <a href='https://www.instagram.com/rajat_dhiman._/'>Instagram</a>
                <a href='https://www.instagram.com/rajat_dhiman._/'>YouTube</a>
                <a href='https://www.instagram.com/rajat_dhiman._/'>FaceBook</a>
            </div>
        </footer>
    );
}

export default Footer