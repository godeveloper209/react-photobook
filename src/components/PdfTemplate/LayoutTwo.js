import React, {Fragment} from 'react';
import {IMAGE_SERVER_URL} from "../PageFileUploader";

const LayoutTwo = (props) => {
    const {page} = props;
    let selected_image_one = IMAGE_SERVER_URL + page.image1.file_reference;
    return (
        <Fragment>
            <table className='pageTable'>
                <tr>
                    <td style={{verticalAlign: 'top'}} className="textBox">{page.text1}
                    </td>
                </tr>
                <tr>
                    <td style={{
                        width: '100%',
                        height: '78%',
                        background: `url(${selected_image_one}) ${page.image1.left}% ${page.image1.top}% / cover no-repeat`
                    }}></td>
                </tr>
            </table>
        </Fragment>
    )
};
export default LayoutTwo;
