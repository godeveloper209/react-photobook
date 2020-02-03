import React, {Fragment} from 'react';
import {IMAGE_SERVER_URL} from "../PageFileUploader";

const LayoutThree = (props) => {
    const {page} = props;
    let selected_image_one = IMAGE_SERVER_URL + page.image1.file_reference;
    let selected_image_two = IMAGE_SERVER_URL + page.image2.file_reference;

    return (
        <Fragment>
            <table className='pageTable'>
                <tr>
                    <td style={{
                        width: '50%',
                        height: '78%',
                        borderRight: '5px solid white',
                        background: `url(${selected_image_one}) ${page.image1.left}% ${page.image1.top}% / cover no-repeat`
                    }}>&nbsp;</td>
                    <td style={{
                        width: '50%',
                        height: '78%',
                        background: `url(${selected_image_two}) ${page.image2.left}% ${page.image2.top}% / cover no-repeat`
                    }}></td>
                </tr>
                <tr>
                    <td style={{verticalAlign: 'top'}} className="textBox">
                        {page.text1}
                    </td>
                    <td style={{verticalAlign: 'top'}} className="textBox">
                        {page.text2}
                    </td>
                </tr>
            </table>
        </Fragment>
    )
};
export default LayoutThree;
