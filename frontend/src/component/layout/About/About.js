import React from "react";
import "./aboutSection.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from "@material-ui/icons/Instagram";
import MetaData from "../MetaData";
const About = () => {
    const visitInstagram = () => {
        window.location = "https://instagram.com/rajat_dhiman._";
    };
    return (
        <div className="aboutSection">
            <MetaData title={"About"} />
            <div></div>
            <div className="aboutSectionGradient"></div>
            <div className="aboutSectionContainer">
                <Typography component="h1">About Us</Typography>

                <div>
                    <div>
                        <Avatar
                            style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
                            src="https://res.cloudinary.com/dok1rnajd/image/upload/v1676630719/avatars/x84mhh32citbfdikahro.jpg"
                            alt="Founder"
                        />
                        <Typography>Rajat Dhiman</Typography>
                        <Button onClick={visitInstagram} color="primary">
                            Visit Instagram
                        </Button>
                        <span>
                            This is a sample wesbite made by @rajat_dhiman._ Only with the
                            purpose to understand the concepts of Ecom Webiste !
                        </span>
                    </div>
                    <div className="aboutSectionContainer2">
                        <Typography component="h2">Our Brands</Typography>
                        <a
                            href="https://www.facebook.com/rajat.dhiman.3000"
                            target="blank"
                        >
                            <FacebookIcon className="youtubeSvgIcon" />
                        </a>

                        <a href="https://instagram.com/rajat_dhiman._" target="blank">
                            <InstagramIcon className="instagramSvgIcon" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
