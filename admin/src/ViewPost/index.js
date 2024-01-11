import { connect } from 'react-redux';
import ViewPost from './ViewPost';

import { mapDispatchToProps, mapStateToProps } from './props';
import { withRouter } from 'react-router-dom';

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ViewPost));