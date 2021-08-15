import { useHistory, useParams } from 'react-router-dom';
import {useState} from 'react';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import check from '../assets/images/check.svg';
import answer from '../assets/images/answer.svg';
import illustration from '../assets/images/bg.png';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
// import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

import { Paper } from '@material-ui/core';

import Container from '@material-ui/core/Container'

import DarkModeToggle from "react-dark-mode-toggle";

import {ThemeProvider, createTheme} from '@material-ui/core/styles';


import '../styles/room.scss';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  // const { user } = useAuth();
  const history = useHistory()
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { title, questions } = useRoom(roomId)
  console.log(questions)

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/');
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleHighlightQuestion(questionId: string){
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleCheckQuestionAsAnswered(questionId: string){
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });

  }

  const [darkMode, setDarkMode] = useState(false)
   const darkTheme = createTheme ({
     palette:{
       type: "dark"

     },
   });
   const lightTheme = createTheme({
     
   });

  return (

    <ThemeProvider theme={darkMode ? darkTheme : lightTheme} >
      <Paper className="MuiPaper-root">
    <Container maxWidth="xl" id="page-room">
    <div id="page-room">
      <header>
        <div className="content">
          <img className="logo" src={logoImg} style={{maxWidth: "8.125rem"}} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
          <DarkModeToggle size={50} checked={darkMode} onChange = {()=> setDarkMode(!darkMode)} />
        </div>

        <div className="question-list">
          {questions.map(question => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                <> 
                <button
                  type="button"
                  onClick={() => handleCheckQuestionAsAnswered(question.id)}
                >
                  <img src={check} alt="Marcar pergunta como respondida" />
                </button>
                <button
                  type="button"
                  onClick={() => handleHighlightQuestion(question.id)}
                >
                  <img src={answer} alt="Dar destaque a pergunta" />
                </button>
                </>
                )}

                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                > 
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            );
          })}
          <img className="bg" src={illustration} alt="illustration" />
        </div>
      </main>
    </div>

        

    </Container>
    </Paper>
    </ThemeProvider>
  );
}
