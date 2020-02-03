import React from 'react';
import LayoutOne from '../LayoutOne';
import LayoutTwo from '../LayoutTwo';
import LayoutThree from '../LayoutThree';
import LayoutFour from '../LayoutFour';
import LayoutFive from '../LayoutFive';
import './page.css';

const Page = (props) => {
    const {page_no, page, page_index, title, layout, path} = props;
    const layout_selection = {
        '1': <LayoutOne page_no={page_no} page={page} page_index={page_index} path={path} title={title}/>,
        '2': <LayoutTwo page_no={page_no} page={page} page_index={page_index} path={path} title={title}/>,
        '3': <LayoutThree page_no={page_no} page={page} page_index={page_index} path={path} title={title}/>,
        '4': <LayoutFour page_no={page_no} page={page} page_index={page_index} path={path} title={title}/>,
        '5': <LayoutFive page_no={page_no} page={page} page_index={page_index} path={path} title={title}/>,
    };
    return (
        <div className='product-card'>
            {layout_selection[layout]}
        </div>
    )
};
export default Page;
