import React, { Component } from 'react';
import {
  Upload,
  message,
  Button,
  Icon,
  Modal,
} from 'antd';

class UploadModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      src: '',
      id: ''
    }
  }

  onChange = (info) => {
    if (info.file.status !== 'uploading') {
      // console.log(info.file);
    }
    if (info.file.status === 'done') {
      const { file:{response} } = info;
      if (response.code !== 0) {
        message.error(response.message);
      } else {
        this.setState({
          src: response.data[0].visitUrl
        });
        message.success(`${info.file.name} 上传成功`);
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      src: props.src,
      id: props.id
    })
  }

  onOk = async() => {
    const { src, id } = this.state;
    let res = await this.$http.post(this.props.api, {picture: src, id}, 'json');
    if (!res) {
      message.error('更新失败！');
      return;
    };
    this.props.toggleUploadModal();
    this.props.getList();
    message.success('更新成功！');
  }

  render() {
    return (
      <Modal
        title="上传图片"
        visible={this.props.visible}
        onOk={this.onOk}
        onCancel={this.props.toggleUploadModal}
      >
        <div style={{height: '200px', marginBottom: '10px'}}>
          <img src={this.state.src} alt="" style={{width: '100%', height: '100%'}} />
        </div>
        <Upload 
          name="files"
          action="/api/common/uploadFile"
          onChange={this.onChange}
          showUploadList={false}
          accept=".jpg,.png,.jpeg"
        >
          <Button>
            <Icon type="upload" /> 点击上传
          </Button>
        </Upload>
      </Modal>
    )
  }
}
export default UploadModal