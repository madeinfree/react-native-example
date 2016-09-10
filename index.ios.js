require('es6-promise').polyfill();
require('isomorphic-fetch');

import React, { Component } from 'react'

import {
  AppRegistry,
  StyleSheet,
  ScrollView,
  View,
  RefreshControl,
  Text,
  TextInput,
  Image,
  Picker,
  ProgressViewIOS,
  SegmentedControlIOS,
  Slider,
  Switch,
  NavigatorIOS,
  TouchableHighlight,
  NetInfo
} from 'react-native'

import TimerMixin from 'react-timer-mixin'
import reactMixin from 'react-mixin'

class meepshop_native_store extends Component {

  constructor(props) {
    super(props)

    this.state = {
      text: 'Sample Text',
      lang: 'bar',
      progress: 0.5,
      refreshing: false,
      selectedIndex: 0,
      selectedValue: 'google',
      sliderValue: 0,
      switchValue: false,
      products: [
        { id: 1, name: 'AEROSOLES 休閒歐風真皮幾何鏤空雕花便鞋~典雅白色', price: 20, image: 'https://facebook.github.io/react/img/logo_og.png' },
        { id: 2, name: 'AEROSOLES 質感文青風原色軟木塞底休閒鞋~沁涼藍色', price: 150, image: 'https://facebook.github.io/react/img/logo_og.png' },
        { id: 3, name: 'AEROSOLES 休閒歐風真皮幾何鏤空雕花便鞋~氣質藍灰', price: 200, image: 'https://facebook.github.io/react/img/logo_og.png' }
      ],
      token: '',
      userlist: [],
      menulist: []
    }
  }

  async componentWillMount() {
    await fetch('localhost:15522', {
      method: 'POST',
      body: JSON.stringify({ email: 'test', password: 'test' }),
      headers: {
        'content-type': 'application/json'
      }
    }).then((r) => r.json().then((result) => this.setState({ token: result.token })), (err) => console.log(err))
    await fetch('localhost:15522', {
      method: 'POST',
      body:
      JSON.stringify({
        query: `query {
          userList {
            data {
              email,
              name
            }
          }
        }`
      }),
      headers:{
        'content-type': 'application/json'
      },
      credentials: 'include'
    }).then((r) => r.json().then((result) => this.setState({
      userlist: result.data,
      menulist: result.data
    })), (err) => console.log(err))
  }

  componentDidMount() {
    this.updateProgress()
  }

  updateProgress() {
    if (this.state.progress >= 1) {
      this.setState({ progress: 0 })
    }
    const progress = this.state.progress + Math.random() * 0.01
    this.setState({ progress })
    this.requestAnimationFrame(() => this.updateProgress())
  }

  _onRefresh() {
    this.setState({ refreshing: true });
    this.setTimeout(() => {
      this.setState({
        refreshing: false,
        products: this.state.products.concat({
          id: 4, name: 'AEROSOLES 休閒歐風真皮幾何鏤空雕花便鞋~氣質藍灰', price: 200, image: 'https://facebook.github.io/react/img/logo_og.png'
        })
      });
    }, 2000)
  }

  _onSelected(ev) {
    this.setState({
      selectedIndex: ev.nativeEvent.selectedSegmentIndex
    })
  }

  _onChangedValue(value) {
    this.setState({
      selectedValue: value
    })
  }

  _onSliderValue(value) {
    this.setState({
      sliderValue: value
    })
  }

  _onSwitchValue(value) {
    this.setState({
      switchValue: value
    })
  }

  render() {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={ this.state.refreshing }
            onRefresh={ this._onRefresh.bind(this) }
            title={ `loading for 2 second...` }
            titleColor='#f00'
            progressBackgroundColor='#0f0'/>
        }
        style={ styles.container }>

        <Text>Navigator-Shop-Menu</Text>
        {
          this.state.menulist.length > 0 ? (
            <NavigatorIOS
              initialRoute={{
                component: MyMenuPage,
                title: 'My Menu List Page',
                passProps: {
                  menulist: this.state.menulist
                }
              }}
              style={{ width: 300, height: 300 }} />
          ) : (
            <View style={{ height: 300 }}>
              <Text style={{ fontSize: 30 }}>
                API Data fetching ...
              </Text>
            </View>
          )
        }

        <Text>Navigator-Shop-User</Text>
        {
          this.state.userlist.length > 0 ? (
            <NavigatorIOS
              initialRoute={{
                component: MyPage,
                title: 'My User List Page',
                passProps: {
                  userlist: this.state.userlist,
                  products: this.state.products
                }
              }}
              style={{ width: 300, height: 300 }} />
          ) : (
            <View style={{ height: 300 }}>
              <Text style={{ fontSize: 30 }}>
                API Data fetching ...
              </Text>
            </View>
          )
        }

        <Text style={{ fontSize: 20 }}>文字{`<Text>`}</Text>
        <Text>{ this.state.text }</Text>

        <Text style={{ fontSize: 20 }}>文字輸入欄位{ `<TextInput>` }</Text>
        <TextInput
          value={ this.state.text }
          style={{
            height: 20,
            borderWidth: 1
          }}
          onChangeText={ (text) => this.setState({ text }) }
          multiline={true}/>

        <Text style={{ fontSize: 20 }}>圖片{ `<Image>` }</Text>
        <Image source={{ uri: 'https://facebook.github.io/react/img/logo_og.png' }} style={{ width: 100, height: 100 }} />

        <Text style={{ fontSize: 20 }}>選取{ `<Picker>` }: { this.state.lang }</Text>
        <Picker
          selectedValue={ this.state.lang }
          onValueChange={ (lang) => this.setState({ lang }) }>
          <Picker.Item label='Google' value='google' />
          <Picker.Item label='Facebook' value='facebook' />
          <Picker.Item label='Foo' value='foo' />
          <Picker.Item label='Bar' value='bar' />
          <Picker.Item label='FooBar' value='foo-bar' />
        </Picker>

        <Text style={{ fontSize: 20 }}>進度條{ `<ProgressViewIOS>` }: { parseInt(this.state.progress * 100, 10) }%</Text>
        <ProgressViewIOS
          progressTintColor='blue'
          progress={ this.state.progress }/>

        <Text style={{ fontSize: 20 }}>分段選項{ `<SegmentedControlIOS>` }: { this.state.selectedValue }</Text>
        <SegmentedControlIOS
          values={ ['google', 'facebook', 'twitter'] }
          selectedIndex={ this.state.selectedIndex }
          onChange={ this._onSelected.bind(this) }
          onValueChange={ this._onChangedValue.bind(this) }/>

        <Text style={{ fontSize: 20 }}>滾動拉軸{ `<Slider>` }Number: { parseInt(this.state.sliderValue * 100, 10) }</Text>
        <Slider
          onValueChange={ this._onSliderValue.bind(this) }/>

        <Text style={{ fontSize: 20 }}>開關{ `<Switch>` }: { this.state.switchValue ? 'true' : 'false' }</Text>
        <Switch
          value={ this.state.switchValue }
          onValueChange={ this._onSwitchValue.bind(this) }/>
      </ScrollView>
    )
  }
}

class MyMenuPage extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    _renderMenus = () => {
      return this.props.menulist.map((m, i) => {
        return m.pages.map((ml, ii) => {
          return <TouchableHighlight key={`myPage-${i}-${ii}`} onPress={ () => this.props.navigator.push({
              title: ml.title.zh_TW,
              component: (props) => (
                <ScrollView>
                  <Text>
                    { props.menu.title.zh_TW }
                  </Text>
                </ScrollView>
              ),
              passProps: { menu: ml }
            }) }>
            <View key={ `menu-${i}-${ii}` }>
              <Text style={{ color: '#fff' }}>
                { ml.title.zh_TW }
              </Text>
            </View>
          </TouchableHighlight>
        })
      })
    }
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#000' }}>
        { _renderMenus() }
      </ScrollView>
    );
  }
}

class MyPage extends Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    _renderProducts = () => {
      return this.props.products.map((product, index) => {
        return <TouchableHighlight key={`myPage-${index}`} onPress={ () => this.props.navigator.push({
            title: 'product',
            component: (props) => (
              <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
                <Text style={{ color: '#000' }}>商品編號: { props.product.id }</Text>
                <Text style={{ color: '#000' }}>商品名稱: { props.product.name }</Text>
                <Text style={{ color: '#000' }}>商品價格: { props.product.price }</Text>
                <Image source={{ uri: props.product.image }} style={{ width: 100, height: 100 }} />
              </ScrollView>
            ),
            passProps: { product }
          }) }>
          <View>
            <Text style={{ fontSize: 20, color: '#fff' }}>
              { `product-${product.id}` }
            </Text>
          </View>
        </TouchableHighlight>
      })
    }

    _renderUsers = () => {
      return this.props.userlist.map((user, index) => {
        if (user.name === null) return
        return (
          <TouchableHighlight key={ `myUser-${index}` } onPress={ () => this.props.navigator.push({
              title: `*user-${user.name}`,
              component: (props) => (
                <ScrollView style={{ flex: 1, backgroundColor: 'yellow' }}>
                  <Text style={{ color: '#000' }}>email: { props.user.email }</Text>
                  <Text style={{ color: '#000' }}>name: { props.user.name }</Text>
                </ScrollView>
              ),
              passProps: { user }
            }) }>
            <View>
              <Text style={{ fontSize: 20, color: '#fff' }}>
                { `meepshop-user-${ user.name }` }
              </Text>
            </View>
          </TouchableHighlight>
        )
      })
    }

    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#000' }}>
        { _renderUsers() }
        { _renderProducts() }
      </ScrollView>
    );
  }
}

reactMixin(meepshop_native_store.prototype, TimerMixin);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  image: {
    width: 20,
    height: 20
  }
})

AppRegistry.registerComponent('meepshop_native_store', () => meepshop_native_store)
