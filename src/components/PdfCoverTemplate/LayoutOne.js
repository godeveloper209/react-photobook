import React, {Fragment} from 'react';
import {IMAGE_SERVER_URL} from "../PageFileUploader";

const LayoutOne = (props) => {
    const {page} = props;
    // Layout 1: Top text and bottom image
    let selected_image_one = IMAGE_SERVER_URL + page.image1.file_reference;
    // objectPosition: page.image1.left + '% ' + page.image1.top + '%'
    return (
        <Fragment>
            <table className="pageTable" style={{float: 'left'}}>
                <tr>
                    <td style={{
                        width: '65%',
                        height: '100%',
                        background: `url(${selected_image_one}) ${page.image1.left}% ${page.image1.top}% / cover no-repeat`
                    }}></td>
                    <td style={{width: '35%', paddingLeft: '40px', paddingRight: '10px', verticalAlign: "top"}}
                        className="textBox">{page.text1}
                    </td>
                </tr>
            </table>
        </Fragment>
    )
};
export default LayoutOne;
