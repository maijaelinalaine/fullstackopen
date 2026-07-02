import Header from "./Header";
import Content from "./Content";

export default function Course({ header, parts }) {
  return (
    <div>
      <Header course={header} />
      <Content parts={parts} />
    </div>
  );
}
