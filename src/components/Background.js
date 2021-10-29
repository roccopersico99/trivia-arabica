function Background(props) {

  return (
    <div  className="background-gradient background-div">
      <div className="background-inner-div">
              {props.children}
      </div>
    </div>
  );
}

export default Background;