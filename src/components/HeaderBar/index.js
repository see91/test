import React from 'react'
import { Icon, Dropdown, Menu, Modal } from 'antd'
import screenfull from 'screenfull'
import { withRouter } from 'react-router-dom'

//withRouter一定要写在前面，不然路由变化不会反映到props中去
class HeaderBar extends React.Component {
  state = {
    icon: 'arrows-alt',
    count: 100,
    visible: false,
    avatar: require('./img/04.jpg')
  }

  componentDidMount() {
    screenfull.onchange(() => {
      this.setState({
        icon: screenfull.isFullscreen ? 'shrink' : 'arrows-alt'
      })
    })
  }

  componentWillUnmount() {
    screenfull.off('change')
  }

  toggle = () => {
    this.props.onToggle()
  }
  screenfullToggle = () => {
    if (screenfull.enabled) {
      screenfull.toggle()
    }
  }
  logout = () => {
    localStorage.removeItem('token');
    this.props.history.push('/login');
  }

  render() {
    const { icon, visible, avatar } = this.state
    const { collapsed } = this.props
    const menu = (
      <Menu className='menu'>
        <Menu.Item><span onClick={this.logout}>退出登录</span></Menu.Item>
      </Menu>
    )
    const login = (
      <Dropdown overlay={menu}>
        <img onClick={() => this.setState({ visible: true })} src={avatar} alt="" />
      </Dropdown>
    )
    return (
      <div id='headerbar'>
        <Icon
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          className='trigger'
          onClick={this.toggle} />
        <div style={{ lineHeight: '64px', float: 'right' }}>
          <ul className='header-ul'>
            <li><Icon type={icon} onClick={this.screenfullToggle} /></li>
            <li>
              {login}
            </li>
          </ul>
        </div>
        <Modal
          footer={null} closable={false}
          visible={visible}
          wrapClassName="vertical-center-modal"
          onCancel={() => this.setState({ visible: false })}>
          <img src={avatar} alt="" width='100%' />
        </Modal>
      </div>
    )
  }
}

export default withRouter(HeaderBar);