import React from "react";
import {COLORS} from "../../../values/Colors";
import {Container} from "./PageTitleStyles";

function PageTitle({pageTitle, icon}) {

    return (
        <Container>
            <div className="container">
                <br/>
                <br/>
                <br/>
                <div className="textAlignCenter">
                    <i className={icon} style={{fontSize: '3rem', color: COLORS.SECONDARY}}></i>
                    <br/>
                    <br/>
                    <h2 className="titlePage">{pageTitle}</h2>

                    <br/>
                    <br/>
                </div>
            </div>
        </Container>
    );

}

export default PageTitle;