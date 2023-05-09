import React from "react";
// import "./User.css";

function User({address, displayName}) {

    const firstFive = address.toString().slice(0, 5);
    const lastFour = address.toString().slice(-4);
    const abbreviatedAddress = firstFive + "..." + lastFour;

  return (
    <div className="sidebarOption">
        <h2>{displayName}</h2>
        <h4>{abbreviatedAddress}</h4>
    </div>
  );
}

export default User;
