import React, { Fragment, Component } from 'react';
import layoutTwoActive from "../../assets/img/2s.png";
import layout1 from '../../assets/img/1.png';
import layout3 from "../../assets/img/3.png";
import layout4 from "../../assets/img/4.png";
import layout5 from "../../assets/img/5.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './two.css'
import * as actionCreators from "../../store/actions";
import { connect } from "react-redux";
import { repositionImage } from "../../utils/functions";
import PageFileUploader, { IMAGE_SERVER_URL } from "../PageFileUploader";
import Draggable from '../Draggable';


const onZoomPageHandler = (event, payload) => {
    payload.zoomPage({ page_index: payload.page_index, title: payload.title, clickedInput: payload.clickedInput });
};
const onRemoveImageFromPage = (payload) => {
    let sidebar_images = [...payload.sidebar_images];
    sidebar_images.push(payload.page[payload.image_no]);
    payload.sidebar_images = sidebar_images;
    payload.updateState({ field: "sidebar_images", value: sidebar_images });
    payload.removePageImage(payload);
    // set Up the reducer to remove the image from the page
    // and finally add the image to the sidebar_images
};

class LayoutTwo extends Component {

    constructor(props) {
        super(props);
        this.textInput = React.createRef();
        this.focus = this.focus.bind(this);
    }
    state = {
        showImage1Buttons: false,
        active: false,
        draggable: true,
        enterKey: false,
        currentX: 0,
        currentY: 0,
        xPos: 50,
        yPos: 50,
    };
    componentWillMount() {
        // set xOffset, yOffset, xPos,yPos, currentX and currentY
        this.setState({
            currentX: this.props.page.image1.currentX,
            currentY: this.props.page.image1.currentY,
            xPos: this.props.page.image1.left,
            yPos: this.props.page.image1.top
        })
    }

    focus = () => {
        // Explicitly focus the text input using the raw DOM API
        // Note: we're accessing "current" to get the DOM node
        this.textInput.current.focus();
    };
    focusChange = (e) => {
        // set the cursor position to the end of the text
        let temp_value = e.target.value;
        e.target.value = '';
        e.target.value = temp_value;
        if (!this.props.zoom) {
            this.textInput.current.blur();
        }
    };
    textAreaClick = (evt, payload) => {
        let inpRect = this.textInput.current.getBoundingClientRect(),
            x = evt.clientX,
            y = evt.clientY,
            l = inpRect.left,
            w = l + inpRect.width,
            t = inpRect.top,
            h = t + inpRect.height;

        if (x >= l && x <= w && y >= t && y <= h) {
            let isMobile = window.matchMedia("(max-width: 600px)").matches;
            if (!isMobile) {
                this.focus();
                payload.clickedInput = 'none';
                onZoomPageHandler(evt, payload);
            }
        }
    };

    onKeyChange = (event) => {
        if (event.keyCode === 13) {
            this.setState({ enterKey: true });
            this.props.exitZoom({ page_index: this.props.zoom_page.page_index });
        } else {
            this.setState({ enterKey: false })
        }
    };

    onChangePageTextHandler = (event, payload) => {
        //let final_string = textAlignment(event.target.value, 69);
        // let final_string = alignText(event.target.value, 64);
        if (this.state.enterKey) return;

        payload.changePageText({
            text: event.target.value,
            page_index: payload.page_index,
            text_no: payload.text_no,
            title: payload.title
        });
    };
    onDragStart = (ev, payload) => {
        ev.dataTransfer.setData("id", payload.file_id);
        ev.dataTransfer.setData("from_page", payload.from_page);
        ev.dataTransfer.setData("from_image", payload.from_image);
    };
    // this will fire when a image is drop into another image
    onDropImageHandler = (event, payload) => {
        let from_page = event.dataTransfer.getData('from_page');
        let from_image = event.dataTransfer.getData('from_image');
        if (!(from_page === payload.page_index.toString() && from_image === payload.image)) {
            this.props.dropImageToAnother({
                page_index: payload.page_index,
                image: payload.image,
                from_page: from_page,
                from_image: from_image
            });
        }
    };

    _move = (currentX, currentY, xPos, yPos) => {
        if (this.state.active) {
            repositionImage({ page_index: this.props.page_index, currentX, currentY, xPos, yPos, image_no: 'image1' });
            this.setState({ currentX, currentY, xPos, yPos });
        }
    };
    render() {
        const { page_index, changeLayout, page, changePageText, zoomPage, title, removePageImage, sidebar_images, updateState, page_no, path, zoom } = this.props;
        let selected_image = '';
        if (path === '/pdf') {
            selected_image = IMAGE_SERVER_URL + page.image1.file_reference;
        } else {
            if (page_no === 'Zoom') {
                // check if the resolution array contains the 1600
                // then select the 1600 image
                // if 1600 not available then select the original image resolution
                selected_image = page.image1.resolutions.findIndex(r => r === 1600) > -1 ?
                    IMAGE_SERVER_URL + page.image1.file_reference + '1600' : IMAGE_SERVER_URL + page.image1.file_reference;
            } else {
                selected_image = page.image1.resolutions.findIndex(r => r === 200) > -1 ?
                    IMAGE_SERVER_URL + page.image1.file_reference + '200' : IMAGE_SERVER_URL + page.image1.file_reference;
            }
        }

        // safari doesn't support object-position css property. so we need to use the image using css background image
        return (
            <Fragment>
                <h4 className="page_title">
                    <span className='page-title-text'>{title}</span>
                    <div className='btn-search-left-line'></div>
                    <div className="top">
                        <input type="image" src={layout1}
                            onClick={() => changeLayout({ page_index: page_index, layout: '1', title })}
                            className="img-input"
                            alt='some label' />
                        <input type="image" src={layoutTwoActive} className="img-input" alt='some label' />
                        <input type="image" src={layout3}
                            onClick={() => changeLayout({ page_index: page_index, layout: '3', title })}
                            className="img-input"
                            alt='some label' />
                        <input type="image" src={layout4}
                            onClick={() => changeLayout({ page_index: page_index, layout: '4', title })}
                            className="img-input"
                            alt='some label' />
                        <input type="image" src={layout5}
                            onClick={() => changeLayout({ page_index: page_index, layout: '5', title })}
                            className="img-input"
                            alt='some label' />
                        <button className="btn-search" type="button"
                            onClick={(event) => onZoomPageHandler(event, { page_index, zoomPage, title, clickedInput: 'none' })}>
                            <FontAwesomeIcon icon="search" className="search-icon" />
                        </button>

                    </div>
                </h4>
                <div className="layout2" onClick={(event) => !zoom ? this.textAreaClick(event, { page_index, zoomPage, title }) : false}>
                    <textarea className={page_no === 'Zoom' ? "layout2-zoom-input" : "layout2-input"}
                        placeholder="Type text here" value={page.text1}
                        ref={this.textInput}
                        autoFocus={page_no === 'Zoom' && zoom}
                        onFocus={(event) => this.focusChange(event)}
                        onKeyDown={(event) => this.onKeyChange(event)}
                        onChange={(event) => this.onChangePageTextHandler(event, {
                            text_no: 'text1',
                            page_index,
                            changePageText,
                            title
                        })} />
                    {/***************** Display the file if file_id not empty else display the FileUploader *********************/}
                    {page.image1.file_id !== '' && (
                        <div
                            className={'img-container ' + (page_no === 'Zoom' ? "layout2-zoom-image" : "layout2-image")}
                            draggable={this.state.draggable}
                            onDragStart={(e) => this.onDragStart(e, {
                                file_id: page.image1.file_id,
                                from_page: page_index,
                                from_image: 'image1'
                            })}
                            onDrop={(event) => this.onDropImageHandler(event, {
                                page_index,
                                image: 'image1',
                            })}
                            id={page.image1.file_id}
                            style={{
                                background: `url(${selected_image}) ${this.state.xPos}% ${this.state.yPos}% / cover no-repeat`,
                            }}
                            onMouseEnter={() => this.setState({ showImage1Buttons: true })}
                            onMouseLeave={() => this.setState({ showImage1Buttons: false, active: false, draggable: true })}
                            onTouchStart={() => this.setState({ showImage1Buttons: true })}
                            onTouchEnd={() => this.setState({ showImage1Buttons: false })}>
                            <button type='button'
                                className={'btn-remove-img-from-page ' + (this.state.showImage1Buttons ? '' : 'display-none')}
                                onClick={() => onRemoveImageFromPage({
                                    image_no: 'image1',
                                    file_id: page.image1.file_id,
                                    page_index: page_index,
                                    sidebar_images,
                                    updateState,
                                    page,
                                    removePageImage
                                })}>
                                <FontAwesomeIcon icon="trash" />
                            </button>
                            {/*Image reposition buttons needs to position in image center. and the button will only show when hover over image*/}
                            {/*object-position: 10% 10%; first 10% is for left and right positioning. and another 10% is for top and bottom positioning*/}
                            {/*when click on btn-arrow-up button then value will increase up to 100%. when click on btn-arrow-down button then value will decrease up to 0 */}
                            {this.state.showImage1Buttons &&
                                <Draggable
                                    x={this.state.currentX}
                                    y={this.state.currentY}
                                    xPos={this.state.xPos}
                                    yPos={this.state.yPos}
                                    xPosSum={124}
                                    yPosSum={-17}
                                    xMul={1}
                                    yMul={1}
                                    xMax={120}
                                    xMin={-125}
                                    yMax={132}
                                    yMin={16}
                                    onMove={this._move}>
                                    <div className='btn-reposition-image'
                                        onMouseDown={() => this.setState({ draggable: false, active: true })}
                                        onMouseUp={() => this.setState({ draggable: true, active: false })}
                                        onTouchStart={() => this.setState({ draggable: false, active: true })}
                                        onTouchEnd={() => this.setState({ draggable: true, active: false })}>
                                        {/*arrow-right, arrow-left, arrow-up, arrow-down*/}
                                        <button className='btn-arrow-left'><FontAwesomeIcon icon='angle-left' /></button>
                                        <button className='btn-arrow-right'><FontAwesomeIcon icon='angle-right' /></button>
                                        <button className='btn-center-image'>
                                            {/*    center image icon*/}
                                        </button>
                                        <button className='btn-arrow-up'><FontAwesomeIcon icon='angle-up' /></button>
                                        <button className='btn-arrow-down'><FontAwesomeIcon icon='angle-down' /></button>
                                    </div></Draggable>}
                        </div>

                    )}
                    {page.image1.file_id === '' &&
                        <PageFileUploader page={page} page_index={page_index} image='image1' title={title}
                            className={page_no === 'Zoom' ? 'layout2-zoom-image-uploader' : 'layout2-image-uploader'} />
                    }
                </div>
            </Fragment>
        )
    }

}

// Map Redux state to component props
function mapStateToProps(state) {
    return {
        pages: state.PageReducer.pages,
        zoom_page: state.PageReducer.zoom_page,
        zoom: state.PageReducer.zoom,
        sidebar_images: state.UploadReducer.sidebar_images
    }
}

// Map Redux action to component props
function mapDispatchToProps(dispatch) {
    return {
        changeLayout: (payload) => dispatch(actionCreators.changeLayout(payload)),
        changePageText: (payload) => dispatch(actionCreators.changePageText(payload)),
        zoomPage: (payload) => dispatch(actionCreators.zoomPage(payload)),
        updateState: (payload) => dispatch(actionCreators.updateState(payload)),
        removePageImage: (payload) => dispatch(actionCreators.removePageImage(payload)),
        repositionImage: (payload) => dispatch(actionCreators.repositionImage(payload)),
        dropImageToAnother: (payload) => dispatch(actionCreators.dropImageToAnother(payload)),
        exitZoom: (payload) => dispatch(actionCreators.exitZoom(payload))
    }
}

//connecting out component with the redux store
const LayoutTwoContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LayoutTwo);

export default LayoutTwoContainer;
