import React, {Component} from 'react';
import './sidebar.css';
import Upload from '../Upload';
import * as actionCreators from "../../store/actions";
import {connect} from "react-redux";
// in this component we need to set up our upload function
// drag and drop feature
class Sidebar extends Component {
    addPhotosPages = () => {
        this.props.addPhotosPages({sidebar_images: this.props.sidebar_images});
        // here we need to read the sidebar_images from the localStorage and then update the state
        if (localStorage.getItem('sidebar_images')) {
            const sidebar_images = JSON.parse(localStorage.getItem('sidebar_images'));
            this.props.updateState({field: "sidebar_images", value: sidebar_images});
        }
    };

    componentDidMount() {
        // read the photo book from the localStorage and update the page state
        // update the page state
        if (localStorage.getItem('photo_book')) {
            let {pages, front, back} = JSON.parse(localStorage.getItem('photo_book'));
            this.props.updatePageState({field: 'pages', value: pages});
            this.props.updatePageState({field: 'front', value: front});
            this.props.updatePageState({field: 'back', value: back});
            this.props.updatePageState({field: 'file_info', value: {}});
        }

    }

    render() {
        const {sidebar_images} = this.props;
        return (
            <div className='sidebar'>
                <Upload/>
                {sidebar_images.length > 0 && <div className='btn-add-all-photo-sidebar text-center' style={{}}>
                    <button type='button' onClick={() => this.addPhotosPages()} className='btn btn-primary'>
                        Add all photos to pages
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
        sidebar_images: state.UploadReducer.sidebar_images,
    }
}

// Map Redux action to component props
function mapDispatchToProps(dispatch) {
    return {
        addPhotosPages: (payload) => dispatch(actionCreators.addPhotosPages(payload)),
        updateState: (payload) => dispatch(actionCreators.updateState(payload)),
        updatePageState: (payload) => dispatch(actionCreators.updatePageState(payload))
    }
}

//connecting out component with the redux store
const SidebarContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Sidebar);

export default SidebarContainer;
