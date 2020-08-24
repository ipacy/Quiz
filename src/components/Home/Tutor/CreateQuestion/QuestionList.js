import React, {useState} from 'react';
import {
    Avatar,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText
} from "@material-ui/core";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import DeleteIcon from "@material-ui/icons/Delete";
import QuestionDb from "../../../../DBManager/db/QuestionDb";
import MessageToast from "../../../Utils/MessageToast";
import Aux from "../../../../hoc/_Aux/_Aux";
import {trackPromise} from 'react-promise-tracker';

const QuestionList = React.memo(props => {
    const [messageToast, setMessageToast] = useState({open: false, title: ''});
    const handleDelete = (questionId) => {
        trackPromise(QuestionDb.deleteQuestion(questionId)).then(responseData => {
            setMessageToast({open: true, title: responseData.messages[0].text});
            props.onQuestionDelete();
        }).catch(e => {
            setMessageToast({open: true, title: e.message});
        });
    }

    return (
        <Aux>
            <MessageToast open={messageToast.open} message={messageToast.title}/>
            <List dense={true} component="nav">
                {
                    (!!props.questionList && props.questionList.length > 0) ? props.questionList.map(
                        (value, i) =>
                            <ListItem button onClick={() => {
                                props.handleQuestionsByExam(value.questionId)
                            }}
                                      key={(!!value && !!value.questionId) ? value.questionId : i}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <HelpOutlineIcon/>
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={value.question}
                                    secondary={null}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="delete" onClick={() => {
                                        handleDelete(value.questionId)
                                    }}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>) : null
                }
            </List>
        </Aux>
    )
});

export default QuestionList;
