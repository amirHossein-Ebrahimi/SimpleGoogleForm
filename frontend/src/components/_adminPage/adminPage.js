import React, { Component } from 'react'
import { Router, navigate } from '@reach/router'
import * as R from 'ramda'
// Components
import AdminPage from '../forms/list/list'
import AdminFillForm from '../users/admin/form'
import AdminCreateForm from '../users/admin/formInfo'
import LinkPreview from '../../helper/components/linkPreview'
import ChangePassword from '../auth/changePassword'
// helper
import { getForms } from '../../helper/functions/requestHandler'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      newFormInfo: null,
      newPageId: null,
      forms: [],
    }

    this.onChange = this.onChange.bind(this)
    this.removeForm = this.removeForm.bind(this)
    this.addNewForm = this.addNewForm.bind(this)
  }

  componentWillMount() {
    getForms()
      .then(forms => this.setState({ forms }))
      .catch(() => navigate('/'))
  }
  onChange = (key, value) => this.setState({ [key]: value })

  removeForm = formId =>
    this.setState(({ forms }) => ({
      forms: R.filter(item => item._id !== formId, forms),
    }))

  addNewForm = formData =>
    this.setState(({ forms }) => ({
      forms: R.append(formData, forms),
    }))

  render() {
    const { isAdminLoggedIn, location } = this.props
    const { newFormInfo, newPageId, forms } = this.state
    return (
      <Router>
        <AdminPage
          path="forms"
          forms={forms}
          isAdminLoggedIn={isAdminLoggedIn}
          selectForm={this.onChange}
          removeForm={this.removeForm}
        />
        <LinkPreview
          path="linkPreview"
          link={`${location.origin}/forms/${newPageId}`}
        />
        <AdminCreateForm
          path="createFormInfo"
          setNewFormInfo={value => this.onChange('newFormInfo', value)}
        />
        <AdminFillForm
          path="createNewForm"
          {...newFormInfo}
          setNewPageId={value => this.onChange('newPageId', value)}
          addNewForm={this.addNewForm}
        />
        <ChangePassword path="changePassword" />
        <AdminFillForm path=":formId" editMode />
      </Router>
    )
  }
}

export default App
