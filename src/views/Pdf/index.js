import React, {Component, Fragment} from 'react';
import Home from '../Home';
import './pdf.css';
import {connect} from "react-redux";
import request from "../../utils/request";
import Content from '../../components/PdfTemplate/Content';
import Cover from '../../components/PdfCoverTemplate/Cover';
import ReactDOMServer from 'react-dom/server';
import pageHtml from '../../components/PdfTemplate/Html';
import coverHtml from '../../components/PdfCoverTemplate/Html';

class Pdf extends Component {
    state = {
        showPrintButton: true
    };
    PHOTO_BOOK_CREATE = "https://myra-photo-book.azurewebsites.net/api/Create";
    // PDF_GENERATOR_URL = "http://pdf.pictureprintshop.com/api/abcpdf";

    // ReactDOMServer.renderToStaticMarkup(element)

    coverHtml = () => {
        return (
            <Fragment>
                <Cover/>
            </Fragment>
        )
    };

    contentHtml = () => {
        return (
            <Fragment>
                <Content/>
            </Fragment>
        )
    };

    onPrintPdf = () => {
        this.setState({showPrintButton: false});
        let static_content_html = ReactDOMServer.renderToStaticMarkup(this.contentHtml());
        let ContentHtml = pageHtml(static_content_html);
        console.log(ContentHtml);
        let static_cover_html = ReactDOMServer.renderToStaticMarkup(this.coverHtml());
        let CoverHtml = coverHtml(static_cover_html);

        return request({
            url: this.PHOTO_BOOK_CREATE,
            method: "POST",
            type: "json",
            params: {
                AccountName: this.props.AccountName,
                ContentHtml: ContentHtml,
                CoverHtml: CoverHtml,
                PageCount: this.props.pages.length - 2
            }
        }).then(response => {
            this.setState({showPrintButton: true});
            let res = null;
            if (response.status === 200) {
                res = JSON.parse(response.responseText);
                console.log(res);
            } else {
                console.log(response);
            }
        }).catch(err => {
            console.log(err);
            this.setState({showPrintButton: true})
        });


        // return fetch(this.PDF_GENERATOR_URL, {
        //     method: 'post',
        //     headers: {'Content-Type': 'application/json', 'token': this.props.token},
        //     body: JSON.stringify({AccountName: this.props.AccountName, Cover: false, Html: ContentHtml})
        // }).then(function (response) {
        //     return response.blob();
        // }).then(function (blob) {
        //     //download this blob
        //     let a = document.createElement("a");
        //     document.body.appendChild(a);
        //     a.setAttribute("style", 'display: none');
        //     let url = window.URL.createObjectURL(blob);
        //     a.href = url;
        //     a.click();
        //     window.URL.revokeObjectURL(url);
        //     a.remove();
        //     this.setState({showPrintButton: true})
        // }).catch(err => {
        //     console.log(err);
        //     this.setState({showPrintButton: true})
        // });

    };

    render() {
        const path = this.props.location.pathname;
        return (
            <div className='pdf'>
                <Home path={path}/>
                {this.state.showPrintButton &&
                <div className='print-button-container text-center'>
                    <button type='button' className='btn btn-primary print-pdf' onClick={this.onPrintPdf}>Print PDF
                    </button>
                </div>
                }
            </div>
        )
    }
}

// Map Redux state to component props
function mapStateToProps(state) {
    return {
        token: state.UploadReducer.token,
        AccountName: state.UploadReducer.AccountName,
        pages: state.PageReducer.pages
    }
}

//connecting out component with the redux store
const PdfContainer = connect(
    mapStateToProps
)(Pdf);
export default PdfContainer;
