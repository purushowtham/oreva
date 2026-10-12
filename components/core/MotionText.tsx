import './MotionText.css';

/** Stable markup for character and word motion, with one readable text label. */
export default function MotionText({ text }: { text: string }) {
  return <span className="motionText">
    <span className="motionText__accessible">{text}</span>
    <span aria-hidden="true">
      {text.split(' ').map((word, index) => <span key={`${index}-${word}`}>
        {index > 0 ? ' ' : null}
        <span className="motionText__word">
          {Array.from(word).map((letter, letterIndex) =>
            <span className="motionText__letter" key={letterIndex}>{letter}</span>)}
        </span>
      </span>)}
    </span>
  </span>;
}
