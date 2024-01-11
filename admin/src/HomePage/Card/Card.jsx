import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Card.css'
import { MyContext } from '../../NavBar/MyContext'
import NewVideo from '../../NewVideo/NewVideo'
import 'react-toastify/dist/ReactToastify.css';
import DeleteBox from '../DeleteBox/DeleteBox'

class Card extends Component {

  constructor(props) {
    super(props)
    this.state = {
      open: true,
      updateFlag: true,
      formFlag: false,
      setFlag: this.setFlag,
    }
  }
  setFlag = (value) => { this.setState({ formFlag: value }) }

  handleEditclick = () => {
    this.setState({ formFlag: true })
  }

  render() {
    const { link, title, _id, description } = this.props.data
    const { formFlag, deletBoxFlag } = this.state
    let date = new Date(this.props.data.date)
    date = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    // date = JSON.stringify(date)
    return <>
      <div className="mainCard">
        <div className="Frame">
          <iframe id="frame" src={link && link.toString().replace("watch?v=", "embed/")} title={title} className="videoLink" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen ></iframe>
        </div>
        <div className="videoDetails">
          <div title={title} className="videoTitle">
            {title}
          </div>
          <div title={description} className="videoDescription">
            {description}
          </div>
          <div className="videoDate">
            Created On: {date}
          </div>
          <div className="editDeleteBtns">

            <Link to={`/viewPost/${this.props.data._id}`} className='viewLink' >
              <button id='viewButton'>
                View Post
              </button>
            </Link>
            <MyContext.Provider value={{ ...this.state, updateFlag: true, setFlag: this.setFlag }}>
              <div id="editButton" className='actionBtns' onClick={() => this.handleEditclick()}>
                <i className="fa-solid fa-pen-to-square"></i>
              </div>
              {formFlag && (<NewVideo _id={_id} link={link} date={date} description={description} title={title} open={this.state.open} />)}
            </MyContext.Provider>
            <button id="delButton" className='actionBtns' onClick={() => {
              this.setState({
                deletBoxFlag: true
              })
            }} >
              <i className="fa-sharp fa-solid fa-trash" ></i>
            </button>
          </div>
        </div>
        {/* {alert(deletBoxFlag)} */}
        {deletBoxFlag && (<DeleteBox
          openBox={true}
          answer={(res) => {
            // alert(res)
            if (res)
              this.props.onDelete(_id)
            this.setState({ deletBoxFlag: false })
          }} />)}
      </div>
    </>
  }
}

export default Card;