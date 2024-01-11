import React from 'react';
import './ViewPost.css'
import 'react-toastify/dist/ReactToastify.css';
// import { connect } from 'react-redux';
// import { getParticularPostData } from "../Redux/actions";
import { Button } from '@mui/material'
import { MyContext } from '../NavBar/MyContext';
import NewVideo from '../NewVideo/NewVideo';
import { Link } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import axios from 'axios'
import { withRouter } from 'react-router-dom';

class ViewPost extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)
    this.state = {
      _id: props.match.params.id,
      open: true,
      updateFlag: true,
      formFlag: false,
      setFlag: this.setFlag,
    }
  }

  setFlag = (value) => { this.setState({ formFlag: value }) }

  componentDidMount() {
    if (localStorage.getItem('token') === null)
      this.props.history.push('/')
    axios.get('http://localhost:8000/validateToken', {
      headers: {
        authorization: ` Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => {
      const { getParticularPostData } = this.props;
      const { _id } = this.state;
      getParticularPostData(_id)
    })
      .catch(er => {

        this.props.history.push('/'); localStorage.clear()
      })
    console.log("CALLED COMPONENT")

  }

  handleEditclick = () => {
    this.setState({ formFlag: true })
  }
  handleLogout = () => {
    localStorage.clear()
  }
  render() {
    const { particularPostDetails } = this.props;
    console.log(particularPostDetails)
    let link = particularPostDetails && particularPostDetails[0] && particularPostDetails[0].link
    let title = particularPostDetails && particularPostDetails[0] && particularPostDetails[0].title;
    let description = particularPostDetails && particularPostDetails[0] && particularPostDetails[0].description
    let date = particularPostDetails && particularPostDetails[0] && particularPostDetails[0].date;

    const { formFlag, _id } = this.state
    let createDate = new Date(date);
    createDate = `${createDate.getDate()}/${createDate.getMonth() + 1}/${createDate.getFullYear()}`
    return (<>
      <div className="wholeCard">
        <div className="viewNavBar">
          <div className="homeEditButton">
            <Link to='/home' id='editPostToHomeButton' className='homeButtonLink'>
              <Button
                variant="contained"
                size="medium">
                Home
              </Button>
            </Link>
            <div className="headingTitle">
              Video Details
            </div>
            <MyContext.Provider value={{ ...this.state, updateFlag: true, setFlag: this.setFlag }}>
              <div className="editAndLogoutButton">
                <Button
                  className='viewEditLink'
                  variant="contained"
                  size="medium"
                  onClick={this.handleEditclick}>
                  Edit Post
                </Button>
                <Link to='/' className='homeButtonLink'>
                  <Button variant="contained" size="medium" id='logoutButton'
                    onClick={this.handleLogout}>
                    Logout
                  </Button>
                </Link>
              </div>
              {formFlag && (<NewVideo _id={_id} link={link} date={date} description={description} title={title} open={this.state.open} />)}
            </MyContext.Provider>
          </div>
        </div>
        <div className="cardBody">
          <div className="videoFrame">
            <iframe src={link && link.replace("watch?v=", "embed/")} title={title} className="videoLink" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen ></iframe>
          </div>
          <div className="detailSection">
            <div className="details">
              <div id="linkView" className="detailValue">
                <span id='videoLinkHeading'>Video Link : </span>
                <span>{link}</span>
              </div>
              <div className="titleDate">
                <div className='dateCreated'>
                  <span>Date Created : <span>{createDate}</span></span>
                </div>
              </div>
            </div>
            <div className="details">
              <div className="detailValue">
                <div >Video Title : </div>
                {title}
              </div>
            </div>
            <div className="details">
              <div className="detailValue">
                <div >Video Description : </div>
                {description}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>)
  }
}



export default withRouter(ViewPost);
