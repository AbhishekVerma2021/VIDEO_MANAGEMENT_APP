import React from 'react';
import './NavBar.css'
import { MyContext } from './MyContext';
import NewVideo from '../NewVideo/NewVideo';
import { Link } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { withRouter } from 'react-router-dom';
import { Button } from '@mui/material';
import { searchResultData } from '../Redux/actions';
import { connect } from 'react-redux'
import { ToastContainer } from 'react-toastify';


class NavBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: true,
            flag: false,
            setFlag: this.setFlag,
            componentFlag: true,
            searchInputText: '',
            searchResult: null,
            searchResultMessageError: false,


        }
        if (localStorage.getItem('token') === null)
            props.history.push('/')

    }

    setFlag = (value) => { this.setState({ flag: value }) }

    componentDidMount() {

    }

    handleCreateNewPost = () => {
        this.setState({ flag: true })
    }
    handleLogout = () => {
        localStorage.clear();
    }

    handleSearchInputChange = (e) => {
        this.setState({ searchInputText: e.target.value })
    }

    handleSearchInput = () => {
        this.props.searchResultData(this.state.searchInputText, this.props.history)
    }

    handleClick = (event) => {
        this.setState({
            anchorEl: event.currentTarget,
            openMenu: true,
        });
    };

    handleClose = () => {
        this.setState({
            anchorEl: null,
            openMenu: false,
        });
    };
    render() {
        const { flag } = this.state

        return (<>
            <MyContext.Provider value={{ ...this.state, componentFlag: true, setFlag: this.setFlag }}>
                <div className="navBar">
                    <div className="icon" onClick={() => { this.props.searchResultData(null, this.props.history) }}>
                        <Link to='/home' className='homeButtonLink' >ADMIN PORTAL</Link>
                    </div>

                    <div className="search">
                        <input type="text" name="search" id="searchInput" placeholder='Search Video' onChange={(e) => { this.handleSearchInputChange(e) }} />
                        <i className="fa-solid fa-magnifying-glass" onClick={() => { this.handleSearchInput() }}></i>
                    </div>
                    <div className="newPost">
                        <div className="newPostAndLogout">
                            <button className="newPostButton" id="newButton" onClick={this.handleCreateNewPost} >
                                Create Video
                            </button>
                            <Link to='/' className='homeButtonLink' >
                                <Button variant="contained" size="medium" id='logoutButton'
                                    onClick={this.handleLogout}>
                                    Logout
                                </Button>
                            </Link>

                        </div>
                        {flag && (<NewVideo open={this.state.open} />)}
                    </div>
                </div>
                <ToastContainer />
            </MyContext.Provider>
        </>);
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        searchResultData: (searchString, history) => dispatch(searchResultData(searchString, history))
    }
}
const mapStateToProps = (state) => {
    return {
        loggedInUserData: state.loggedInUserData,
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar));
