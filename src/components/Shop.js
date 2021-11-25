import React from 'react';
import '../style/card.css';
import warpedSkate from '../art/warpedSkate.jpg';
import warpedvid from '../art/warpedvid.png';
import 'bootstrap/dist/css/bootstrap.min.css';


const Shop = () => {
    return (
        <div>

<div>
        <div>
          <a href="https://mintable.app/art/item/warped-skate-warped-mentality/iWNc-AYW5wj0vsZ">
            <img src={warpedSkate} className="mt-5 small-img card-1 mx-auto d-block"/>
          </a>
        </div>
        <div>
          <a href="https://mintable.app/videos/item/warp-speed-warped-mentality/JhnigGkRT-6szYS">
            <img src={warpedvid} className="mt-5 small-img card-1 mx-auto d-block "></img>
          </a>
        </div>
      </div>
            
        </div>
    )
}

export default Shop;
