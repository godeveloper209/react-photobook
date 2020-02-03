import React, {Component} from 'react';
import {Col, Row} from 'reactstrap';
import './order_error.css';
import {Link} from "react-router-dom";

class OrderError extends Component {
    BASE_URL = 'https://design.pictureprintshop.com/';
    ERROR_URL = this.BASE_URL + 'error';
    SUCCESS_URL = this.BASE_URL + 'success';

    componentDidMount() {
        if (!localStorage.getItem('token')) {
            window.location.replace('https://myraprints.com/sign-in');
        }
    }

    tryPaymentProcessing = (e) => {
        e.preventDefault();
        if (localStorage.getItem('photo_book_order')) {
            let photo_book_order = JSON.parse(localStorage.getItem('photo_book_order'));
            let amount_without_fraction = (photo_book_order.amount).toString().replace('.', '');
            window.location.href = 'https://myra-orders.azurewebsites.net/api/GoToPayment?email=' +
                encodeURIComponent(photo_book_order.email) + `&amount=${amount_without_fraction}&orderId=` + photo_book_order.orderId + '&errorUrl=' + encodeURIComponent(this.ERROR_URL) +
                '&completedUrl=' + encodeURIComponent(this.SUCCESS_URL);
        }
    };

    render() {
        return (
            <Row className='app'>
                <Col className='col-md-12 main-body'>
                    <div className='message-container'>
                        <div className='alert-danger text-center message-success'>
                            There is something wrong processing your payment.
                            please <Link to='' onClick={e => this.tryPaymentProcessing(e)}> try again </Link>
                        </div>
                    </div>
                </Col>
            </Row>
        )
    }
}

export default OrderError;
