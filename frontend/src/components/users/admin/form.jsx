import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { navigate } from '@reach/router'

// third-party-packages
import * as R from 'ramda'
import 'simplebar/dist/simplebar.min.css'
// helpers
import {
  editForm,
  makeForm,
  adminGetForm,
} from '../../../helper/functions/requestHandler'
import { REMOVE } from '../../../helper/functions/constants'
// component
import Form from '../../../helper/components/form'
import WithAppBar from '../../../helper/components/appBar/withAppBar'
import SnackBar from '../../../helper/components/snackBar'

class AdminForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // form initial data
      questionCount: props.initialQuestionCount,
      questions: [],
      formId: props.formId,
      formName: props.formName,

      solution: props.initialSolution,
      // file
      selectedFile: null,
      // user experience
      isSnackBarOpen: false,
      // snack bar
      message: '',
    }

    this.sendClicked = false
    this.send = this.send.bind(this)
    this.changeAnswer = this.changeAnswer.bind(this)
    this.snackBarHandler = this.snackBarHandler.bind(this)
    this.handleSelectedFile = this.handleSelectedFile.bind(this)
  }

  componentDidMount() {
    const { questionCount } = this.state
    const { editMode, formId } = this.props
    if (editMode) {
      adminGetForm(formId)
        .then(({ name, answers, fileName }) =>
          this.setState({
            questions: answers,
            formName: name,
            solution: fileName,
            questionCount: answers.length,
          }),
        )
        .catch(() => navigate('/'))
    } else {
      this.setState({
        questions: R.map(R.always(null), R.range(0, questionCount)),
      })
    }
  }

  changeAnswer(index) {
    return newValue => type => () => {
      const answer = type === REMOVE ? null : newValue
      this.setState(({ questions }) => ({
        questions: R.update(index, answer, questions),
      }))
    }
  }

  send() {
    const { formName, formId, questions, selectedFile } = this.state
    const { editMode, setNewPageId, addNewForm } = this.props

    if (R.any(R.isNil, questions)) {
      this.snackBarHandler(true)
      return
    }
    if (!this.sendClicked) {
      this.sendClicked = true
      if (editMode) {
        const formData = new FormData()
        formData.append('formId', formId)
        formData.append('name', formName)
        formData.append('answers', JSON.stringify(questions))
        formData.append('pdf', selectedFile)
        editForm(formData)
          .then(() => navigate('/adminPage/forms'))
          .catch(() => navigate('/'))
      } else {
        const formData = new FormData()
        formData.append('name', formName)
        formData.append('answers', JSON.stringify(questions))
        formData.append('pdf', selectedFile)
        makeForm(formData)
          .then(({ name, _id }) => {
            setNewPageId(_id)
            addNewForm({ name, _id })
            navigate(`/adminPage/linkPreview`)
          })
          .catch(() => navigate('/'))
      }
    }
  }

  // File
  handleSelectedFile(event) {
    this.setState({
      selectedFile: event.target.files[0],
      message: ` با موفقیت بارگذاری شد ${event.target.files[0].name}`,
    })
  }

  // snackBar
  snackBarHandler(open = false) {
    if (open) this.setState({ isSnackBarOpen: open })
    else this.setState({ isSnackBarOpen: open })
  }

  // render
  render() {
    const { formName, questions, isSnackBarOpen, message } = this.state
    return (
      <Fragment>
        <WithAppBar
          leftText="بازگشت"
          onLeftClick={() => navigate('/adminPage/forms')}
        >
          <Form
            formName={formName}
            questions={questions}
            openSnackBar={isSnackBarOpen}
            sendForm={this.send}
            snackBarHandler={this.snackBarHandler}
            changeAnswer={this.changeAnswer}
            onFileUpload={this.handleSelectedFile}
          />
        </WithAppBar>
        <SnackBar
          open={!!message}
          variant="success"
          message={message}
          autoHideDuration={50000}
          onClose={() => this.setState({ message: '' })}
        />
      </Fragment>
    )
  }
}
AdminForm.propTypes = {
  initialQuestionCount: PropTypes.number,
  formId: PropTypes.string,
  formName: PropTypes.string,
  initialSolution: PropTypes.string,
  editMode: PropTypes.bool,
  setNewPageId: PropTypes.func,
  addNewForm: PropTypes.func,
}

AdminForm.defaultProps = {
  initialQuestionCount: 0,
  formId: '',
  formName: '',
  initialSolution: '',
  editMode: false,
  setNewPageId: Function.prototype,
  addNewForm: Function.prototype,
}

export default AdminForm
