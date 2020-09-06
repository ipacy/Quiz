import React from 'react';
import {
    Avatar,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import Aux from "../../../../hoc/_Aux/_Aux";


const QuestionList = React.memo(props => {

    return (
        <Aux>
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
                                       {i+1}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={value.question}
                                    secondary={null}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="delete" onClick={() => {
                                        props.handleDelete(value.questionId)
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
