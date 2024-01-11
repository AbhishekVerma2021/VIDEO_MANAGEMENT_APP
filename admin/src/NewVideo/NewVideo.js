import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import React from "react";
import { MyContext } from '../NavBar/MyContext';
import './NewVideo.css';
import AltImage from './NewVideo.jpg';
import UploadBox from './WarningBoxes/UploadBox';
import UpdateBox from './WarningBoxes/UpdateBox';
import CancelUploadBox from './WarningBoxes/CancelUploadBox'
import CancelUpdateBox from './WarningBoxes/CancelUpdateBox'
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux'
import { createPost, updatePost, getData, getParticularPostData } from '../Redux/actions'

class NewVideo extends React.Component {
  date = new Date();
  constructor(props) {
    super(props)
    this.state =
    {
      _id: props._id,
      link: props.link ? props.link.replace("watch?v=", "embed/") : "",
      updateButtonError: true,
      date: `${this.date.getDate()}/${this.date.getMonth() + 1}/${this.date.getFullYear()}`,
      open: this.props.open,
      descriptionLengthError: false,
      titleLengthError: false,
      linkRegexError: false,
      titleCheck: true,
      descriptionCheck: true,
      linkCheck: true,
      emptyLinkError: false,
      emptyTitleError: false,
      emptyDescriptionError: false,

      //Upload

      checkLinkIsEmptyUD: false,
      testLinkInput: props.link ? props.link.replace("embed/", "watch?v=") : "",
      checkTitleIsEmptyUD: false,
      testTitleInput: props.title ? props.title : "",
      testDescriptionInput: props.description ? props.description : "",
      linkIsEmpty: true,
      openUploadBoxFlag: false,
      cancelUploadBox: false,

      //Update
      checkLinkIsEmptyUT: false,
      checkTitleIsEmptyUT: false,
      checkDescriptionIsEmptyUT: false,

      initialUpdateLink: props.link ? props.link : "",
      initialUpdateTitle: props.title ? props.title : "",
      initialUpdateDescription: props.description ? props.description : "",
      openUpdateBoxFlag: false,
      cancelUpdateBox: false
    }
  }


  handleClose() {
    console.log("CLOSED!!!")
    this.setState({
      open: false
    })
  }


  regex = /^(?:https:\/\/)(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;

  handleLinkInput(e) {
    if (this.regex.test(e.target.value)) {
      this.setState({ link: e.target.value.replace("watch?v=", "embed/") })
    }
    else
      this.setState({ link: "" })
  }
  descriptionValidationHandler(e) {
    //Description validation Handler
    if (e.target.value.length < 20 && e.target.value.length > 0)
      this.setState({ descriptionLengthError: true })
    else
      this.setState({ descriptionLengthError: false })
  }

  titleValidationHandler(e) {
    if (e.target.value.length < 10 && e.target.value.length > 0)
      this.setState({ titleLengthError: true })
    else
      this.setState({ titleLengthError: false })
  }

  componentFlag = false
  switchComponent(context) {
    this.componentFlag = context.componentFlag
    if (!this.componentFlag)
      this.componentFlag = false
  }



  // ==========================================================================================================================


  handleSubmitData() {
    console.log("CALLED UPLOAD")
    const { testLinkInput, testTitleInput, testDescriptionInput } = this.state
    const { createPost } = this.props
    const updatedlink = testLinkInput.replace("embed/", "watch?v=");
    createPost(testTitleInput, updatedlink, testDescriptionInput);
  }

  handleUpdateSubmitData() {
    console.log("CALLED UPDATE")
    const { testLinkInput, testDescriptionInput, testTitleInput, _id } = this.state;
    console.log(_id, "=>", testLinkInput, "=>", testDescriptionInput, "=>", testTitleInput)
    const { updatePost, getParticularPostData } = this.props

    updatePost(testTitleInput, testLinkInput, testDescriptionInput, _id, new Date())
    getParticularPostData(_id)

  }

  checkLinkisEmptyHandler(e) {
    this.setState({ testLinkInput: e.target.value }, () => {
      if (e.target.value !== '') {
        this.setState({ checkLinkIsEmptyUD: false })
      }
      else if (e.target.value === '') {
        this.setState({ checkLinkIsEmptyUD: true })
      }
      else if (!this.regex.test(e.target.value)) {
        this.setState({ linkRegexError: true })
      }
    })
  }

  checkTitleisEmptyHandler(e) {
    this.setState({ testTitleInput: e.target.value }, () => {
      if (e.target.value !== '') {
        this.setState({ checkTitleIsEmptyUD: false })
      }
      else if (e.target.value === '') {
        this.setState({ checkTitleIsEmptyUD: true })
      }
    })
  }

  checkDescriptionIsEmptyHandler(e) {
    this.setState({ testDescriptionInput: e.target.value })
  }

  //UPDATE

  checkOnFocusLinkAndInitialLink(e) {
    if (this.regex.test(e.target.value)) {

    }
  }

  render() {
    const { open, openUploadBoxFlag, openUpdateBoxFlag, cancelUploadBox, cancelUpdateBox, linkCheck, titleCheck, descriptionCheck, link, linkRegexError, descriptionLengthError, emptyLinkError, emptyTitleError, emptyDescriptionError, updateButtonError, initialUpdateDescription, initialUpdateLink, initialUpdateTitle, titleLengthError, checkLinkIsEmptyUD, checkTitleIsEmptyUD, testLinkInput, testTitleInput, testDescriptionInput } = this.state;

    let updateButtonErrorForPost = (updateButtonError || emptyLinkError || emptyDescriptionError || emptyTitleError)
    let error = (linkCheck || titleCheck || descriptionCheck || descriptionLengthError || titleLengthError || linkRegexError)

    return (
      <>
        <MyContext.Consumer>
          {(context) => (
            <Dialog open={open} className='dialogBody' maxWidth={85} >
              {this.switchComponent(context)}
              <DialogTitle className="formTitle" fontSize={30}>
                {this.componentFlag ? `Upload Video` : `Update Video`}
              </DialogTitle>
              <DialogContent sx={{ padding: 0 }} className="dialogBoxContent">
                <div className="dialogStructure">
                  <div className="cardView">
                    <div className="cardContentView">
                      {link !== "" ? <iframe src={link} height="300px" width="500px" title='video_linked'></iframe> : <img src={AltImage} alt="VIDEO" className="altImage" />}
                    </div>
                  </div>
                  <div className="cardDetails">
                    <div
                      className="inputFields"
                      style={{
                        gap: titleLengthError || descriptionLengthError || checkLinkIsEmptyUD || checkTitleIsEmptyUD || linkRegexError || emptyDescriptionError || emptyLinkError || emptyTitleError ? "0%" : null,
                        margin: "0.7vh 0 0 0"
                      }}>
                      {/* LINK INPUT */}
                      <div className="inputTitle">
                        <div className="inputLable">Video Link: <span>*</span></div>
                        <input
                          className="inputField"
                          value={testLinkInput}
                          type='text'
                          style={{
                            borderBottom: linkRegexError ? "2px solid #cb2020" : null
                          }}
                          placeholder="Enter Video Link..."
                          onFocus={(e) => {
                            if (!this.componentFlag) {
                              this.checkOnFocusLinkAndInitialLink(e)
                            }
                          }}
                          onChange={(e) => {
                            if (this.componentFlag) {
                              this.checkLinkisEmptyHandler(e)
                            }
                            if (e.target.value !== '') {
                              if (this.regex.test(e.target.value))
                                this.setState({ linkCheck: false })
                            }
                            else if (e.target.value === '')
                              this.setState({
                                linkCheck: true,
                              })
                            this.handleLinkInput(e)
                            //Link error message handler
                            this.setState({
                              linkRegexError: e.target.value !== '' ? !this.regex.test(e.target.value) ? true : false : false
                            })
                            //Field empty check
                            this.setState({
                              emptyLinkError: e.target.value === "" ? true : false
                            })
                            //Update Button Error
                            if (!this.componentFlag) {
                              this.checkLinkisEmptyHandler(e)
                              // console.log("initialUpdateDescription != testDescriptionInput ", initialUpdateDescription != testDescriptionInput)
                              console.log(initialUpdateTitle !== testTitleInput, initialUpdateDescription !== testDescriptionInput)
                              if ((e.target.value !== initialUpdateLink && this.regex.test(e.target.value)) || ((initialUpdateDescription !== testDescriptionInput) || (initialUpdateTitle !== testTitleInput)))
                                this.setState({ updateButtonError: false })
                              else
                                this.setState({ updateButtonError: true })
                            }
                          }} />
                        {checkLinkIsEmptyUD && (<div className="errorMessage" >
                          This Field is mandatory!
                        </div>)}
                        {linkRegexError && <div className="errorMessage" style={{ fontSize: "1.9vh" }} >Provide a Valid Link!</div>}
                      </div>


                      {/* TITLE FIELD */}
                      <div className="inputTitle">
                        <div className="inputLable">Video Title: <span>*</span></div>
                        <input
                          id="titleId"
                          className="inputField"
                          placeholder="Enter Title..."
                          style={{
                            borderBottom: titleLengthError ? "2px solid #cb2020" : null
                          }}
                          value={testTitleInput}
                          type='text'
                          onFocus={(e) => {
                            if (this.componentFlag) {
                              //checking if link field is empty
                              if (testLinkInput === '') {
                                this.setState({ checkLinkIsEmptyUD: true })
                              }
                            }
                          }}
                          onChange={(e) => {
                            // console.log("LENGTH=>", e.target.value.length);
                            // this.setState({ title: e.target.value, })

                            if (this.componentFlag) {
                              this.checkTitleisEmptyHandler(e)
                            }

                            if (e.target.value !== '')
                              this.setState({ titleCheck: false })
                            else
                              this.setState({ titleCheck: true })

                            this.titleValidationHandler(e)


                            this.setState({
                              emptyTitleError: e.target.value.length === 0 ? true : false
                            })

                            if (!this.componentFlag) {
                              this.checkTitleisEmptyHandler(e)
                              if (e.target.value.length >= 10 && ((e.target.value !== initialUpdateTitle) || (initialUpdateDescription !== testDescriptionInput)))
                                this.setState({ updateButtonError: false })
                              else
                                this.setState({ updateButtonError: true })
                            }
                          }} />

                        {checkTitleIsEmptyUD && (<div className="errorMessage" >This Field is mandatory!</div>)}
                        {titleLengthError && (<div className="errorMessage" >Minimum 10 characters are reqiured!</div>)}
                      </div>

                      {/* DESCRIPTION FIELD */}
                      <div className="inputTitle">
                        <div className="inputLable">Video Description: <span>*</span></div>
                        <TextField
                          variant="filled"
                          className="textArea"
                          error={descriptionLengthError}
                          multiline
                          rows={4}
                          placeholder="Enter Description..."
                          value={testDescriptionInput}
                          onFocus={(e) => {
                            if (this.componentFlag) {
                              if (testLinkInput === '') {
                                this.setState({ checkLinkIsEmptyUD: true })
                              }
                              if (testTitleInput === '') {
                                this.setState({ checkTitleIsEmptyUD: true })
                              }
                            }
                          }}
                          onChange={(e) => {
                            if (this.componentFlag) {
                              this.checkDescriptionIsEmptyHandler(e)
                            }

                            if (e.target.value !== '')
                              this.setState({ descriptionCheck: false })
                            else
                              this.setState({ descriptionCheck: true })

                            this.descriptionValidationHandler(e)

                            //Field empty check
                            this.setState({
                              emptyDescriptionError: e.target.value.length === 0 ? true : false
                            })

                            //Update Button error
                            if (!this.componentFlag) {
                              this.checkDescriptionIsEmptyHandler(e)
                              if (e.target.value.length >= 20 && ((e.target.value !== initialUpdateDescription) || (initialUpdateTitle !== testTitleInput))) {
                                this.setState({ updateButtonError: false })
                              }
                              else
                                this.setState({ updateButtonError: true })
                            }
                          }}
                        />
                        {emptyDescriptionError && (<div className="errorMessage" >This Field is mandatory!</div>)}
                        {descriptionLengthError && (<div className="errorMessage" >Minimum 20 characters are reqiured!</div>)}
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
              <DialogActions >
                {/* <Link to='/'> */}
                <span
                  title={(!this.componentFlag ? updateButtonErrorForPost : error) ? "Enter all the required fields" : "Upload"}
                  style={{
                    cursor: (!this.componentFlag ? updateButtonErrorForPost : error) ? "not-allowed" : "pointer"
                  }}>
                  <Button
                    id="uploadButton"
                    variant="outlined"
                    disabled={
                      (this.componentFlag ? error : false) || (!this.componentFlag ? updateButtonError : false)
                    }
                    sx={{
                      color: (!this.componentFlag ? updateButtonErrorForPost : error) ? " #03479463 !important" : "#034694 !important",
                      border: (!this.componentFlag ? updateButtonErrorForPost : error) ? "2px solid  #00000037 !important" : "2px solid #034694 !important",
                    }}

                    onClick={() => {
                      if (this.componentFlag) {
                        this.setState({ openUploadBoxFlag: true })
                      }
                      else {
                        this.setState({ openUpdateBoxFlag: true })
                        // this.props.history.push('/home')
                      }
                    }}>
                    {this.componentFlag ? `Upload` : `Update`}
                  </Button>
                </span>
                <Button id="cancelButton" variant="outlined" onClick={() => {
                  if (this.componentFlag) {
                    if ((this.regex.test(testLinkInput) && testLinkInput !== '') || testDescriptionInput !== '' || testTitleInput !== '') {
                      this.setState({ cancelUploadBox: true })
                    }
                    else {
                      this.handleClose(context);
                      context.setFlag(false);
                    }
                  }
                  else {
                    if ((testLinkInput !== initialUpdateLink || this.regex.test(testLinkInput) && (testTitleInput !== initialUpdateTitle || testDescriptionInput !== initialUpdateDescription))) {
                      this.setState({ cancelUpdateBox: true })
                    }
                    else {
                      this.handleClose(context);
                      context.setFlag(false);
                    }
                  }
                }}>
                  Cancel
                </Button>

              </DialogActions>
              {openUploadBoxFlag && <UploadBox openBox={true}
                answer={(res) => {
                  if (res && this.componentFlag) {
                    this.handleSubmitData();
                    this.handleClose(context);
                    context.setFlag(false);
                  }
                  this.setState({ openUploadBoxFlag: false })
                }} />}
              {openUpdateBoxFlag && <UpdateBox openBox={true}
                answer={(res) => {
                  if (res && !this.componentFlag) {
                    this.handleUpdateSubmitData()
                    this.handleClose(context);
                    context.setFlag(false);
                  }
                  this.setState({ openUpdateBoxFlag: false })
                }} />}
              {cancelUploadBox && <CancelUploadBox openBox={true}
                answer={(res) => {
                  if (res && this.componentFlag) {
                    this.handleClose(context);
                    context.setFlag(false);
                  }
                  else
                    this.setState({ cancelUploadBox: false })

                }} />}
              {cancelUpdateBox && <CancelUpdateBox openBox={true}
                answer={(res) => {
                  if (res && !this.componentFlag) {
                    this.handleClose(context);
                    context.setFlag(false)
                  }
                  else {
                    this.setState({ cancelUpdateBox: false })
                  }
                }} />
              }
            </Dialog>
          )}
        </MyContext.Consumer >
        {/* <ToastContainer /> */}
      </>
    )
  }
}

const mapDispatchToProps = dispatch => (
  {
    createPost: (title, link, description) => dispatch(createPost(title, link, description)),
    updatePost: (title, link, description, _id, date) => dispatch(updatePost(title, link, description, _id, date)),
    getData: () => dispatch(getData()),
    getParticularPostData: (_id) => dispatch(getParticularPostData(_id))
  });

export default connect(null, mapDispatchToProps)(NewVideo);