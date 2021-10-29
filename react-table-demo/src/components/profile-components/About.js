function About(props) {
  return (
    <div>
      <p>{props.about.content}</p>
      <p>{props.about.description}</p>
    </div>
  );
}

export default About;