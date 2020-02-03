import React, {Component, Fragment} from 'react';
import Page from "./Page";


class Cover extends Component {

    render() {
        // here get the photo_book object from the localStorage
        // we only have two page front and back
        let pages = [];
        // here get the photo_book object from the localStorage
        if (localStorage.getItem('photo_book')) {
            pages = JSON.parse(localStorage.getItem('photo_book')).pages;
        }
        // we should exclude the front and back page from the pages array
        // remove the front
        let front = pages.shift();
        // remove the back
        let back = pages.pop();
        return (
            <Fragment>
                <Page page={back} layout={back.layout}/>
                <div style={{float: 'left', height: '100%', width: '2%'}}></div>
                <Page page={front} layout={front.layout}/>
            </Fragment>
        )
    }
}

export default Cover;
