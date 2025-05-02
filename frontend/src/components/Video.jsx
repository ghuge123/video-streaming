import React from 'react'
import { Link } from 'react-router-dom'

function Video({ video }) {
  return (
      <div className='col-md-4 my-3' >
        <Link to='/getVideo' state={{video}} style={{textDecoration: 'none'}}>
          <div className="card" style={{ width: "18rem" }}>
            <img src={video.thumbnail} style={{ height: "200px", objectFit: "cover" }} className="card-img-top" alt="..." />
            <div className="card-body">
              <h5 className="card-title">{video.title}</h5>
              <p className="card-text">{video.description}.</p>
            </div>
          </div>
        </Link>
      </div>
  )
}

export default Video
