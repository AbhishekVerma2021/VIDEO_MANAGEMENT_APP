import React from 'react'
import NavBar from '../../NavBar/NavBar'
import Card from '../Card/Card'
import './Home.css'
import 'react-toastify/dist/ReactToastify.css';
// import { connect } from 'react-redux'
// import { getData, deletePost, validateUserToken } from '../../Redux/actions'
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
// import { } from '../../Redux/actions';
// import { withRouter } from 'react-router-dom';

class Home extends React.Component {

  constructor(props) {
    super(props)

  }
  componentDidMount() {
    axios.get('http://localhost:8000/validateToken', {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => {
      console.log(res)
      this.props.getData(this.props.history)
    })
      .catch(error => {
        console.log(error)
        toast.error(error.response.data, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000,
        })
        this.props.history.push('/'); localStorage.clear()
      })
  }


  handleDelete = (_id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      this.props.history.push('/')
    }
    const { deletePost } = this.props;
    deletePost(_id);
  }


  render() {
    const { postCardData, searchResultPostDetails } = this.props
    console.log("SEARCH_DATA", this.props.searchResultPostDetails)
    console.log("POST_CARD_DATA", this.props.postCardData)
    // console.log(postCardData)
    return <>
      <NavBar />
      {searchResultPostDetails.length !== 0 ?
        (<div>
          {
            searchResultPostDetails && searchResultPostDetails.length === 0 ? <div className='message'><h2>No Video Search availble. Please upload one.</h2></div> :
              <div className="cardHome">
                {
                  Object.values(searchResultPostDetails).map((details) => {
                    return (<Card data={details} onDelete={() => {
                      this.handleDelete(details._id)
                    }} />)
                  })
                }
              </div>
          }
          <ToastContainer />
        </div>) : (<div>
          {
            postCardData && postCardData.length === 0 ? <div className='message'><h2>No Video availble. Please upload one.</h2></div> :
              <div className="cardHome">
                {
                  Object.values(postCardData).map((details) => {
                    return (<Card data={details} onDelete={() => {
                      this.handleDelete(details._id)
                    }} />)
                  })
                }
              </div>
          }
          <ToastContainer />
        </div>)
      }
    </>
  }
}

export default Home;