import React, {Fragment} from 'react';
import LayoutOne from './LayoutOne';
import LayoutTwo from './LayoutTwo';
import LayoutThree from './LayoutThree';
import LayoutFour from './LayoutFour';
import LayoutFive from './LayoutFive';

const Page = (props) => {
    const {page, layout} = props;
    const layout_selection = {
        '1': <LayoutOne page={page}/>,
        '2': <LayoutTwo page={page}/>,
        '3': <LayoutThree page={page}/>,
        '4': <LayoutFour page={page}/>,
        '5': <LayoutFive page={page}/>,
    };
    return (
        <Fragment>
            {layout_selection[layout]}
        </Fragment>
    )
};
export default Page;
