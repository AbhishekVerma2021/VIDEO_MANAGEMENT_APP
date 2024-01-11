import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'



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
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title" style={{ color: "red !importand" }}>
                        Warning
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to discard details you entered?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            this.setState({ openBox: false });
                            this.props.answer(false)
                        }}>CANCEL</Button>
                        <Button onClick={() => {
                            this.setState({ openBox: false });
                            this.props.answer(true)
                        }} autoFocus>
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default DeleteBox