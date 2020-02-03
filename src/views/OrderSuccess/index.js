import React, {Component} from 'react';
import {Col, Row} from 'reactstrap';
import './order_success.css';
import {Link} from "react-router-dom";

class OrderSuccess extends Component {
    state = {
        orderId: ''
    };

    componentDidMount() {
        let photo_book_order = JSON.parse(localStorage.getItem('photo_book_order'));
        this.setState({orderId: photo_book_order.orderId});
    }

    render() {
        let message = `Thank you for your order. Your order number is “${this.state.orderId}” and you will shortly receive an
                            email with confirmation.`;
        return (
            <Row className='app'>
                <Col className='col-md-12 main-body'>
                    <div className='message-container'>
                        <div className='alert-success text-center message-success'>
                            {message}
                            <br/>
                            <Link to='/'>Click here to return back to home</Link>
                        </div>
                    </div>
                </Col>
            </Row>
        )
    }
}

export default OrderSuccess;
