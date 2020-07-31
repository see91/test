import React, { Component } from 'react';
import {
  Upload,
  message,
  Button,
  Icon,
  Modal,
  DatePicker,
  Checkbox,
  Alert,
  Typography
} from 'antd';
import moment from 'moment';

class CarImport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      binaryFile: null,
      okText: '确定',
      errList: [],
      confirmLoading: false,
      fileList: [],
      excludeWeek: ['6', '7'],
      startDate: moment().add(1, 'day').format('YYYY-MM-DD'),
      endDate: moment().add(1, 'day').format('YYYY-MM-DD')
    };
  }

  onChange = (info) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    this.setState({ fileList });
  }

  // 检查文件成功后开始导入文件
  importFile = async _ => {
    this.setState({ confirmLoading: true, okText: '导入中' });
    const { startDate, endDate, excludeWeek, binaryFile } = this.state;
    let formData = new FormData();
    formData.append('file', binaryFile);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('excludeWeek', excludeWeek.join());

    let res = await this.$http.upload(this.props.okUrl, formData);
    if (!res) {
      this.setState({ confirmLoading: false, okText: '确定' });
      return;
    };
    if (res.data.code === 10010) {
      if (!Array.isArray(res.data.data)) {
        message.error(res.data.data);
        this.setState({
          confirmLoading: false,
          okText: '确定'
        })
      } else {
        this.setState({
          errList: res.data.data,
          confirmLoading: false,
          okText: '确定'
        });
      }
    } else if (res.data.code !== 0) {
      this.setState({ confirmLoading: false, okText: '确定' });
      message.error(res.data.message);
    } else {
      this.setState({
        fileList: [],
        confirmLoading: false,
        okText: '确定'
      });
      message.success('导入成功！');
      this.props.toggleImportModal();
      this.props.getList();
    }
  }

  render() {
    const { confirmLoading, excludeWeek, startDate, endDate, errList, okText, binaryFile } = this.state;
    return (
      <Modal
        title="导入"
        visible={this.props.visible}
        onOk={_ => {
          if (binaryFile) {
            this.importFile();
          } else {
            message.error('请选择文件')
          }
        }}
        okText={okText}
        confirmLoading={confirmLoading}
        onCancel={_ => {
          this.setState({ errList: [], fileList: [], confirmLoading: false, binaryFile: null, okText: '确定' });
          this.props.toggleImportModal();
        }}
      >
        <div style={{ marginBottom: '10px', display: 'flex', height: '30px' }}>
          <p style={{ lineHeight: '30px' }}>请按照数据样例的格式进行数据导入</p>
          <a className="btn-download-template" href={this.props.href} download>
            <Icon type="cloud-download" />
            &nbsp;&nbsp;数据样例模板下载
          </a>
        </div>
        <Upload
          data={{
            startDate,
            endDate,
            excludeWeek: excludeWeek.join()
          }}
          onRemove={_ => {
            this.setState({ errList: [], binaryFile: null });
            return true;
          }}
          beforeUpload={file => {
            this.setState({ errList: [], binaryFile: file });
            return false;
          }}
          showUploadList={{ showDownloadIcon: false }}
          name="file"
          action={`${this.props.checkUrl}?token=${localStorage.getItem('token')}`}
          onChange={this.onChange}
          accept=".xlsx,.xls"
          fileList={this.state.fileList}
        >
          <Button>
            <Icon type="upload" /> 点击上传
          </Button>
        </Upload>
        {
          errList.length > 0 &&
          <Typography.Paragraph
            style={{ textAlign: 'right' }}
            strong
            copyable={{ text: errList.join('\n') }}
          >
            点击按钮复制错误信息
            </Typography.Paragraph>
        }
        <section style={errList.length > 3 ? { height: 200, overflowY: 'auto' } : null}>
          {
            errList.map(item => <Alert key={item} description={item} type="error" />)
          }
        </section>
        <p style={{ paddingTop: '10px' }}>{this.props.title}</p>
        <DatePicker.RangePicker
          defaultValue={[moment(moment().add(1, 'days'), 'YYYY-MM-DD'), moment(moment().add(1, 'days'), 'YYYY-MM-DD')]}
          onChange={(_, date) => this.setState({ startDate: date[0], endDate: date[1] })}
        />
        <section style={{ marginTop: '10px' }}>
          <span>排除日期：</span>
          <Checkbox.Group
            options={[{ label: '周六', value: '6' }, { label: '周日', value: '7' }]}
            onChange={excludeWeek => this.setState({ excludeWeek })}
            defaultValue={excludeWeek}
          />
        </section>
      </Modal>
    )
  }
}
export default CarImport;