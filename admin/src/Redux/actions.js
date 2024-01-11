import axios from 'axios';
import {
  FETCH_DATA_ERROR,
  FETCH_DATA_SUCCESS,
  CREATE_POST_ERROR,
  CREATE_POST_SUCCESS,
  UPDATE_POST_ERROR,
  UPDATE_POST_SUCCESS,
  DELETE_POST_ERROR,
  DELETE_POST_SUCCESS,
  GET_PARTICULAR_POST_DATA_ERROR,
  GET_PARTICULAR_POST_DATA_SUCCESS,
  CREATE_USER_SUCCESS,
  CREATE_USER_ERROR,
  SEARCH_RESULT_DATA_ERROR,
  SEARCH_RESULT_DATA_SUCCESS,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_ERROR,
  VALIDATE_TOKEN
} from './actionTypes'



// POST ACTIONS

export const getData = (history) => {
  return dispatch => {
    axios.get('http://localhost:8000/', {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        dispatch({
          type: FETCH_DATA_SUCCESS,
          payload: {
            data: res.data
          }
        })
      })
      .catch(error => {
        console.log(error)
        dispatch({
          type: FETCH_DATA_ERROR,
          payload: {
            error: error.response.data.errors[0].msg
          }
        })
        history.push('/')
      })
  }
}

export const getParticularPostData = (_id) => {
  return (dispatch) => {
    axios.get('http://localhost:8000/viewPost?_id=' + _id, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        dispatch({
          type: GET_PARTICULAR_POST_DATA_SUCCESS,
          payload: {
            data: res.data
          }
        })
      })
      .catch(error => {
        dispatch({
          type: GET_PARTICULAR_POST_DATA_ERROR,
          payload: {
            error: "Could not view details. Please retuern to home page!"
          }
        })
      })
  }
}

export const createPost = (title, link, description) => {
  return dispatch => {
    const postData = {
      title: title,
      link: link,
      description: description
    }
    axios.post('http://localhost:8000/createPost', postData, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        dispatch({
          type: CREATE_POST_SUCCESS,
          payload: {
            data: res.data
          }
        })
      }).then(() => dispatch(getData()))
      .catch(error => {
        dispatch({
          type: CREATE_POST_ERROR,
          payload: {
            error: error
          }
        })
      })
  }
}

export const updatePost = (title, link, description, _id, date, history) => {
  return dispatch => {
    const updatedPostData = {
      title: title,
      link: link,
      description: description,
      _id: _id,
      date: date
    }

    axios.put('http://localhost:8000/editPost', updatedPostData,
      {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(res => {
        dispatch({
          type: UPDATE_POST_SUCCESS,
          payload: {
            searchData: res.data
          }
        })
      }).then(() => { dispatch(getData()); history.push('/home') })
      .then(() => dispatch(getParticularPostData()))
      .catch(error => {
        dispatch({
          type: UPDATE_POST_ERROR,
          payload: {
            error: "Could not update post."
          }
        })
      })
  }
}

export const deletePost = (_id) => {
  return dispatch => {
    axios.delete('http://localhost:8000/deletePost?_id=' + _id, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        dispatch({
          type: DELETE_POST_SUCCESS,
          payload: {
            message: "Post deleted successfully."
          }
        })
      }).then(() => dispatch(getData()))
      .catch(error => {
        dispatch({
          type: DELETE_POST_ERROR,
          payload: {
            error: "Could not delete post."
          }
        })
      })
  }
}

// USER ACTIONS

export const createUser = (username, email, password, history) => {
  return dispatch => {
    const userData = {
      username: username,
      email: email,
      password: password,
    }
    axios.post('http://localhost:8000/signUp', userData)
      .then(res => {
        console.log("signup action", res.data)
        dispatch({
          type: CREATE_USER_SUCCESS,
          payload: {
            newUserData: res.data,
          }
        })
      })
      // .then(() => { history.push('/') })
      .catch(error => {
        console.log("===>>", error)
        dispatch({
          type: CREATE_USER_ERROR,
          payload: {
            error: error.response.data.errors[0].msg
          }
        })
      })
  }
}



export const searchResultData = (searchString, history) => {
  return dispatch => {
    if (searchString === null) {
      dispatch({
        type: SEARCH_RESULT_DATA_SUCCESS,
        payload: {
          searchData: null,
        }
      })
    }
    else {
      axios.get('http://localhost:8000/search?searchString=' + searchString, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then((res) => {
          console.log('=======', res.data)
          dispatch({
            type: SEARCH_RESULT_DATA_SUCCESS,
            payload: {
              searchData: res.data
            }
          })
        })
        .catch((error) => {
          console.log('-->>', error)
          dispatch({
            type: SEARCH_RESULT_DATA_ERROR,
            payload: {
              error: error.response.data.errors[0].msg
            }
          })
        })
    }
  }
}

export const loginUser = (email, password, history) => {
  return dispatch => {
    const loginData = {
      email: email,
      password: password
    }
    axios.post('http://localhost:8000/login', loginData)
      .then((res) => {
        localStorage.setItem('token', res.data.accessToken)
        console.log(res.data.payload.username)
        dispatch({
          type: USER_LOGIN_SUCCESS,
          payload: {
            username: res.data.payload.username,
            email: res.data.payload.email
          }
        })
        history.push('/home')
      })
      .catch((error) => {
        if (error) {
          console.log(error.response)
          dispatch({
            type: USER_LOGIN_ERROR,
            payload: {
              error: error.response.data
            }
          })
        }
      })
  }
}


export const validateUserToken = (history) => {
  return dispatch => {
    console.log('logged')
    console.log('valid')
    axios.post('http://localhost:8000/validateToken', {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((res) => {
        console.log("=>", res.data)
      })
      .catch((er) => {
        dispatch({
          type: VALIDATE_TOKEN,
          payload: {
            error: er
          }
        }); history.push('/');
      })
  }
}

