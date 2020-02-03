import React, {Component, Fragment} from 'react';
import './home.css';
import Page from '../../components/Page';
import * as actionCreators from "../../store/actions";
import {connect} from "react-redux";
import {Col, Modal, ModalBody, Row} from 'reactstrap';
import queryString from 'qs';
import Sidebar from "../../components/Sidebar";
import Footer from "../../layout/Footer";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

class Home extends Component {

    componentDidMount() {
        // redirect to the login page if the token does not exist.
        if (!localStorage.getItem('token')) {
            window.location.replace('https://myraprints.com/sign-in');
        }
        const photo_book_order = {
            coupon: '',
            fullName: '',
            line1: '',
            line2: '',
            postalCode: '',
            email: '',
            city: '',
            state: '',
            countryCode: '',
            photoBookId: '',
            amount: 0.0,
            orderId: ''
        };
        localStorage.setItem('photo_book_order', JSON.stringify(photo_book_order));
        if (localStorage.getItem('photo_book')) {
            const photo_book = JSON.parse(localStorage.getItem('photo_book'));

            this.props.updatePageState({field: 'pages', value: photo_book.pages});
            this.props.updatePageState({field: 'locked', value: photo_book.locked});
        } else {
            // initially we will have 20 pages and front and back. that means total 22 pages
            // we need to change the design of the object
            // we should make front and back part of the pages array.
            // and we can tell the pages[0] is the front and pages[pages.length-1] is the back page
            // this design will help us a lot to remove the complex logic in the PageReducer
            const photo_book = {};
            photo_book.pages = [];
            let image_object = {
                path: '',
                file_id: '',
                file_reference: '',
                file_name: '',
                resolutions: [],
                date_taken: '',
                date_created: '',
                top: 0,
                left: 0
            };
            photo_book.locked = true;
            let layout_no = 1;
            for (let i = 1; i <= 22; i++) {
                layout_no = layout_no === 6 ? 1 : layout_no;
                photo_book.pages.push({
                    layout: `${layout_no}`,
                    image1: image_object,
                    image2: image_object,
                    image3: image_object,
                    text1: "",
                    text2: ""
                });
                layout_no++;
            }
            localStorage.setItem('photo_book', JSON.stringify(photo_book));
            let new_photo_book = JSON.parse(localStorage.getItem('photo_book'));
            for (let i = 0; i < new_photo_book.pages.length; i++) {
                if (parseInt(new_photo_book.pages[i].layout) === 1) {
                    // image 1
                    new_photo_book.pages[i].image1.currentX = -12;
                    new_photo_book.pages[i].image1.currentY = -8;
                    new_photo_book.pages[i].image1.top = 84;
                    new_photo_book.pages[i].image1.left = 70;

                    // image2
                    new_photo_book.pages[i].image2.currentX = -12;
                    new_photo_book.pages[i].image2.currentY = -8;
                    new_photo_book.pages[i].image2.top = 84;
                    new_photo_book.pages[i].image2.left = 70;

                    // image3
                    new_photo_book.pages[i].image3.currentX = -12;
                    new_photo_book.pages[i].image3.currentY = -8;
                    new_photo_book.pages[i].image3.top = 84;
                    new_photo_book.pages[i].image3.left = 70;

                } else if (parseInt(new_photo_book.pages[i].layout) === 2) {
                    // image1
                    new_photo_book.pages[i].image1.currentX = -12;
                    new_photo_book.pages[i].image1.currentY = -19;
                    new_photo_book.pages[i].image1.top = 73;
                    new_photo_book.pages[i].image1.left = 100;

                    // image2
                    new_photo_book.pages[i].image2.currentX = -12;
                    new_photo_book.pages[i].image2.currentY = -19;
                    new_photo_book.pages[i].image2.top = 73;
                    new_photo_book.pages[i].image2.left = 100;
                    // image3
                    new_photo_book.pages[i].image3.currentX = -12;
                    new_photo_book.pages[i].image3.currentY = -19;
                    new_photo_book.pages[i].image3.top = 73;
                    new_photo_book.pages[i].image3.left = 100;

                } else if (parseInt(new_photo_book.pages[i].layout) === 3) {
                    // image1
                    new_photo_book.pages[i].image1.currentX = -7;
                    new_photo_book.pages[i].image1.currentY = -6;
                    new_photo_book.pages[i].image1.top = 57;
                    new_photo_book.pages[i].image1.left = 45;
                    // image2
                    new_photo_book.pages[i].image2.currentX = -7;
                    new_photo_book.pages[i].image2.currentY = -6;
                    new_photo_book.pages[i].image2.top = 57;
                    new_photo_book.pages[i].image2.left = 45;
                    // image3
                    new_photo_book.pages[i].image3.currentX = -7;
                    new_photo_book.pages[i].image3.currentY = -6;
                    new_photo_book.pages[i].image3.top = 57;
                    new_photo_book.pages[i].image3.left = 45;

                } else if (parseInt(new_photo_book.pages[i].layout) === 4) {
                    // image1
                    new_photo_book.pages[i].image1.currentX = -14;
                    new_photo_book.pages[i].image1.currentY = -13;
                    new_photo_book.pages[i].image1.top = 54.40;
                    new_photo_book.pages[i].image1.left = 67;
                    // image2
                    new_photo_book.pages[i].image2.currentX = -13;
                    new_photo_book.pages[i].image2.currentY = -12;
                    new_photo_book.pages[i].image2.top = 57;
                    new_photo_book.pages[i].image2.left = 52.80;
                    // image3
                    new_photo_book.pages[i].image3.currentX = -13;
                    new_photo_book.pages[i].image3.currentY = -12;
                    new_photo_book.pages[i].image3.top = 57;
                    new_photo_book.pages[i].image3.left = 52.80;
                } else {
                    // image1
                    new_photo_book.pages[i].image1.currentX = -8;
                    new_photo_book.pages[i].image1.currentY = -3;
                    new_photo_book.pages[i].image1.top = 70;
                    new_photo_book.pages[i].image1.left = 56.58;
                    // image2
                    new_photo_book.pages[i].image2.currentX = -18;
                    new_photo_book.pages[i].image2.currentY = -13;
                    new_photo_book.pages[i].image2.top = 40.7;
                    new_photo_book.pages[i].image2.left = 45.6;
                    // image3
                    new_photo_book.pages[i].image3.currentX = -18;
                    new_photo_book.pages[i].image3.currentY = -13;
                    new_photo_book.pages[i].image3.top = 40.7;
                    new_photo_book.pages[i].image3.left = 45.6;
                }

            }
            localStorage.setItem('photo_book', JSON.stringify(new_photo_book));
            this.props.updatePageState({field: 'pages', value: new_photo_book.pages});
            this.props.updatePageState({field: 'locked', value: new_photo_book.locked})
        }
        // check the localStorage if the token already in the localStorage and also the name then redirect to /
        // else get the token and name from the query string and save into the localStorage
        if (typeof this.props.location !== 'undefined') {
            let query_string = queryString.parse(this.props.location.search, {ignoreQueryPrefix: true});
            if (localStorage.getItem('name') && localStorage.getItem('token')) {
                let name = query_string.name;
                let new_token = query_string.token;
                if ((typeof name !== 'undefined' && name !== '') && (typeof new_token !== 'undefined' && new_token !== '')) {
                    localStorage.setItem('name', name);
                    localStorage.setItem('token', new_token);
                }
                // redirect to the / url
                this.props.history.push(`/`);
            } else {
                let name = query_string.name;
                let token = query_string.token;
                localStorage.setItem('name', name);
                localStorage.setItem('token', token);
                // redirect to the / url
                this.props.history.push(`/`);
            }
        }
        // set the name and token
        const AccountName = localStorage.getItem("name");
        const token = localStorage.getItem("token");
        this.props.updateState({field: "AccountName", value: AccountName});
        this.props.updateState({field: "token", value: token});
    }

    addPhotosPages = () => {
        this.props.addPhotosPages({sidebar_images: this.props.sidebar_images});
        // here we need to read the sidebar_images from the localStorage and then update the state
        if (localStorage.getItem('sidebar_images')) {
            const sidebar_images = JSON.parse(localStorage.getItem('sidebar_images'));
            this.props.updateState({field: "sidebar_images", value: sidebar_images});
        }
    };
    toggleZoom = () => {
        this.props.exitZoom({page_index: this.props.zoom_page.page_index});
    };
    redirect = () => {
        this.props.history.push(`/address`)
    };

    render() {
        const {pages, zoom, zoom_page, sidebar_images, locked} = this.props;
        // ********************* Enter the group photos logic here *********************
        const path = typeof this.props.path !== 'undefined' ? this.props.path : '';
        let chunk_size = 4;
        let grouped_pages = [];

        // let page_arr = pages ******* Wrong Approach because this will effect the original state pages ******
        // from pages remove the first index item and last index item. since first index item is the front and last index item is the back page
        let page_arr_without_front_back = [...pages];
        // remove the front
        page_arr_without_front_back.shift();
        // remove the back
        page_arr_without_front_back.pop();

        let page_arr = page_arr_without_front_back;
        while (page_arr.length) {
            grouped_pages.push(page_arr.splice(0, chunk_size));
        }
        let page_no = 0;
        // page_index = 1 because page_index = 0 is the front page
        let page_index = 1;
        let all_pages = grouped_pages.map((group_arr, key) => {
            return (<section key={key} className='product'>
                {
                    group_arr.map((page, index) => {
                        page_no++;
                        // here we need to make another group for two page
                        let new_page = <div className='page-wrapper' key={index}>
                            <Page page_no={page_no}
                                  page_index={page_index} page={page}
                                  layout={page.layout} path={path}
                                  title={'Page ' + page_no}/>
                        </div>;
                        page_index++;
                        return new_page

                    })
                }
            </section>)
        });
        let show_add_photos_pages = true;
        for (let i = 0; i < pages.length; i++) {
            if (pages[i].image1.file_id !== '' || pages[i].image2.file_id !== '' || pages[i].image3.file_id !== '') {
                show_add_photos_pages = false;
                break;
            }
        }
        show_add_photos_pages = show_add_photos_pages && sidebar_images.length > 0;
        let back_page_index = pages.length - 1;

        return (
            <Fragment>
                <Row className='app'>
                    <Col className='col-md-2 bg-red'>
                        <Sidebar/>
                    </Col>
                    <Col className='col-md-10 main-body'>
                        <div className='top-buttons'>
                            {show_add_photos_pages && <div className='btn-add-all-photo'>
                                <button type='button' onClick={() => this.addPhotosPages()} className='btn btn-primary'>
                                    Add all photos to pages
                                </button>
                            </div>
                            }
                            <button type='button' className='btn-lock' onClick={this.props.lockPage}>
                                <FontAwesomeIcon icon={locked ? 'lock' : 'lock-open'}/>
                            </button>
                        </div>
                        {/*************************** Display the zoom page modal ********************************/}
                        <Modal isOpen={zoom} centered={true} size='lg' toggle={this.toggleZoom} autoFocus={false}>
                            <ModalBody>
                                <Page page_no='Zoom' page={zoom_page} layout={zoom_page.layout}
                                      page_index={zoom_page.page_index} title={zoom_page.title} path={path}/>
                            </ModalBody>
                        </Modal>

                        {/*************************** End of zoom page modal ********************************/}
                        {
                            typeof pages[0] !== 'undefined' && <section className="product front-product">
                                <Page page_no='Front' page={pages[0]} layout={pages[0].layout} page_index='0'
                                      path={path}
                                      title='Front'/>
                            </section>
                        }
                        {all_pages}
                        <div className='text-center btn-add-remove-container'>
                            <button type='button' className='btn btn-primary btn-add-page'
                                    onClick={() => this.props.addPages()}>Add Pages
                            </button>
                            {/*Display the remove button only if the pages length is greater than 20*/}
                            {pages.length > 22 &&
                            <button type='button' className='btn btn-danger btn-remove-page'
                                    onClick={() => this.props.removePages()}>Remove Pages
                            </button>}
                        </div>
                        {
                            typeof pages[pages.length - 1] !== 'undefined' && <section className='product back-product'>
                                <Page page_no='Back' page={pages[pages.length - 1]}
                                      layout={pages[pages.length - 1].layout}
                                      page_index={back_page_index} path={path}
                                      title='Back'/>
                            </section>
                        }
                    </Col>
                </Row>
                <Footer redirect={this.redirect}/>
            </Fragment>
        )
    }
}

// Map Redux state to component props
function mapStateToProps(state) {
    return {
        pages: state.PageReducer.pages,
        locked: state.PageReducer.locked,
        sidebar_images: state.UploadReducer.sidebar_images,
        front: state.PageReducer.front,
        back: state.PageReducer.back,
        zoom: state.PageReducer.zoom,
        zoom_page: state.PageReducer.zoom_page,
        token: state.UploadReducer.token,
        files: state.UploadReducer.files,
        files_count: state.UploadReducer.files_count,
        file_info: state.PageReducer.file_info,
        AccountName: state.UploadReducer.AccountName,
        CurrentFolder: state.UploadReducer.CurrentFolder,
        current_uploads: state.UploadReducer.current_uploads,
        uploaded_files: state.UploadReducer.uploaded_files,
        uploaded_count: state.UploadReducer.uploaded_count,
        latest_uploaded: state.UploadReducer.latest_uploaded
    }
}

// Map Redux action to component `props
function mapDispatchToProps(dispatch) {
    return {
        addPages: () => dispatch(actionCreators.addPages()),
        lockPage: () => dispatch(actionCreators.lockPage()),
        addPhotosPages: (payload) => dispatch(actionCreators.addPhotosPages(payload)),
        removePages: () => dispatch(actionCreators.removePages()),
        updatePageState: (payload) => dispatch(actionCreators.updatePageState(payload)),
        setCurrentUpload: (payload) => dispatch(actionCreators.setCurrentUpload(payload)),
        updateState: (payload) => dispatch(actionCreators.updateState(payload)),
        uploadBlob: (payload) => dispatch(actionCreators.uploadBlob(payload)),
        processImage: (payload) => dispatch(actionCreators.processImage(payload)),
        getUploadLink: (payload) => dispatch(actionCreators.getUploadLink(payload)),
        exitZoom: (payload) => dispatch(actionCreators.exitZoom(payload))
    }
}

//connecting out component with the redux store
const HomeContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);

export default HomeContainer;
