import React from 'react';
import { Button, Modal } from 'antd';
import PropTypes from 'prop-types';


/**
 * 本按钮适用于，当点击按钮需要执行一段逻辑，然后弹出一个对话框，经过用户的操作再执行一段逻辑的按钮
 */
class ConfirmButton extends React.PureComponent {

    static propTypes = {
        onClick: PropTypes.func,            // 点击以后会出现弹框，如果这中间有异步操作，那么根据具体时间而定
        title: PropTypes.string,
        Content: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element,
            PropTypes.func
        ]),
        onConfirm: PropTypes.func,      // 就是弹框出现以后，点击确认执行的操作
    }

    static defaultProps = {
        title: '',
        Content: ""
    }


    constructor(props) {
        super(props);
        const { title, Content } = props;
        this.state = {
            visible: false,
            title,
            Content
        }
    }

    componentWillReceiveProps(nextProps) {
        const { title, Content } = nextProps;
        if (title !== undefined) {
            this.setState({title});
        }
        if (Content !== undefined) {
            this.setState({Content});
        }
    }

    update = ({title, Content}) => {
        // 如果你是异步方法调用，然后更改标题和内容，可以通过这个函数
        if (title !== undefined) {
            this.setState({title});
        }
        if (Content !== undefined) {
            this.setState({Content});
        }
    }

    handleOk = _ => {
        const { onConfirm } = this.props;
        onConfirm && onConfirm();
        this.setState({visible: false});
    }
    handleCancel = _ => this.setState({ visible: false });
    showModal = async _ => {
        const { onClick } = this.props;
        onClick && await onClick(this.update);
        this.setState({ visible: true })
    };
    render() {
        const { Content, title } = this.props;
        const { visible } = this.state;
        return (<div>
            <Button type="primary" onClick={this.showModal}>
                {this.props.children}
            </Button>
            <Modal
                title={title}
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}>
                {
                    typeof (Content) === 'string' ?
                        Content
                        :
                        <Content />
                }
            </Modal>
        </div>);
    }
}


export default ConfirmButton;