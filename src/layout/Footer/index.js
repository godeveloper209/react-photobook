import React, {Component} from 'react';
import './footer.css';
import {Button} from 'reactstrap';

class Footer extends Component {
    redirect = () => {
        // execute function on parent class
        this.props.redirect();
    };
    render() {
        return (
            <footer className='text-center footer'>
                <Button className='btn-continue' onClick={this.redirect} disabled={this.props.disabled}>CONTINUE</Button>
            </footer>
        )
    }
}

export default Footer;
