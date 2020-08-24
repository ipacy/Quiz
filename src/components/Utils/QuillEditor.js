import React from "react";
import ReactQuill from 'react-quill';

/**
 * Component for QuillEditor
 *
 * @component
 */
const QuillEditor = React.memo(props => {
    const toolbarOptions = [['link', 'image'],
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{'header': 1}, {'header': 2}],               // custom button values
        [{'list': 'ordered'}, {'list': 'bullet'}],
        [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
        [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
        [{'direction': 'rtl'}],                         // text direction

        [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
        [{'header': [1, 2, 3, 4, 5, 6, false]}],

        [{'color': []}, {'background': []}],          // dropdown with defaults from theme
        [{'font': []}],
        [{'align': []}],

        ['clean']];

    const modules = !props.readOnly ? {
        toolbar: toolbarOptions
    } : {
        toolbar: false
    };

    return (
        <div className="text-editor">
            <ReactQuill
                onChange={props.onChange}
                id={props.id}
                theme="snow"
                value={props.value}
                readOnly={props.readOnly}
                modules={modules}>
            </ReactQuill>
        </div>
    );
});

export default QuillEditor;
