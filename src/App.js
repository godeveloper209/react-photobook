import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Home from './views/Home';
import Header from './layout/Header';
import './App.css'
import {library} from '@fortawesome/fontawesome-svg-core';
import {
    faEnvelope,
    faKey,
    faTrash,
    faSearch,
    faUpload,
    faWindowClose,
    faArrowLeft,
    faArrowRight,
    faArrowUp,
    faArrowDown,
    faCircle,
    faFileUpload,
    faCloudUploadAlt,
    faPrint,
    faLock,
    faLockOpen,
    faAngleDown,
    faAngleUp,
    faAngleLeft,
    faAngleRight
} from '@fortawesome/free-solid-svg-icons';
import VisibleCounter from "./components/Counter";
import Address from "./views/Address";
import OrderSuccess from './views/OrderSuccess';
import OrderError from './views/OrderError';
import SidebarContainer from "./components/Sidebar";
import Pdf from "./views/Pdf";

library.add(faEnvelope,
    faKey, faTrash, faSearch,
    faUpload, faWindowClose, faArrowLeft,
    faArrowRight, faArrowUp, faArrowDown,
    faCircle, faFileUpload, faCloudUploadAlt,
    faPrint, faLock, faLockOpen, faAngleDown,
    faAngleUp,
    faAngleLeft,
    faAngleRight);

class App extends Component {
    // app will contain a side bar which will always stick into the app
    // so we should create a sidebar component and put it into this app

    render() {
        return (
            <div>
                <Header/>
                {/*Row with two column one width is col-md-3 and another is col-md-9. in col-md-9 all the body content will go here*/}
                <Route path="/" exact component={Home}/>
                <Route path="/address" exact component={Address}/>
                <Route path="/success" exact component={OrderSuccess}/>
                <Route path="/error" exact component={OrderError}/>
                <Route path="/upload" exact component={SidebarContainer}/>
                <Route path="/counter" exact component={VisibleCounter}/>
                <Route path="/pdf" exact component={Pdf}/>
            </div>
        )
    }
}

export default App;
