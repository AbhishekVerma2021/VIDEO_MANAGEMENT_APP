import React from 'react';
import Card from './Card';
import { shallow, configure } from 'enzyme';
import Adapter from "@cfaester/enzyme-adapter-react-18";
configure({ adapter: new Adapter() });
import { data } from './testConstant';


describe('Test <Card/>', () => {
    it('Should render Card component', () => {
        const component = shallow(<Card data={data} />);
        const tree = component.debug();
        expect(tree).toMatchSnapshot();
    })

    it('Link of the video should be "https://www.youtube.com/embed/e64JTo7LMmY"', () => {
        const component = shallow(<Card data={data} />);
        const videoLink = data.link.replace("watch?v=", "embed/")
        expect(component.find('iframe').prop('src')).toEqual(videoLink)
    })

    it('Title of the video should be "This is a title"', () => {
        const component = shallow(<Card data={data} />);
        expect(component.find('.videoTitle').text()).toBe(data.title)
    })

    it('Video description of the video should be "sadn asd sad  saf rewef wefew f wef we fw ef wef we f"', () => {
        const component = shallow(<Card data={data} />);
        expect(component.find('.videoDescription').text()).toBe(data.description)
    })

    it('Date of the video should be "Created On: 17/4/2023"', () => {
        const component = shallow(<Card data={data} />);
        expect(component.find('.videoDate').text()).toEqual('Created On: 17/4/2023')
    })

    it('ViewPost route of the video should be "/viewPost/643d8663cdcd1ac35198e3ae"', () => {
        const component = shallow(<Card data={data} />);
        expect(component.find('.viewLink').prop('to')).toBe('/viewPost/643d8663cdcd1ac35198e3ae')
    })
    it('When clicking on edit button it should "Open edit post section"', () => {
        const component = shallow(<Card data={data} />)
        component.find("#editButton").props().onClick();
        expect(component.state("formFlag")).toBe(true);
    })
})




























































// npm test -- Card -u