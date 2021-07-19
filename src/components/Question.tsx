import { ReactNode } from 'react';
import cx from "classnames";
import '../styles/questions.scss';

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  children?: ReactNode;
  isAnswered?: boolean;
  isHighlighted?: boolean;
}


export function Question({
  content,
  author,
  isAnswered = false,
  isHighlighted = false,
  children,

// `question ${isAnswer ? 'answered': ''} ${isHighlighted ? 'highlighted' : ''}`
// no exemplo abaixo aswered foi passado como um boleano e com a importação do classnames ele só é chamado caso for true

}: QuestionProps) {
  
  return (
    <div className={cx(
     'question', { answered : isAnswered },
     { highlighted : isHighlighted && !isAnswered },
    )}>

      
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>   
        {children}
        </div>
      </footer>
    </div>

  );
  }