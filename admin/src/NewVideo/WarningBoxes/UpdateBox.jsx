import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { withRouter, Link } from "react-router-dom";



class DeleteBox extends React.Component {
    constructor(props) {
        super(props)
        let { openBox } = props
        this.state = {
            openBox: openBox
        }
    }
    render() {
        const { openBox } = this.state
        return (
            <div>
                <Dialog
                    open={openBox}
                    // onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Edit Details
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to apply changes to this post?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            this.setState({ openBox: false });
                            this.props.answer(false)
                        }}>CANCEL</Button>
                        {/* <Link to='/home'> */}
                        <Button onClick={() => {
                            this.setState({ openBox: false });
                            this.props.answer(true)

                        }} autoFocus>
                            OK
                        </Button>
                        {/* </Link> */}
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default withRouter(DeleteBox);