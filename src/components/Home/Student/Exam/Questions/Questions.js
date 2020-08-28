import React, {useEffect, useState} from 'react';
import {Container} from "react-bootstrap";
import QuestionDb from "../../../../../DBManager/db/QuestionDb";
import {
    AppBar,
    Button,
    Drawer,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Toolbar,
    Typography
} from '@material-ui/core';
import Banner from "../../../../Navigation/Toolbar/Banner";
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";
import Hidden from "@material-ui/core/Hidden";
import QuestionList from "./QuestionList";
import {Checkbox, DefaultButton, Label} from "office-ui-fabric-react";
import QuillEditor from "../../../../Utils/QuillEditor";
import './Questions.css';
import {DoneAll, DoneOutline, SkipNext} from "@material-ui/icons";
import UserAnswerDb from "../../../../../DBManager/db/UserAnswerDb";
import MessageToast from "../../../../Utils/MessageToast";
import UserExamDb from "../../../../../DBManager/db/UserExamDb";
import {trackPromise} from 'react-promise-tracker';


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    rootDummy: {
        display: 'flex',
        marginLeft: '25rem',
        flexWrap: 'wrap',
        '& > *': {
            width: '44rem',
            height: theme.spacing(16),
        },
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 200,
    },
    drawerPaper: {
        width: 350,
    },
    content: {
        flexGrow: 1,
        marginTop: '2rem',
        marginLeft: '15rem'
    },
    items: {
        marginBottom: '1px solid transparent'
    },
    question: {
        marginLeft: '4rem',
        marginBottom: '2rem',
        fontWeight: 'bold'
    }, menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    bar: {
        backgroundColor: '#003678'
    }

}));

/**
 * Component for Enrolling Exam to User
 *
 * @component
 */
const Questions = (props) => {
 /*   const calculateTimeLeft = () => {
        let year = new Date().getFullYear();
        const difference = +new Date(`${year}-10-1`) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
    });

    const timerComponents = [];

    Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval]) {
            return;
        }

        timerComponents.push(
            <span>
        {timeLeft[interval]} {interval}{" "}
      </span>
        );
    });*/


    const [questionList, setQuestionList] = useState([]);
    const [questionItem, setQuestionItem] = useState({});
    const [mobileOpen, setMobileOpen] = useState(false);
    const [messageComponent, setMessageComponent] = useState(false);
    const [messageToast, SetMessageToast] = useState({open: false, title: ''});
    const container = window !== undefined ? () => window().document.body : undefined;
    const classes = useStyles();
    const history = useHistory();
    const sId = props.match.params.id;
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    useEffect(() => {
        trackPromise(QuestionDb.getQuestionsByExam(sId)).then((responseData) => {
            setQuestionList(responseData.data);
        }).catch((e) => {
            SetMessageToast({open: true, title: e.message});
        });
    }, [sId]);

    const handleQuestionsByExam = (value, ind) => {
        const newValue = {...value};
        newValue['index'] = ind + 1;
        newValue['title'] = newValue.question;
        handleOptionsByQuestion(newValue);
    }

    const handleNext = (index) => {
        let newList = {...questionList};
        const eId = props.match.params.eId;
        let options = [];
        questionItem.options.forEach((item) => {
            if (item.isCorrect) {
                options.push({
                    userExamId: eId,
                    optionId: item.id
                })
            }
        });
        if (!!options.length) {
            trackPromise(UserAnswerDb.submitUserAnswer(options)).then(
                (responseData) => {
                    debugger;
                    if (responseData.data && questionList.length !== index) {
                        debugger;
                        newList[index]['index'] = index + 1;
                        handleOptionsByQuestion(newList[index]);
                    }
                }).catch(e => {
                SetMessageToast({open: true, title: e.message});
            });
        }
    }

    const handleOptionsByQuestion = (newValue) => {
        const eId = props.match.params.eId;
        trackPromise(QuestionDb.getOptionByQuestion(newValue['questionId'], eId)).then((responseData) => {
            if (responseData.data) {
                newValue['options'] = responseData.data;
                newValue['title'] = newValue.question;
                setMessageComponent(false);
                setQuestionItem(newValue);
            } else {
                setMessageComponent(true);
            }
        }).catch((e) => {
            SetMessageToast({open: true, title: e.message});
        });
    }


    const handleCheckChange = (i) => {
        let abc = {...questionItem};
        abc.options[i].isCorrect = !abc.options[i].isCorrect;
        if (questionItem.type === 0) {
            abc.options.map((item, j) => {
                if (i !== j) {
                    item.isCorrect = false
                }
                return item.isCorrect;
            })
        }
        setQuestionItem(abc);
    }

    const handleFinishExam = () => {
        const eId = props.match.params.eId;
        trackPromise(UserExamDb.updateUserExamStatus(eId)).then(responseData => {
            if (responseData.data) {
                history.push({
                    pathname: '/student_exams'
                });
            }
        }).catch(e => {
            SetMessageToast({open: true, title: e.message});
        });
    }

    const tableItems = (!!questionItem && !!questionItem.options) ? questionItem.options.map(
        (item, i) => {
            return <TableRow key={i}>
                <TableCell padding="checkbox" style={{marginBottom: '1px solid transparent'}}>
                    <Checkbox
                        className={questionItem.type === 0 ? 'checkBoxX' : ''}
                        checked={item.isCorrect} onChange={() => handleCheckChange(i)}/>
                </TableCell>
                <TableCell align="left">
                    <QuillEditor readOnly={true} id={`optionId${i}`} value={item.title}/>
                </TableCell>
            </TableRow>
        }
    ) : null;

    const individualItem = !!questionItem.title ? <Container>
        {/*{timerComponents.length ? timerComponents : <span>Time's up!</span>}*/}
        <Paper>
            <div>
                <Label
                    className={classes.question}>{`${questionItem.index}. ${questionItem.title}`}</Label>
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size='small'
                        aria-label="enhanced table">
                        <TableBody>
                            {tableItems}
                        </TableBody>
                    </Table>
                </TableContainer>
                <AppBar position="static" className={classes.bar}>
                    <Toolbar>
                        <Button color="inherit" edge="start" endIcon={<DoneAll/>} onClick={handleFinishExam}
                                className={classes.menuButton}>Finish</Button>
                        <Typography variant="h6" className={classes.title}/>
                        {/* {(questionItem.index > 1) ?
                                                <Button startIcon={<SkipPrevious/>} color="inherit"
                                                        onClick={(i) => {
                                                            handlePrevious(questionItem.index)
                                                        }}>Previous</Button> : null}*/}
                        {(questionList.length !== questionItem.index) ?
                            <Button endIcon={<SkipNext/>} color="inherit"
                                    onClick={(i) => {
                                        handleNext(questionItem.index)
                                    }}>Submit & Next</Button> : null}
                        {(questionList.length === questionItem.index) ?
                            <Button endIcon={<DoneOutline/>} color="inherit"
                                    onClick={(i) => {
                                        handleNext(questionItem.index);
                                        handleFinishExam();
                                    }}>Submit</Button> : null}
                    </Toolbar>
                </AppBar>
            </div>
        </Paper>
    </Container> : null
    return (
        <div className={classes.root}>
            <MessageToast open={messageToast.open} message={messageToast.title}/>

            <nav className={classes.drawer} aria-label="mailbox folders">
                <Hidden xsDown implementation="css">
                    <Drawer
                        container={container}
                        variant="permanent"
                        anchor={'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true,
                        }}>
                        <Banner/>
                        <QuestionList questionList={questionList} handleQuestionsByExam={handleQuestionsByExam}/>
                    </Drawer>
                </Hidden>
                {!messageComponent
                    ? <main className={classes.content}>{individualItem} </main>
                    : <main className={classes.content}>
                        <div className={classes.rootDummy}>
                            <Paper elevation={3} style={{textAlign: 'center'}}>
                                <Label>You cannot answer this question anymore</Label>
                                <DefaultButton text={'Finish Exam'} onClick={handleFinishExam}/>
                            </Paper>
                        </div>
                    </main>}
            </nav>
        </div>
    )
};


export default Questions;

