import React, {Component} from "react";
import $ from 'jquery'

export class Auth extends Component{
    state = {
        users: [],
        selectedUser: 'admin'
    }

    constructor(props) {
        super(props);
        this.enter = this.enter.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    enter() {
        let userId = -1;
        let userIn = false;
        for (let i = 0; i < this.state.users.length; i++) {
            if (this.state.selectedUser === this.state.users[i].login) {
                userIn = true;
                userId = i;
                break;
            }
        }

        if (this.state.selectedUser === 'admin') {
            window.location.href = '/admin'
        }
        else if (!userIn) {
            alert('Логин введен неправильно!')
        }
        else {
            window.location.href = `user/${userId}`
        }
    }

    handleChange(event) {
        this.setState({selectedUser: event.target.value});
    }

    componentDidMount() {
        $.get('http://localhost:3006/db/brokers', (data) => {
            this.setState({users: data.brokers})
        })
    }

    render() {
        return <div>
            <h1>Биржа акций</h1>
            <div className={"my-cont"}>
                <form>
                    <label>
                        Логин:
                        <input type="text" value={this.state.selectedUser} onChange={this.handleChange} />
                    </label>
                    <button type={"button"} onClick={this.enter}>Войти</button>
                </form>
            </div>
        </div>;
    }
}

