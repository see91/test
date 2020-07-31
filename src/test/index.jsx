import React, { Component, Fragment } from 'react'
import { Tree, Typography } from 'antd'

export default class Demo extends Component {

  state = {
    confirmLoading: false,
    selectUsers: [], // 选中的用户
    userData: [], // 部门用户数据
    showUsers: false,
  }

  data = [
    "第3行车牌重复出现",
    "第4行车牌重复出现",
    "第5行车牌重复出现",
    "第6行车牌重复出现",
    "第7行车牌重复出现",
    "第8行车牌重复出现",
    "第9行车牌重复出现",
    "第10行车牌重复出现",
    "第11行车牌重复出现",
    "第12行车牌重复出现",
    "第13行车牌重复出现",
    "第14行车牌重复出现",
  ]

  componentDidMount() {
    // this.getUserList();
  }

  componentWillReceiveProps() {
    console.log('componentWillReceiveProps')
  }

  // 获取部门数据
  getUserList = async _ => {
    let res = await this.$http.get('/back/common/address_book_organization');
    if (!res) return;
    this.setState({ userData: res.data.data })
  }

  onCheck = (val, e) => {
    // console.log(e.checkedNodes);
    this.setState({ selectUsers: e.checkedNodes })
  }

  render() {
    const { selectUsers, userData } = this.state;
    return (
      <Fragment>
        <Tree
          checkable
          treeData={userData}
          onCheck={this.onCheck}
          checkedKeys={selectUsers.map(item => item.key)}
        />
        <a href="/static_server/template/企业管理数据模板_班车排班表模板.xlsx" download="test.xlsx">点击下载</a>
        <Typography.Paragraph>
            点击复制
        </Typography.Paragraph>
      </Fragment>
    )
  }
}
