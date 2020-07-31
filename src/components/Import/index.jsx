import React, { Component } from 'react';
import {
  Upload,
  message,
  Button,
  Icon,
  Modal,
} from 'antd';

class ImportModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: []
    };
  }

  onChange = (info) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    // console.log(info);
    if (info.file.status !== 'uploading') {
      // console.log(info.file, info.fileList);
    }

    if (info.file.status === 'done') {
      const { file: { response } } = info;

      if (response.code !== 0) {
        message.error(response.message);
      } else {
        message.success(`${info.file.name} 上传成功`);
      }

    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }

    this.setState({ fileList });
  }

  onRemove = _ => {
    
  }

  render() {
    return (
      <Modal
        title="导入"
        visible={this.props.visible}
        onOk={this.props.toggleImportModal}
        okText="完成"
        onCancel={this.props.toggleImportModal}
      >
        <div style={{ marginBottom: '10px', display: 'flex', height: '30px' }}>
          <p style={{lineHeight: '30px'}}>请按照数据样例的格式进行数据导入</p>
          <Button
            style={{ marginLeft: '10px' }}
            icon="cloud-download"
            href={this.props.href}
          >数据样例模板下载</Button>
        </div>
        <Upload
          name="file"
          action={`${this.props.api}?token=${localStorage.getItem('token')}`}
          onChange={this.onChange}
          accept=".xlsx,.xls"
          fileList={this.state.fileList}
          onRemove={this.onRemove}  
        >
          <Button>
            <Icon type="upload" /> 点击上传
          </Button>
        </Upload>
        {/* { 
            this.props.location ? 
              <Button 
                style={{marginLeft: '10px'}} 
                icon="environment" 
                target="blank" 
                href="https://lbs.qq.com/tool/getpoint/">路线起终点经纬度查询</Button>: null
          } */}
      </Modal>
    )
  }
}
export default ImportModal