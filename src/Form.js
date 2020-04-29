import React, { Component } from 'react'

class Form extends Component {
    initialState = {
        userName: '',
        userJob: '',
    }

    state = this.initialState

    handleChange = (event) => {
        const { name, value } = event.target

        // Events come with target.name and target.value.
        // Pull out the "target.name" property and the target.value
        // property and use them to set either userName or user Job.
        this.setState({
            [name]: value,
        })
    }

    submitForm = () => {
        // Call the handleSubmit method in App to append the new data.
        this.props.handleSubmit(this.state)

        // Clear this form.
        this.setState(this.initialState)
    }

    render() {
        return (
            <form>
                <label htmlFor="userName">Name</label>
                <input
                    type="text"
                    name="userName"
                    id="userName"
                    value={this.state.userName}
                    onChange={this.handleChange} />
                <label htmlFor="userJob">Job</label>
                <input
                    type="text"
                    name="userJob"
                    id="userJob"
                    value={this.state.userJob}
                    onChange={this.handleChange} />
                <input
                    type="button"
                    value="Submit"
                    onClick={this.submitForm} />
            </form>
        );
    }
}

export default Form;

