import React, {Fragment} from 'react';
import {IMAGE_SERVER_URL} from "../PageFileUploader";

const LayoutFour = (props) => {
    const {page} = props;
    let selected_image_one = IMAGE_SERVER_URL + page.image1.file_reference;
    let selected_image_two = IMAGE_SERVER_URL + page.image2.file_reference;
    let selected_image_three = IMAGE_SERVER_URL + page.image3.file_reference;
    return (
        <Fragment>
            <table className='pageTable'>
                <tr>
                    <td style={{width: '65%'}}>
                        <table
                            style={{padding: 0, margin: 0, width: '100%', height: '100%', borderCollapse: 'collapse'}}>
                            <tr>
                                <td colSpan="2"
                                    style={{
                                        width: '100%',
                                        height: '50%',
                                        borderBottom: '5px solid white',
                                        background: `url(${selected_image_one}) ${page.image1.left}% ${page.image1.top}% / cover no-repeat`
                                    }}></td>
                            </tr>
                            <tr>
                                <td style={{
                                    width: '50%',
                                    height: '50%',
                                    backgroundImage: `url(${selected_image_two})`,
                                    borderRight: '5px solid white',
                                    background: `url(${selected_image_two}) ${page.image2.left}% ${page.image2.top}% / cover no-repeat`
                                }}>&nbsp;</td>
                                <td style={{
                                    width: '50%',
                                    height: '50%',
                                    background: `url(${selected_image_three}) ${page.image3.left}% ${page.image3.top}% / cover no-repeat`
                                }}></td>
                            </tr>
                        </table>
                    </td>
                    <td style={{verticalAlign: 'top'}} className="textBox">
                        {page.text1}
                    </td>
                </tr>
            </table>
        </Fragment>
    )
};
export default LayoutFour;
