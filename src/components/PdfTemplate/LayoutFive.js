import React, {Fragment} from 'react';
import {IMAGE_SERVER_URL} from "../PageFileUploader";

const LayoutFive = (props) => {
    const {page} = props;
    let selected_image_one = IMAGE_SERVER_URL + page.image1.file_reference;
    let selected_image_two = IMAGE_SERVER_URL + page.image2.file_reference;
    let selected_image_three = IMAGE_SERVER_URL + page.image3.file_reference;
    return (
        <Fragment>
            <table className='pageTable'>
                <tr>
                    <td colSpan="2" style={{verticalAlign: 'top'}} className="textBox">
                        {page.text1}
                    </td>
                </tr>
                <tr>
                    <td style={{
                        width: '50%',
                        height: '475px',
                        borderRight: '5px solid white',
                        background: `url(${selected_image_one}) ${page.image1.left}% ${page.image1.top}% / cover no-repeat`
                    }}></td>
                    <td style={{height: '78%', width: '50%'}}>
                        <table style={{padding: 0, margin: 0, width: '100%', height: '100%', borderCollapse: 'collapse'}}>
                            <tr>
                                <td style={{
                                    width: '50%',
                                    borderBottom: '5px solid white',
                                    background: `url(${selected_image_two}) ${page.image2.left}% ${page.image2.top}% / cover no-repeat`
                                }}></td>
                            </tr>
                            <tr>
                                <td style={{
                                    width: '50%',
                                    background: `url(${selected_image_three}) ${page.image3.left}% ${page.image3.top}% / cover no-repeat`
                                }}></td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </Fragment>
    )
};
export default LayoutFive;
