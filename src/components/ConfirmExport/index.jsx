import React from 'react';
import { Modal } from 'antd';
import API from '../../utils/API';
import ReactDOM from 'react-dom';

let div = null;
class ConfirmExport extends React.Component {



    static open = ({
        title = "",
        content = "",
        onDownload,
        okDisabled = false,
        okText = "",
        onCancel = _ => {},
        AntdModalProps = {}
    }) => {
        if (div !== null) {
            document.body.removeChild(div);
        }
        div = document.createElement('div');
        document.body.appendChild(div);
        let ConfirmExportAlert = ReactDOM.render(<ConfirmExport />, div); //返回实例
        ConfirmExportAlert.setState({
            title,
            content,
            visible: true,
            onDownload,
            okDisabled,
            okText,
            onCancel,
            AntdModalProps
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            title: "",
            content: "",
            visible: false,
            okText: "导出",
            okDisabled: false,
            onDownload: _ => { },
            AntdModalProps: {},
            onCancel: _ => {}
        }
    }

    _onOK = _ => {
        const { onDownload } = this.state;
        onDownload && onDownload(API.downloadFile);
        this.setState({ visible: false });
    }
    _onCancel = _ => {
        const { onCancel } = this.state;
        onCancel && onCancel();
        this.setState({ visible: false });
    }
    render() {
        const { title = "", content = "", visible, okText, okDisabled, AntdModalProps } = this.state;
        return (
            <Modal
                title={title}
                visible={visible}
                onOk={this._onOK}
                okText={okText}
                okButtonProps={{ disabled: okDisabled }}
                onCancel={this._onCancel}
                {...AntdModalProps}
            >

                {typeof (content) === 'function' ? content() : content}
            </Modal>
        )
    }
}



export default ConfirmExport;