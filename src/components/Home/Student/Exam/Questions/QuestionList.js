import React from 'react';
import {IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Typography} from "@material-ui/core";
import PlayArrow from "@material-ui/icons/PlayArrow";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    typo: {
        marginRight: '1rem',
    }
}));

const QuestionList = React.memo(props => {
    const classes = useStyles();
    return (
        <List dense={true} component="nav">
            {
                (!!props.questionList && props.questionList.length > 0) ? props.questionList.map(
                    (value, i) =>
                        <ListItem button onClick={() => {
                            props.handleQuestionsByExam(value, i)
                        }}
                                  key={(!!value && !!value.questionId) ? value.questionId : i}>
                            <ListItemText>
                                <Typography className={classes.typo} variant='h6'> {`Question ${i + 1}`}</Typography>
                            </ListItemText>
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="delete" onClick={() => {
                                    props.handleQuestionsByExam(value, i)
                                }}>
                                    <PlayArrow/>
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>) : null
            }
        </List>
    )
});

export default QuestionList;
