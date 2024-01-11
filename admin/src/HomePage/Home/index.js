import { connect } from "react-redux";
import Home from "./Home";

import { mapStateToProps, mapDispatchToProps } from "./props";
import { withRouter } from 'react-router-dom';

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));