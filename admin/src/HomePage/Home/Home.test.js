import React from 'react';
import Home from './Home';
import { shallow, configure } from 'enzyme';
import Adapter from "@cfaester/enzyme-adapter-react-18";
configure({ adapter: new Adapter() });
import { postCardData, searchResultPostDetails } from './testConstant';
import Home from './Home';

describe('Test <Home/>', () => {
    it('Should render Home componnet', () => {
        const component = shallow(< Home postCardData={postCardData} searchResultPostDetails={searchResultPostDetails} />);
        const tree = component.debug();
        expect(tree).toMatchSnapshot();
    })
})