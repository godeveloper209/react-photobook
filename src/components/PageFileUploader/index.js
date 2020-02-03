import React, {Fragment, Component} from 'react';
import * as actionCreators from "../../store/actions";
import {connect} from "react-redux";
import Dropzone from "react-dropzone";
import './page_file_uploader.css';
import {Progress} from 'reactstrap';
import {toFileWithPath} from "../../utils/fileselector";

class PageFileUploader extends Component {
    state = {
        uploading: false
    };
    onDropHandler = (acceptedFiles, rejectedFiles, payload) => {
        // console.log(payload);
        // console.log(acceptedFiles);
        // from the acceptedFiles get the first file.
        // give the logic for select a single file
        if (acceptedFiles.length === 1) {
            // create a blob with this file
            this.createBlob(acceptedFiles[0], payload);
        } else {
            alert('you are allowed to select a single image.')
        }
    };
// ******************* CREATE BLOB FROM IMAGE ***********************
    createBlob = (file, payload) => {
        const {page_index, image, title, zoomPage} = payload;
        const fileBlobs = [];
        // we need to declare an object file_info where we will store the information about the file
        let file_info = {file: file, page_index: page_index, image: image, title: title, zoomPage};
        payload.updatePageState({field: 'file_info', value: file_info});


        const blob = toFileWithPath(file);
        fileBlobs.push(blob);
        //convert files array to map with file paths as keys
        payload.updateFilesList({
            files: fileBlobs.reduce((map, file) => {
                map[file.path] = file;
                return map
            }, {}),
            files_count: fileBlobs.length
        });
        this.setState({uploading: true});
    };
    onDragOverHandler = () => {

    };
    onDragLeaveHandler = () => {

    };
    onDropImageHandler = (event, payload) => {
        // console.log(event);
        let div = document.createElement('div');
        div.innerHTML = event.dataTransfer.getData("text/html");
        let target_elements = div.getElementsByTagName('img');
        let id = event.dataTransfer.getData('id');
        if (typeof id !== 'undefined' && id !== '') {
            // this will fire when file will drop from one page to another page
            payload.file_id = id;
            payload.pageFileDrop(payload);
        }
        if (target_elements.length > 0) {
            payload.file_id = target_elements[0].id;
            payload.pageFileDrop(payload);
            // check if the file is dropped from the left side then we need to find the sidebar_images and splice in that index
            let sidebar_images = [...payload.sidebar_images];
            // find the index of the dropped file from the sidebar_images
            let index = sidebar_images.findIndex(s => s.file_id === payload.file_id);
            if (index > -1) {
                // this means image is dropped from the left side image
                // remove that file_object from the sidebar_images
                sidebar_images.splice(index, 1);
            }
            payload.updateState({field: "sidebar_images", value: sidebar_images});
        }
        // remove the div node from the document
        div.remove();
    };

    render() {
        const {page_index, image, sidebar_images, pageFileDrop, updateState, updateFilesList, updatePageState, title, zoomPage} = this.props;
        return (
            <Fragment>

                {/******************************For Uploading File We need to know which page the image will upload as well as which image
                 needs to be change ********************************/}
                <Dropzone
                    onDrop={(acceptedFiles, rejectedFiles) => this.onDropHandler(acceptedFiles, rejectedFiles, {
                        page_index,
                        image,
                        updateFilesList,
                        updatePageState,
                        zoomPage,
                        title
                    })}
                    onDragOver={() => this.onDragOverHandler}
                    onDragLeave={() => this.onDragLeaveHandler}
                    accept='image/jpeg,image/gif,image/png'
                    className='dropzone'
                    activeClassName='active-dropzone'>
                    {({getRootProps, getInputProps}) => (
                        <section className='drop-section'>
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <div className={`upload-single drag-drop ${this.props.className}`}
                                     onDrop={(event) => this.onDropImageHandler(event, {
                                         page_index,
                                         image,
                                         sidebar_images,
                                         pageFileDrop,
                                         updateState
                                     })}>
                                    {this.state.uploading &&
                                    <Progress animated color="success" className='page-upload-progress-bar'
                                              value="100"/>}
                                </div>
                            </div>
                        </section>
                    )}
                </Dropzone>
            </Fragment>
        )
    }
}

// Map Redux state to component props
function mapStateToProps(state) {
    return {
        pages: state.PageReducer.pages,
        sidebar_images: state.UploadReducer.sidebar_images
    }
}

// Map Redux action to component props
function mapDispatchToProps(dispatch) {
    return {
        pageFileDrop: (payload) => dispatch(actionCreators.pageFileDrop(payload)),
        updateState: (payload) => dispatch(actionCreators.updateState(payload)),
        zoomPage: (payload) => dispatch(actionCreators.zoomPage(payload)),
        updateFilesList: (payload) => dispatch(actionCreators.updateFilesList(payload)),
        updatePageState: (payload) => dispatch(actionCreators.updatePageState(payload))
    }
}

//connecting out component with the redux store
const PageFileUploaderContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(PageFileUploader);

export default PageFileUploaderContainer;
export const IMAGE_SERVER_URL = "https://myra.blob.core.windows.net/files/";
export const MAX_UPLOAD_LIMIT = 5;
