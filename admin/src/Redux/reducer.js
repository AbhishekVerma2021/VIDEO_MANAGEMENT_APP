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
  SEARCH_RESULT_DATA_SUCCESS,
  SEARCH_RESULT_DATA_ERROR,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_ERROR,
  VALIDATE_TOKEN
} from './actionTypes'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';



const initialState = {
  //POST STATES
  postCardData: {},
  particularPostDetails: null,
  fetchDataErrorMessage: null,
  createPostErrorMessage: null,
  updatePostErrorMessage: null,
  deletePostErrorMessage: null,
  getPostErrorMessage: null,

  searchResultPostDetails: [],

  createNewUserData: null,
  createUserErrorMessage: '',

  loggedInUserData: {}
}

const reducer = (state = initialState, action) => {

  switch (action.type) {
    case FETCH_DATA_SUCCESS:
      {
        const { data } = action.payload
        console.log(data, initialState.postCardData)
        // toast.success(`Welcome ${state.loggedInUserData.username}`, {
        //   position: toast.POSITION.BOTTOM_RIGHT,
        //   autoClose: 3000
        // })
        return {
          ...state,
          postCardData: data,
          searchResultPostDetails: []
        }
      }
    case FETCH_DATA_ERROR:
      {
        const { error } = action.payload
        toast.error(error, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000
        })

        return {
          ...state,
          fetchDataErrorMessage: error
        }
      }
    case GET_PARTICULAR_POST_DATA_SUCCESS:
      {
        const { data } = action.payload;
        return {
          ...state,
          particularPostDetails: data
        }
      }
    case GET_PARTICULAR_POST_DATA_ERROR:
      {
        const { error } = action.payload;
        toast.error(error, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000
        })
        return {
          ...state,
          getPostErrorMessage: error
        }
      }
    case UPDATE_POST_SUCCESS:
      {
        toast.success('Post updated successfully.', {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000
        })
        console.log("toast end")
        return {
          ...state,
        }
      }
    case UPDATE_POST_ERROR:
      {
        const { error } = action.payload

        return {
          ...state,
          updatePostErrorMessage: error
        }
      }
    case DELETE_POST_SUCCESS:
      {
        toast.success('Post deleted successfully', {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000
        })

        return {
          ...state
        }
      }
    case DELETE_POST_ERROR:
      {
        const { error } = action.payload
        toast.error(error, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000
        })
        return {
          ...state,
          deletePostErrorMessage: error
        }
      }
    case CREATE_POST_SUCCESS:
      {
        const { data } = action.payload
        const { postCardData } = state
        toast.success(`Post created successfully`, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000
        })

        return {
          ...state,
          postCardData: Object.assign(data, ...postCardData)
        }
      }
    case CREATE_POST_ERROR:
      {
        const { error } = action.payload;
        toast.error(error, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000,
        })
        return {
          ...state,
          createPostErrorMessage: error
        }
      }
    case CREATE_USER_SUCCESS:
      {
        const { newUserData } = action.payload;
        console.log(newUserData)
        toast.success('Account created successfully.', {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000
        })
        return {
          ...state,
          createNewUserData: newUserData,
        }
      }
    case CREATE_USER_ERROR: {
      const { error } = action.payload;
      toast.error(error, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
      })
      return {
        ...state,
        createUserErrorMessage: error
      }
    }
    case USER_LOGIN_SUCCESS: {
      const { username, email } = action.payload;
      toast.success(`Welcome ${username}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000
      })
      // const loggedInUserData=Object.assign(action.payload,{});
      return {
        ...state,
        loggedInUserData: Object.assign(action.payload, {})
      }
    }
    case USER_LOGIN_ERROR: {
      const { error } = action.payload;
      toast.error(error, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000
      })
      return {
        ...state
      }
    }
    case SEARCH_RESULT_DATA_SUCCESS: {
      const { searchData } = action.payload
      if (searchData !== null) {
        console.log('??????????????????')

        return {
          ...state,
          searchResultPostDetails: [...searchData]
        }
      }

      else {
        return {
          ...state,
          searchResultPostDetails: []
        }
      }
    }
    case SEARCH_RESULT_DATA_ERROR: {
      const { error } = action.payload;

      toast.error(error, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000
      })
      return {
        ...state
      }
    }
    case VALIDATE_TOKEN: {
      toast.error('No post found!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000
      })
      return {
        ...state
      }
    }
    default:
      return state;
  }
}

export default reducer;