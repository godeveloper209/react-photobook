import React, {Fragment, Component} from 'react';
import layoutThreeActive from "../../assets/img/3s.png";
import layout1 from '../../assets/img/1.png';
import layout2 from "../../assets/img/2.png";
import layout4 from "../../assets/img/4.png";
import layout5 from "../../assets/img/5.png";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import './three.css';
import * as actionCreators from "../../store/actions";
import {connect} from "react-redux";
import {repositionImage} from "../../utils/functions";
import PageFileUploader, {IMAGE_SERVER_URL} from "../PageFileUploader";
import Draggable from '../Draggable';


const onZoomPageHandler = (event, payload) => {
    payload.zoomPage({page_index: payload.page_index, title: payload.title, clickedInput: payload.clickedInput});
};
const onRemoveImageFromPage = (payload) => {
    let sidebar_images = [...payload.sidebar_images];
    sidebar_images.push(payload.page[payload.image_no]);
    payload.sidebar_images = sidebar_images;
    payload.updateState({field: "sidebar_images", value: sidebar_images});
    payload.removePageImage(payload);
    // set Up the reducer to remove the image from the page
    // and finally add the image to the sidebar_images
};

class LayoutThree extends Component {
    constructor(props) {
        super(props);
        this.textInput1 = React.createRef();
        this.textInput2 = React.createRef();
        this.focusInput1 = this.focusInput1.bind(this);
        this.focusInput2 = this.focusInput2.bind(this);
    }

    state = {
        showImage1Buttons: false,
        showImage2Buttons: false,
        maxTop: 100,
        minTop: 0,
        maxLeft: 100,
        minLeft: 0,
        active: false,
        draggable: true,
        enterKey: false,
        // image 1 focusing variable
        imageOneCurrentX: 0,
        imageOneCurrentY: 0,
        imageOneXPos: 50,
        imageOneYPos: 50,
        // image 2 focusing variable
        imageTwoCurrentX: 0,
        imageTwoCurrentY: 0,
        imageTwoXPos: 50,
        imageTwoYPos: 50,
    };
    componentWillMount() {
        // set xOffset, yOffset, xPos,yPos, currentX and currentY
        this.setState({
            // image1 state
            imageOneCurrentX: this.props.page.image1.currentX,
            imageOneCurrentY: this.props.page.image1.currentY,
            imageOneXPos: this.props.page.image1.left,
            imageOneYPos: this.props.page.image1.top,
            // image2 state
            imageTwoCurrentX: this.props.page.image2.currentX,
            imageTwoCurrentY: this.props.page.image2.currentY,
            imageTwoXPos: this.props.page.image2.left,
            imageTwoYPos: this.props.page.image2.top
        });
    }

    focusInput1 = () => {
        // Explicitly focus the text input using the raw DOM API
        // Note: we're accessing "current" to get the DOM node
        this.textInput1.current.focus();
    };
    focusInput2 = () => {
        // Explicitly focus the text input using the raw DOM API
        // Note: we're accessing "current" to get the DOM node
        this.textInput2.current.focus();
    };
    focusChange = (e) => {
        // set the cursor position to the end of the text
        let temp_value = e.target.value;
        e.target.value = '';
        e.target.value = temp_value;
        if (!this.props.zoom) {
            this.textInput1.current.blur();
            this.textInput2.current.blur();
        }
    };
    textAreaClick = (evt, payload) => {
        let inpRect1 = this.textInput1.current.getBoundingClientRect(),
            inpRect2 = this.textInput2.current.getBoundingClientRect(),
            x = evt.clientX,
            y = evt.clientY,
            l1 = inpRect1.left,
            w1 = l1 + inpRect1.width,
            t1 = inpRect1.top,
            h1 = t1 + inpRect1.height,
            l2 = inpRect2.left,
            w2 = l2 + inpRect2.width,
            t2 = inpRect2.top,
            h2 = t2 + inpRect2.height;

        let input1 = (x >= l1 && x <= w1 && y >= t1 && y <= h1);
        let input2 = (x >= l2 && x <= w2 && y >= t2 && y <= h2);
        let isClickT1OrT2 = input1 || input2;

        if (isClickT1OrT2) {
            let isMobile = window.matchMedia("(max-width: 600px)").matches;
            if (!isMobile) {
                if (input1) payload.clickedInput = 'input1';
                if (input2) payload.clickedInput = 'input2';
                onZoomPageHandler(evt, payload);
            }
        }
    };
    onKeyChange = (event) => {
        if (event.keyCode === 13) {
            this.setState({enterKey: true});
            this.props.exitZoom({page_index: this.props.zoom_page.page_index});
        } else {
            this.setState({enterKey: false})
        }
    };
    onChangePageTextHandler = (event, payload) => {
        // changing a page it needs two thing which page that means page_index and another is the text
        //let final_string = textAlignment(event.target.value, 34);
        // let final_string = alignText(event.target.value, 32);
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
    // payload we also need to know from which page this image is dropping
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

    // ********************************** Image1 image focusing logic **********************************
    _moveOne = (currentX, currentY, xPos, yPos) => {
        if (this.state.active) {
            repositionImage({page_index: this.props.page_index, currentX, currentY, xPos, yPos, image_no: 'image1'});
            this.setState({
                imageOneCurrentX: currentX,
                imageOneCurrentY: currentY,
                imageOneXPos: xPos,
                imageOneYPos: yPos
            });
        }
    };
    // ********************************** Image2 image focusing logic **********************************

    _moveTwo = (currentX, currentY, xPos, yPos) => {
        if (this.state.active) {
            repositionImage({page_index: this.props.page_index, currentX, currentY, xPos, yPos, image_no: 'image2'});
            this.setState({
                imageTwoCurrentX: currentX,
                imageTwoCurrentY: currentY,
                imageTwoXPos: xPos,
                imageTwoYPos: yPos
            });
        }
    };

    render() {
        const {page_index, changeLayout, page, changePageText, zoomPage, title, removePageImage, sidebar_images, updateState, page_no, path, zoom_page, zoom} = this.props;
        let selected_image1 = '';
        let selected_image2 = '';
        if (path === '/pdf') {
            selected_image1 = IMAGE_SERVER_URL + page.image1.file_reference;
            selected_image2 = IMAGE_SERVER_URL + page.image2.file_reference;
        } else {
            if (page_no === 'Zoom') {
                // check if the resolution array contains the 1600
                // then select the 1600 image
                // if 1600 not available then select the original image resolution
                selected_image1 = page.image1.resolutions.findIndex(r => r === 1600) > -1 ? IMAGE_SERVER_URL + page.image1.file_reference + '1600' : IMAGE_SERVER_URL + page.image1.file_reference;
                selected_image2 = page.image2.resolutions.findIndex(r => r === 1600) > -1 ? IMAGE_SERVER_URL + page.image2.file_reference + '1600' : IMAGE_SERVER_URL + page.image2.file_reference;

            } else {
                selected_image1 = page.image1.resolutions.findIndex(r => r === 200) > -1 ? IMAGE_SERVER_URL + page.image1.file_reference + '200' : IMAGE_SERVER_URL + page.image1.file_reference;
                selected_image2 = page.image2.resolutions.findIndex(r => r === 200) > -1 ? IMAGE_SERVER_URL + page.image2.file_reference + '200' : IMAGE_SERVER_URL + page.image2.file_reference;

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
                               onClick={() => changeLayout({page_index: page_index, layout: '1', title})}
                               className="img-input"
                               alt='some label'/>
                        <input type="image" src={layout2}
                               onClick={() => changeLayout({page_index: page_index, layout: '2', title})}
                               className="img-input"
                               alt='some label'/>
                        <input type="image" src={layoutThreeActive} className="img-input" alt='some label'/>
                        <input type="image" src={layout4}
                               onClick={() => changeLayout({page_index: page_index, layout: '4', title})}
                               className="img-input"
                               alt='some label'/>
                        <input type="image" src={layout5}
                               onClick={() => changeLayout({page_index: page_index, layout: '5', title})}
                               className="img-input"
                               alt='some label'/>
                        <button className="btn-search" type="button"
                                onClick={(event) => onZoomPageHandler(event, {
                                    page_index,
                                    zoomPage,
                                    title,
                                    clickedInput: 'none'
                                })}>
                            <FontAwesomeIcon icon="search" className="search-icon"/>
                        </button>

                    </div>
                </h4>
                <div className="layout3" onClick={(event) => this.textAreaClick(event, {page_index, zoomPage, title})}>
                    {/***************** Display the file if file_id not empty else display the FileUploader *********************/}
                    <div className="layout3-container1">
                        {page.image1.file_id !== '' && (
                            <div
                                className={'img-container ' + (page_no === 'Zoom' ? "layout3-zoom-image1" : "layout3-image1")}
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
                                    background: `url(${selected_image1}) ${this.state.imageOneXPos}% ${this.state.imageOneYPos}% / cover no-repeat`,
                                }}
                                onMouseEnter={() => this.setState({showImage1Buttons: true})}
                                onMouseLeave={() => this.setState({
                                    showImage1Buttons: false,
                                    active: false,
                                    draggable: true
                                })}
                                onTouchStart={() => this.setState({showImage1Buttons: true})}
                                onTouchEnd={() => this.setState({showImage1Buttons: false})}>
                                <button type='button'
                                        className={'btn-remove-img-from-page ' + (this.state.showImage1Buttons ? '' : 'display-none')}
                                        onClick={() => onRemoveImageFromPage({
                                            image_no: 'image1',
                                            file_id: page.image1.file_id,
                                            page_index: page_index,
                                            sidebar_images,
                                            page,
                                            updateState,
                                            removePageImage
                                        })}>
                                    <FontAwesomeIcon icon="trash"/>
                                </button>
                                {/*Image reposition buttons needs to position in image center. and the button will only show when hover over image*/}
                                {/*object-position: 10% 10%; first 10% is for left and right positioning. and another 10% is for top and bottom positioning*/}
                                {/*when click on btn-arrow-up button then value will increase up to 100%. when click on btn-arrow-down button then value will decrease up to 0 */}
                                {this.state.showImage1Buttons &&
                                <Draggable
                                    x={this.state.imageOneCurrentX}
                                    y={this.state.imageOneCurrentY}
                                    xPos={this.state.imageOneXPos}
                                    yPos={this.state.imageOneYPos}
                                    xPosSum={46}
                                    yPosSum={-19}
                                    xMul={1.1}
                                    yMul={1}
                                    xMax={47}
                                    xMin={-47}
                                    yMax={125}
                                    yMin={16}
                                    onMove={this._moveOne}>
                                    <div className='btn-reposition-image'
                                         onMouseDown={() => this.setState({draggable: false, active: true})}
                                         onMouseUp={() => this.setState({draggable: true, active: false})}
                                         onTouchStart={() => this.setState({draggable: false, active: true})}
                                         onTouchEnd={() => this.setState({draggable: true, active: false})}>
                                        {/*arrow-right, arrow-left, arrow-up, arrow-down*/}
                                        <button className='btn-arrow-left'><FontAwesomeIcon icon='angle-left'/></button>
                                        <button className='btn-arrow-right'><FontAwesomeIcon icon='angle-right'/>
                                        </button>
                                        <button className='btn-center-image'>
                                            {/*    btn center image */}
                                        </button>
                                        <button className='btn-arrow-up'><FontAwesomeIcon icon='angle-up'/></button>
                                        <button className='btn-arrow-down'><FontAwesomeIcon icon='angle-down'/></button>
                                    </div>
                                </Draggable>}
                            </div>
                        )}
                        {page.image1.file_id === '' &&
                        <PageFileUploader page={page} page_index={page_index} image='image1' title={title}
                                          className={page_no === 'Zoom' ? "layout3-zoom-image1-uploader" : 'layout3-image1-uploader'}/>}
                        <textarea className={page_no === 'Zoom' ? "layout3-zoom-input1" : "layout3-input1"}
                                  placeholder="Type text here" value={page.text1}
                                  ref={this.textInput1}
                                  autoFocus={zoom && zoom_page.clickedInput === 'input1'}
                                  onFocus={(event) => this.focusChange(event)}
                                  onKeyDown={(event) => this.onKeyChange(event)}
                                  onChange={(event) => this.onChangePageTextHandler(event, {
                                      text_no: 'text1',
                                      page_index,
                                      changePageText,
                                      title
                                  })}/>
                    </div>
                    <div className="layout3-container2">
                        {page.image2.file_id !== '' && (
                            <div
                                className={'img-container ' + (page_no === 'Zoom' ? "layout3-zoom-image2" : "layout3-image2")}
                                draggable={this.state.draggable}
                                onDragStart={(e) => this.onDragStart(e, {
                                    file_id: page.image2.file_id,
                                    from_page: page_index,
                                    from_image: 'image2'
                                })}
                                onDrop={(event) => this.onDropImageHandler(event, {
                                    page_index,
                                    image: 'image2',
                                })}
                                id={page.image2.file_id}
                                style={{
                                    background: `url(${selected_image2}) ${this.state.imageTwoXPos}% ${this.state.imageTwoYPos}% / cover no-repeat`,
                                }}
                                onMouseEnter={() => this.setState({showImage2Buttons: true})}
                                onMouseLeave={() => this.setState({
                                    showImage2Buttons: false,
                                    active: false,
                                    draggable: true
                                })}
                                onTouchStart={() => this.setState({showImage2Buttons: true})}
                                onTouchEnd={() => this.setState({showImage2Buttons: false})}>
                                <button type='button'
                                        className={'btn-remove-img-from-page ' + (this.state.showImage2Buttons ? '' : 'display-none')}
                                        onClick={() => onRemoveImageFromPage({
                                            image_no: 'image2',
                                            file_id: page.image2.file_id,
                                            page_index: page_index,
                                            sidebar_images,
                                            updateState,
                                            page,
                                            removePageImage
                                        })}>
                                    <FontAwesomeIcon icon="trash"/>
                                </button>
                                {/*Image reposition buttons needs to position in image center. and the button will only show when hover over image*/}
                                {/*object-position: 10% 10%; first 10% is for left and right positioning. and another 10% is for top and bottom positioning*/}
                                {/*when click on btn-arrow-up button then value will increase up to 100%. when click on btn-arrow-down button then value will decrease up to 0 */}
                                {this.state.showImage2Buttons &&
                                <Draggable
                                    x={this.state.imageTwoCurrentX}
                                    y={this.state.imageTwoCurrentY}
                                    xPos={this.state.imageTwoXPos}
                                    yPos={this.state.imageTwoYPos}
                                    xPosSum={46}
                                    yPosSum={-19}
                                    xMul={1.1}
                                    yMul={1}
                                    xMax={47}
                                    xMin={-47}
                                    yMax={125}
                                    yMin={16}
                                    onMove={this._moveTwo}>
                                    <div className='btn-reposition-image'
                                         onMouseDown={() => this.setState({draggable: false, active: true})}
                                         onMouseUp={() => this.setState({draggable: true, active: false})}
                                         onTouchStart={() => this.setState({draggable: false, active: true})}
                                         onTouchEnd={() => this.setState({draggable: true, active: false})}>
                                        {/*arrow-right, arrow-left, arrow-up, arrow-down*/}
                                        <button className='btn-arrow-left'><FontAwesomeIcon icon='angle-left'/></button>
                                        <button className='btn-arrow-right'><FontAwesomeIcon icon='angle-right'/>
                                        </button>
                                        <button className='btn-center-image'>
                                            {/*    btn center image*/}
                                        </button>
                                        <button className='btn-arrow-up'><FontAwesomeIcon icon='angle-up'/></button>
                                        <button className='btn-arrow-down'><FontAwesomeIcon icon='angle-down'/></button>
                                    </div>
                                </Draggable>}
                            </div>
                        )}
                        {page.image2.file_id === '' &&
                        <PageFileUploader page={page} page_index={page_index} image='image2' title={title}
                                          className={page_no === 'Zoom' ? 'layout3-zoom-image2-uploader' : 'layout3-image2-uploader'}/>}
                        <textarea className={page_no === 'Zoom' ? "layout3-zoom-input2" : "layout3-input2"}
                                  placeholder="Type text here" value={page.text2}
                                  ref={this.textInput2}
                                  autoFocus={zoom && zoom_page.clickedInput === 'input2'}
                                  onFocus={(event) => this.focusChange(event)}
                                  onKeyDown={(event) => this.onKeyChange(event)}
                                  onChange={(event) => this.onChangePageTextHandler(event, {
                                      text_no: 'text2',
                                      page_index,
                                      changePageText,
                                      title
                                  })}/>
                    </div>
                </div>
            </Fragment>
        )
    }
}

// Map Redux state to component props
function mapStateToProps(state) {
    return {
        pages: state.PageReducer.pages,
        sidebar_images: state.UploadReducer.sidebar_images,
        zoom: state.PageReducer.zoom,
        zoom_page: state.PageReducer.zoom_page
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
const LayoutThreeContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LayoutThree);

export default LayoutThreeContainer;
