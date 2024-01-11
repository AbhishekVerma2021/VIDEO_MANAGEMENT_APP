import { getParticularPostData } from "../Redux/actions";



const mapStateToProps = state => {
    return {
        particularPostDetails: state.particularPostDetails,
    };
};

const mapDispatchToProps = dispatch => (
    {
        getParticularPostData: (_id) => dispatch(getParticularPostData(_id)),
        // validateUserToken: (history) => dispatch(validateUserToken(history))
    }
);

export { mapStateToProps, mapDispatchToProps }