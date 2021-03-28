import FormOnSell from "./formOnSell";
import FormReturn from "./formReturn";
import FormBuy from "./formBuy";

const React = require('react');
const $ = require('jquery');
const io = require('socket.io-client');
const Component = React.Component;

const connect = require('react-redux').connect
const actions = require('../../redux/actionscreators')

class StockRow extends Component {
    constructor(props) {
        super(props);

        this.onSellClick = this.onSellClick.bind(this);
        this.onCountChange = this.onCountChange.bind(this);
        this.onNotsellClick = this.onNotsellClick.bind(this);
        this.onBuyClick = this.onBuyClick.bind(this);

        this.state = {
            count: 1
        }
    }

    onSellClick(value) {
        this.setState({count : value});
        this.props.onSell(this.props.id, value);
    }

    onNotsellClick(value ) {
        this.setState({count : value});
        this.props.onNotsell(this.props.id, value);
    }

    onBuyClick(value) {
        this.setState({count : value});
        this.props.onBuy(this.props.id, value, this.props.owner_id)
    }

    onCountChange(e) {
        this.setState({count : parseInt(e.target.value)});
    }

    render() {
        switch (this.props.type) {
            case 'own':
                return <tr>
                    <td>{this.props.name}</td>
                    <td>{this.props.price}</td>
                    <td>{this.props.count}</td>
                    {/*<td>{this.props.price * this.props.count}</td>*/}
                    <td>
                        <FormOnSell onSellClick={this.onSellClick} max={this.props.count}></FormOnSell>
                    </td>
                    <td></td>
                </tr>
            case 'sell':
                return <tr>
                    <td>{this.props.name}</td>
                    <td>{this.props.price}</td>
                    <td>{this.props.count}</td>
                    {/*<td>{this.props.price * this.props.count}</td>*/}
                    <td>
                        <FormReturn onNotsellClick={this.onNotsellClick} max={this.props.count}></FormReturn>
                    </td>
                    <td></td>
                </tr>
            case 'buy':
                return <tr>
                    <td>{this.props.name}</td>
                    <td>{this.props.price}</td>
                    <td>{this.props.count}</td>
                    {/*<td>{this.props.price * this.props.count}</td>*/}
                    <td>Продает: {this.props.owner_name ? this.props.owner_name : this.props.name}</td>
                    <td>
                        <FormBuy onBuyClick={this.onBuyClick} max={this.props.count}></FormBuy>
                    </td></tr>
        }
    }
}

class StocksTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.stocks != null && this.props.stocks.length > 0) {
            return <div>
                <div className="tbl-header">
                    <table>
                        <thead>
                        <tr>
                            <th scope={'col'}>Название</th>
                            <th scope={'col'}>Цена, $</th>
                            <th scope={'col'}>Объем, шт.</th>
                            {/*<th scope={'col'}>Стоимость, $</th>*/}
                            <th scope={'col'}></th>
                            <th scope={'col'}></th>
                        </tr>
                        </thead>
                    </table>
                </div>

                <div className="tbl-content">
                    <table>
                        <tbody>
                        {
                            this.props.stocks.map((stock) => {
                                return <StockRow price={this.props.allstocks[stock.id].startingPrice} name={stock.name} count={stock.count} type={this.props.type} key={stock.owner_id + '.' + stock.id} id={stock.id} onSell={this.props.onSell} onNotsell={this.props.onNotsell} onBuy={this.props.onBuy} owner_id={stock.owner_id} owner_name={stock.owner_name}/>
                            })
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        } else {
            return <h6>Ничего</h6>;
        }
    }
}

class StocksForBuying extends Component {
    constructor(props) {
        super(props);
    }

    getStocks() {
        let stocks = [];

        if (this.props.stocks) {
            stocks = this.props.stocks.filter((stock) => stock.count > 0);

            for (let user of this.props.users) {
                if (user.id !== this.props.user.id) {
                    for (let stock of user.selling_stocks) {
                        if (stock.count > 0) {
                            stock.name = this.props.stocks[stock.id].name;
                            stock.owner_id = user.id;
                            stock.owner_name = user.name;
                            stocks.push(stock);
                        }
                    }
                }
            }
        }
        return stocks;
    }

    render() {
        return <div className={'miniTable'} hidden={!this.props.settings || this.props.settings.state !== 'in'}>
            <h6 className={'text-center'}>Доступные для покупки акции:</h6>
            <StocksTable type={'buy'} stocks={this.getStocks()} onBuy={this.props.onBuy} allstocks={this.props.stocks}/>
        </div>
    }
}

class OwnstocksOnSale extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className={'miniTable'}>
            <h6>Вы продаете:</h6>
            <StocksTable type={'sell'} stocks={this.props.user && this.props.stocks ? this.props.user.selling_stocks.filter((stock) => stock.count > 0).map((stock) => {
                stock.name = this.props.stocks[stock.id].name;
                return stock;
            }): null} onNotsell={this.props.onNotsell} allstocks={this.props.stocks}/>
        </div>
    }
}

class Ownstocks extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className={'miniTable'}>
            <h6>Портфель:</h6>
            <StocksTable type='own' stocks={this.props.user && this.props.stocks ? this.props.user.stocks.filter((stock) => stock.count > 0).map((stock) => {
                stock.name = this.props.stocks[stock.id].name;
                return stock;
            }): null} onSell={this.props.onSell} allstocks={this.props.stocks}/>
        </div>
    }
}

class BalanceSpan extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <div>
            <div className={'my-cont'}>
                <h6>Участник {this.props.user ? this.props.user.name : ''}; </h6>
                &times;
                <h6><span>Баланс: {this.props.user ? this.props.user.balance : 0}; </span></h6>
                &times;
                <h6>Профит: {this.props.user ? this.props.user.earn - this.props.user.waste : 0}.</h6>
                &times;
                {/*<div><h6>Участник {this.props.user ? this.props.user.name : ''}</h6></div>*/}
                {/*<div><h6><span>Баланс: {this.props.user ? this.props.user.balance : 0}</span></h6></div>*/}
                {/*/!*<div><h6>Потрачено: {this.props.user ? this.props.user.waste : 0}</h6></div>*!/*/}
                {/*/!*<div><h6>Заработано: {this.props.user ? this.props.user.earn : 0}</h6></div>*!/*/}
                {/*<div><h6>Профит: {this.props.user ? this.props.user.earn - this.props.user.waste : 0}</h6></div>*/}
                <h6>Цена меняется каждые {this.props.settings ? this.props.settings.interval : 0} секунд</h6>
            </div>
        </div>
    }
}

class User extends Component{
    constructor(props) {
        super(props);
        this.onSell = this.onSell.bind(this);
        this.onNotsell = this.onNotsell.bind(this);
        this.onBuy = this.onBuy.bind(this);

        this.state = {
            user_id: null,
            socket: null
        }
    }

    componentDidMount() {
        const spl = window.location.href.split('/');
        const id = parseInt(spl[spl.length - 1]);

        $.get('http://localhost:3006/db/all', (data) => {

            this.setState({user_id: id});

            this.props.initState({
                users: data.state.brokers,
                stocks: data.state.stocks,
                settings: data.state.settings
            })
        })

        let socket = io.connect('http://localhost:3030');
        this.setState({socket: socket});

        socket.on('start', () => {
            this.props.start();
            this.setState({user_id: this.state.user_id});
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
    }

    onSell(stock_id, count) {
        let sellInfo = {
            seller_id: this.state.user_id,
            stock_id: stock_id,
            count: count
        }
        this.state.socket.json.emit('sell', {sellInfo: sellInfo});
    }

    onNotsell(stock_id, count) {
        let notsellInfo = {
            seller_id: this.state.user_id,
            stock_id: stock_id,
            count: count
        }

        this.state.socket.json.emit('notsell', {notsellInfo: notsellInfo});
    }

    onBuy(stock_id, count, owner_id) {
        let transaction = {
            buyer_id: this.state.user_id,
            seller_id: owner_id !== undefined ? owner_id : -1,
            stock_id: stock_id,
            count: count,
            price: this.props.stocks[stock_id].startingPrice
        };

        this.state.socket.json.emit('buy', {transaction: transaction});
    }

    render() {
        return <div>
            <h1>Покупка акций</h1>
            <div className={'cont-for-tables'}>
                <div className={'my-cont'}>
                    <BalanceSpan settings={this.props.settings} user={this.props.users ? this.props.users[this.state.user_id] : null}/>
                </div>
                <div className={'my-cont'}>
                    <Ownstocks settings={this.props.settings} stocks={this.props.stocks} user={this.props.users ? this.props.users[this.state.user_id] : null} onSell={this.onSell}/>
                    <StocksForBuying settings={this.props.settings} users={this.props.users} stocks={this.props.stocks} user={this.props.users ? this.props.users[this.state.user_id] : null} onBuy={this.onBuy}/>
                </div>
                <OwnstocksOnSale settings={this.props.settings} stocks={this.props.stocks} user={this.props.users ? this.props.users[this.state.user_id] : null} onNotsell={this.onNotsell}/>
            </div>
        </div>;
    }
}

function mapStateToProps(state) {
    return {
        users: state.get('users'),
        stocks: state.get('stocks'),
        settings: state.get('settings')
    }
}

// module.exports = connect(mapStateToProps, actions)(User)
export default connect(
    mapStateToProps,
    actions
)(User)