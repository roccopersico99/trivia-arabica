function About(props) {
  return (
    <div>
      <p>{props.about.content}</p>
      <ul>
        <li>
          <a href={props.about.links[0].url}>{props.about.links[0].title}</a>
        </li>
        <li>
          <a href={props.about.links[1].url}>{props.about.links[1].title}</a>
        </li>
        <li>
          <a href={props.about.links[2].url}>{props.about.links[2].title}</a>
        </li>
        <li>
          <a href={props.about.links[3].url}>{props.about.links[3].title}</a>
        </li>
      </ul>
    </div>
  );
}

export default About;
