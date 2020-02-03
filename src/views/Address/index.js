import React, {Component, Fragment} from 'react';
import {Col, Row,} from "reactstrap";
import Joi from 'joi-browser';
import './address.css';
import Footer from "../../layout/Footer";
import shipping from '../../utils/shipping';
import Cover from "../../components/PdfCoverTemplate/Cover";
import Content from "../../components/PdfTemplate/Content";
import DotsLoader from "../../utils/loading";
import ReactDOMServer from "react-dom/server";
import pageHtml from "../../components/PdfTemplate/Html";
import coverHtml from "../../components/PdfCoverTemplate/Html";
import request from "../../utils/request";

class Address extends Component {
    PHOTO_BOOK_CREATE = 'https://myra-photo-book.azurewebsites.net/api/Create';
    PHOTO_BOOK_ORDER = 'https://myra-orders.azurewebsites.net/api/CreateOrder';
    BASE_URL = 'https://design.pictureprintshop.com/';
    ERROR_URL = this.BASE_URL + 'error';
    SUCCESS_URL = this.BASE_URL + 'success';
    state = {
        photoBookId: '',
        photoBookOrderId: '',
        showProgress: false,
        btnContinueDisable: false,
        form: {
            name: '',
            email: '',
            postal_code: '',
            city: '',
            shipping: '',
            country: '',
            address: ''
        },
        shipping: [],
        countries: [],
        shipping_cost: 0.00,
        price: 0.00,
        extra_pages: 0,
        errors: {}
    };
    schema = {
        name: Joi.string().required().label('Name'),
        email: Joi.string().required().email().label('Email'),
        city: Joi.string().allow(''),
        postal_code: Joi.string().allow(''),
        shipping: Joi.string().required().label('Shipping Method'),
        country: Joi.string().required().label('Country'),
        address: Joi.string().required().label('Address')
    };

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

    componentWillMount() {
        if (localStorage.getItem('photo_book')) {
            const account_name = localStorage.getItem('name');
            const photo_book = JSON.parse(localStorage.getItem('photo_book'));
            const pages = photo_book.pages;
            // -2 because pages include the front and the back.
            let extra_pages = pages.length - 20 - 2;
            let price = 14.99 + (extra_pages / 2);

            // send the create request here

            let static_content_html = ReactDOMServer.renderToStaticMarkup(this.contentHtml());
            let ContentHtml = pageHtml(static_content_html);
            let static_cover_html = ReactDOMServer.renderToStaticMarkup(this.coverHtml());
            let CoverHtml = coverHtml(static_cover_html);
            this.setState({extra_pages: extra_pages, price, btnContinueDisable: true});
            return request({
                url: this.PHOTO_BOOK_CREATE,
                method: "POST",
                type: "json",
                params: {
                    AccountName: account_name,
                    ContentHtml: ContentHtml,
                    CoverHtml: CoverHtml,
                    PageCount: pages.length - 2
                }
            }).then(response => {
                this.setState({showPrintButton: true});
                let res = null;
                if (response.status === 200) {
                    res = JSON.parse(response.responseText);
                    console.log(res);
                    this.setState({photoBookId: res.photobookId, btnContinueDisable: false})
                }
            }).catch(err => {
                console.log(err);
            });
        }
    }

    componentDidMount() {
        if (!localStorage.getItem('token')) {
            window.location.replace('https://myraprints.com/sign-in');
        }
        // here select unique countries and set it to the countries state
        let countries = [];
        shipping.forEach((ship) => {
            // ship has countries. amongst the countries we should select only unique countries
            ship.countries.forEach((country) => {
                if (countries.findIndex(c => c.name === country.name) === -1) {
                    countries.push(country);
                }
            })
        });
        // sort the countries by it's name
        countries.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        this.setState({countries});
    }

    validate = () => {

        // **************************** Validation implementation with joi-browser library ***************************
        const options = {abortEarly: false};
        const result = Joi.validate(this.state.form, this.schema, options);
        if (!result.error) return null;
        const errors = {};
        for (let item of result.error.details)
            errors[item.path[0]] = item.message;
        return errors;
    };
    createOrder = () => {
        const account_name = localStorage.getItem('name');
        const {name, email, address, country, postal_code, city} = {...this.state.form};
        const order_object = {};
        order_object.coupon = "";
        order_object.address = {
            fullName: name,
            "line 1": address,
            "line 2": "",
            postalCode: postal_code,
            city: city,
            state: "",
            countryCode: country
        };
        order_object.photobookProducts = [this.state.photoBookId];
        const params = {
            AccountName: account_name,
            Order: order_object
        };
        this.setState({showProgress: true, btnContinueDisable: true});
        request({
            url: this.PHOTO_BOOK_ORDER,
            method: "POST",
            type: "json",
            params: params
        }).then(response => {
            let res = null;
            if (response.status === 200) {
                res = JSON.parse(response.responseText);
                this.setState({photoBookOrderId: res.result.id, showProgress: false, btnContinueDisable: false});
                let photo_book_order = JSON.parse(localStorage.getItem('photo_book_order'));
                photo_book_order.email = email;
                photo_book_order.orderId = res.result.id;
                photo_book_order.photoBookId = this.state.photoBookId;
                photo_book_order.amount = this.state.price + this.state.shipping_cost;
                // set the orderId
                // here save the data in the localStorage
                // we will use this data in error or success page
                localStorage.setItem('photo_book_order', JSON.stringify(photo_book_order));
                // redirect to the payment page
                let amount_without_fraction = (this.state.price + this.state.shipping_cost).toString().replace('.', '');
                window.location.href = 'https://myra-orders.azurewebsites.net/api/GoToPayment?email=' +
                    encodeURIComponent(email) + `&amount=${amount_without_fraction}&orderId=` + res.result.id + '&errorUrl=' + encodeURIComponent(this.ERROR_URL) +
                    '&completedUrl=' + encodeURIComponent(this.SUCCESS_URL);
            }
        }).catch(err => {
            console.log(err);
            this.setState({showProgress: false});

        });
    };
    redirect = () => {
        // validate the form and if the form is valid then redirect to success
        // else show the required error message
        const errors = this.validate();
        this.setState({errors: errors || {}});
        if (errors) return;
        // here execute the create order request
        this.createOrder();
        // this.props.history.push(`/success`);
    };
    validateProperty = ({name, value}) => {
        const obj = {[name]: value};
        const schema = {[name]: this.schema[name]};
        const {error} = Joi.validate(obj, schema);
        return error ? error.details[0].message : null;
    };
    checkError = (input) => {
        const errors = {...this.state.errors};
        const errorMessage = this.validateProperty(input);
        if (errorMessage) errors[input.name] = errorMessage;
        else delete errors[input.name];
        this.setState({errors});
    };
    handleChange = ({currentTarget: input}) => {
        const form = {...this.state.form};
        // here name is the input field name
        form[input.name] = input.value;
        this.checkError(input);
        this.setState({form});
    };
    shippingChange = ({currentTarget: input}) => {
        // get all the country by the selected shipping method
        // and set the selected country into the state
        const form = {...this.state.form};
        const {country} = {...this.state.form};
        let shipping_cost = 0.00;
        if (input.value !== '') {
            let ship = shipping.find(s => s.method === input.value);
            shipping_cost = ship.countries.find(c => c.name === country).cost;
        }
        form[input.name] = input.value;
        this.checkError(input);
        this.setState({form, shipping_cost});
    };
    countryChange = ({currentTarget: input}) => {
        const form = {...this.state.form};
        let countries = [...this.state.countries];
        let new_shipping = [];
        if (input.value !== '') {
            shipping.forEach((ship) => {
                if (ship.countries.findIndex(c => c.name === input.value) > -1) {
                    new_shipping.push(ship);
                }
            })
        }
        // here select the shipping method depending on selected country
        form[input.name] = input.value;
        this.checkError(input);
        this.setState({form, countries, shipping: new_shipping});
    };

    render() {
        const {form, countries, shipping, shipping_cost, extra_pages, price, errors} = this.state;
        let shipping_options = shipping.map((shipping, index) => {
            return <option value={shipping.method} key={index}>{shipping.method}</option>
        });
        let country_options = countries.map((country, index) => {
            return <option value={country.name} key={index}>{country.name}</option>
        });
        let loading = <DotsLoader style={{margin: '0px'}}/>;

        return (
            <Fragment>
                <Row className='app'>
                    <Col className='col-md-12 main-body'>
                        {this.state.showProgress && loading}
                        <div className='form-container'>
                            <form className='address-form'>
                                <div className='form-group'>
                                    <Row>
                                        <Col className='col-md-2'>
                                            <label htmlFor='name'>Name</label>
                                        </Col>
                                        <Col className='col-md-10'>
                                            <input id='name' type='text' name='name' value={form.name}
                                                   className='form-control'
                                                   placeholder='Enter your name' onChange={this.handleChange}
                                                   onBlur={this.handleChange}/>
                                            {errors.name && <div className='alert alert-danger'>{errors.name}</div>}
                                        </Col>
                                    </Row>
                                </div>
                                <div className='form-group'>
                                    <Row>
                                        <Col className='col-md-2'>
                                            <label htmlFor='email'>Email</label>
                                        </Col>
                                        <Col className='col-md-10'>
                                            <input id='email' type='email' name='email' value={form.email}
                                                   className='form-control'
                                                   placeholder='Enter your email' onChange={this.handleChange}
                                                   onBlur={this.handleChange}/>
                                            {errors.email && <div className='alert alert-danger'>{errors.email}</div>}
                                        </Col>
                                    </Row>
                                </div>
                                <div className='form-group'>
                                    <Row>
                                        <Col className='col-md-2'>
                                            <label htmlFor='country'>Country</label>
                                        </Col>
                                        <Col className='col-md-10'>
                                            <select className='form-control' name='country' value={form.country}
                                                    id='country' onChange={this.countryChange}
                                                    onBlur={this.handleChange}>
                                                <option value=''>Select country *</option>
                                                {country_options}
                                            </select>
                                            {errors.country &&
                                            <div className='alert alert-danger'>{errors.country}</div>}
                                        </Col>
                                    </Row>
                                </div>
                                <div className='form-group'>
                                    <Row>
                                        <Col className='col-md-2'>
                                            <label htmlFor='shipping'>Shipping</label>
                                        </Col>
                                        <Col className='col-md-10'>
                                            <select className='form-control' name='shipping' value={form.shipping}
                                                    id='shipping' onChange={this.shippingChange}
                                                    onBlur={this.handleChange}>
                                                <option value=''>Select shipping method *</option>
                                                {shipping_options}
                                            </select>
                                            {errors.shipping &&
                                            <div className='alert alert-danger'>{errors.shipping}</div>}
                                        </Col>
                                    </Row>
                                </div>
                                <div className='form-group'>
                                    <Row>
                                        <Col className='col-md-2'>
                                            <label htmlFor='postal_code'>Postal Code</label>
                                        </Col>
                                        <Col className='col-md-10'>
                                            <input id='postal_code' type='text' name='postal_code'
                                                   className='form-control'
                                                   placeholder='Enter postal code' onChange={this.handleChange}/>
                                        </Col>
                                    </Row>
                                </div>
                                <div className='form-group'>
                                    <Row>
                                        <Col className='col-md-2'>
                                            <label htmlFor='city'>City</label>
                                        </Col>
                                        <Col className='col-md-10'>
                                            <input id='city' type='text' name='city' className='form-control'
                                                   placeholder='Enter city' onChange={this.handleChange}/>
                                        </Col>
                                    </Row>
                                </div>
                                <div className='form-group'>
                                    <Row>
                                        <Col className='col-md-2'>
                                            <label htmlFor='address'>Address</label>
                                        </Col>
                                        <Col className='col-md-10'>
                                            <input id='address' type='text' name='address' className='form-control'
                                                   placeholder='Enter address' onChange={this.handleChange}/>
                                        </Col>
                                    </Row>
                                </div>
                                <div className='form-group'>
                                    <Row>
                                        <Col className='col-md-2'>
                                            <label htmlFor='address'>Cost</label>
                                        </Col>
                                        <Col className='col-md-10'>
                                            <span>20 pages price = 14.99€</span><br/>
                                            <span>Extra {extra_pages} pages price = {extra_pages / 2}€</span><br/>
                                            <span>Shipping cost = {shipping_cost}€</span><br/>
                                            <span><strong>Total price = </strong> {(Math.round((price + shipping_cost) * 100) / 100).toFixed(2)}€</span>
                                        </Col>
                                    </Row>
                                </div>

                            </form>
                        </div>
                    </Col>
                </Row>
                <Footer redirect={this.redirect} disabled={this.state.btnContinueDisable}/>
            </Fragment>
        )
    }
}

export default Address;
