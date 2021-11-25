import React from 'react'
import {Nav} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/card.css';

const Navbar = () => {
    return (
        <div>
        <Nav variant="pills" className="justify-content-center" activeKey="/about">
          <Nav.Item className="mr-3 card-1">
            <Nav.Link href="/shop">Shop</Nav.Link>
          </Nav.Item>
          <Nav.Item className="mr-3 card-1">
            <Nav.Link href="/about"eventKey="link-1">About</Nav.Link>
          </Nav.Item>
          <Nav.Item className="mr-3 card-1">
            <Nav.Link href="/$WARP" eventKey="link-2">$WARP</Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
    )
}

export default Navbar;
