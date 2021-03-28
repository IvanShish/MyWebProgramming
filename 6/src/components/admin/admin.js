import FormDialog from "./formDialog";

const React = require('react');
const $ = require('jquery');
const io = require('socket.io-client');
const connect = require('react-redux').connect
const actions = require('../../redux/actionscreators')

class UserRow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <tr>
            <td>{this.props.user.name}</td>
            <td>{this.props.user.login}</td>
            <td>{this.props.user.balance}</td>
            <td>{this.props.user.stocks.filter((stock) => stock.count > 0).map((stock) =>
                <div key={'' + stock.id + this.props.name + 'n'}>{this.props.stocks[stock.id].name} ({stock.count} шт.)</div>
            )}</td>
            <td>{this.props.user.selling_stocks.filter((stock) => stock.count > 0).map((stock) =>
                <div key={'' + stock.id + this.props.name + 't'}>{this.props.stocks[stock.id].name} ({stock.count} шт.)</div>
            )}</td>
        </tr>
    }
}

class UsersTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="tbl-header">
                    <table cellPadding="0" cellSpacing="0" border="0">
                        <thead>
                        <tr>
                            <th>Участник</th>
                            <th>Логин</th>
                            <th>Баланс</th>
                            <th>Купленные акции (количество)</th>
                            <th>Акции на торгах</th>
                        </tr>
                        </thead>
                    </table>
                </div>

                <div className="tbl-content">
                    <table cellPadding="0" cellSpacing="0" border="0">
                        <tbody>
                        {this.props.users ? this.props.users.map((user) => <UserRow key={user.id} user={user} stocks={this.props.stocks}/>) : <tr></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

class Admin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            forNew: 1,
            socket: null,
            change: 0,
        }

        this.onBeginClick = this.onBeginClick.bind(this);
        this.onEndClick = this.onEndClick.bind(this);
        this.onSetChangeClick = this.onSetChangeClick.bind(this);
    }

    onSetChangeClick() {
        this.state.socket.json.emit('setChange', {type: this.state.change});
        if (this.state.change === 0)  this.setState({change: 1})
        else this.setState({change: 0})
    }

    onBeginClick() {
        this.state.socket.emit('start', this.props.settings.interval, this.props.settings.datetimeEnd);

        this.props.start();
        this.setState({forNew: 1});
    }

    onEndClick() {
        this.state.socket.emit('end');

        console.log(this.props);
        this.props.end();
        this.setState({forNew: 1});
    }

    componentDidMount() {
        $.get('http://localhost:3006/db/all', (data) => {
            this.props.initState({
                users: data.state.brokers,
                settings: data.state.settings,
                stocks: data.state.stocks
            })
        })

        const socket = io.connect('http://localhost:3030');


        socket.on('start', () => {
            this.props.start();
            this.setState({forNew: 1});
        });

        socket.on('end', () => {
            this.props.end();
            this.setState({forNew: 1});
        });

        socket.on('change', (data) => {
            this.props.changePrice(data.stocks);
            this.setState({forNew: 1});
        });

        socket.on('sell', (data) => {
            this.props.sellStock(data.sellInfo);
            this.setState({user_id: this.state.user_id});
        });

        socket.on('buy', (data) => {
            this.props.buyStock(data.transaction);
            this.setState({user_id: this.state.user_id});
        })

        socket.on('notsell', (data) => {
            this.props.cancelSell(data.notsellInfo);
            this.setState({user_id: this.state.user_id});
        })

        this.setState({socket: socket})
    }

    render() {
        let changeText = '';
        return <div>
            <h1>Администрирование биржи</h1>
            <div className={'my-cont'}>
                <UsersTable {...this.props}/>
            </div>
            <div className={'admin-buttons'}>
                <p>Текущий закон распределения: {this.state.change === 0 ? changeText="равномерный" : changeText="нормальный "}</p>
                <button style={{width: '20%'}} onClick={this.onSetChangeClick}>Установить другой закон</button>
                <FormDialog settings={this.props.settings} onBeginClick={this.onBeginClick}></FormDialog>
                {/*<button type={'button'} style={{width: '20%'}} disabled={!this.props.settings || (this.props.settings.state !== 'before' && this.props.settings.state !== 'after')} onClick={this.onBeginClick}>Начало торгов</button>*/}
                <button type={'button'} style={{width: '20%'}} disabled={!this.props.settings || this.props.settings.state !== 'in'} onClick={this.onEndClick}>Конец торгов</button>
            </div>
            <div className={'my-cont'}>
                <h4 hidden={!this.props.settings || this.props.settings.state !== 'after'}>Торги окончены</h4>
                <h4 hidden={!this.props.settings || this.props.settings.state !== 'before'}>Начало торгов через: {this.props.settings ? new Date(this.props.settings.datetimeStart).toLocaleDateString() + ' ' + new Date(this.props.settings.datetimeStart).toLocaleTimeString() : ''}</h4>
                <h4 hidden={!this.props.settings || this.props.settings.state !== 'in'}>Завершение торгов {this.props.settings ? new Date(this.props.settings.datetimeEnd).toLocaleDateString() + ' ' + new Date(this.props.settings.datetimeEnd).toLocaleTimeString() : ''}</h4>
            </div>
        </div>;
    }
}

function mapStateToProps(state) {
    return {
        users: state.get('users'),
        settings: state.get('settings'),
        stocks: state.get('stocks')
    }
}

// module.exports = connect(mapStateToProps, actions)(Admin)
export default connect(
    mapStateToProps,
    actions
)(Admin)