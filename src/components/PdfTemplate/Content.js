import React, {Component, Fragment} from 'react';
import Page from './Page';

class Content extends Component {

    render() {
        let pages = [];
        // here get the photo_book object from the localStorage
        if (localStorage.getItem('photo_book')) {
            pages = JSON.parse(localStorage.getItem('photo_book')).pages;
        }
        // we should exclude the front and back page from the pages array
        // remove the front
        pages.shift();
        // remove the back
        pages.pop();
        let all_pages = pages.map((page, key) => {
            return (
                <Page key={key} page={page} layout={page.layout}/>
            )
        });
        return (
            <Fragment>
                {all_pages}
            </Fragment>
        )
    }
}

export default Content;
