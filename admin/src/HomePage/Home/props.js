import { getData, deletePost, validateUserToken, searchResultData } from '../../Redux/actions';

const mapStateToProps = state => {
    // console.
    return {
        postCardData: state.postCardData,
        searchResultPostDetails: state.searchResultPostDetails,
        loggedInUserData: state.loggedInUserData
    };
};
const mapDispatchToProps = dispatch => {
    return {
        getData: (page, limit, history) => dispatch(getData(page, limit, history)),
        deletePost: (_id) => dispatch(deletePost(_id)),
        searchResultData: (searchString, history) => dispatch(searchResultData(searchString, history))
        // validateUserToken: (token) => dispatch(validateUserToken(token))
    };
};

export { mapStateToProps, mapDispatchToProps }