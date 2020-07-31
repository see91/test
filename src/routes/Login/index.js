import React, { Fragment } from 'react'
// import BGParticle from '../../utils/BGParticle'
import './style.css'
import 'animate.css'
import LoginForm from './LoginForm';

// const url = 'https://github.com/zhangZhiHao1996/image-store/blob/master/react-admin-master/bg1.jpg?raw=true'




class Login extends React.Component {
  state = {
    showBox: 'login',   //展示当前表单
    url: '',  //背景图片
    // loading:false,
  }

  componentDidMount() {
    const isLogin = localStorage.getItem('token');
    if (isLogin) {
      this.props.history.go(1)     //当浏览器用后退按钮回到登录页时，判断登录页是否登录，是登录就重定向上个页面
    }
  }

  componentWillUnmount() {
    this.particle && this.particle.destory()
  }

  //切换showbox
  switchShowBox = (box) => {
    this.setState({
      showBox: box
    })
  }

  render() {
    const { showBox } = this.state
    return (
      <Fragment>
        <div id='login-page'>
          <div>
            <div id='backgroundBox' style={styles.backgroundBox}>
            </div>
            <h1 className="login-title">问题反馈管理系统</h1>
            <div className='container'>
              <LoginForm
                className={showBox === 'login' ? 'box showBox' : 'box hiddenBox'}
                switchShowBox={this.switchShowBox} />
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}

const styles = {
  backgroundBox: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    backgroundSize: '100% 100%',
    transition: 'all .5s'
  },
  focus: {
    // transform: 'scale(0.7)',
    width: '20px',
    opacity: 1
  },
  loadingBox: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)'
  },
  loadingTitle: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    marginLeft: -45,
    marginTop: -18,
    color: '#000',
    fontWeight: 500,
    fontSize: 24
  },
}

export default Login
