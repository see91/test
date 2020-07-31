import React, { Component, Fragment } from 'react';
import { Table, Modal, Button } from "antd";
import './style.css';

class DetailButton extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  routeColumns = [
    { align: 'center', title: '名称', key: '名称', dataIndex: 'name' },
    { align: 'center', title: '值', key: '值', dataIndex: 'value' },
  ]

  passengerColumns = [
    { align: 'center', title: '相关人员', key: '相关人员', dataIndex: 'passengerType' },
    { align: 'center', title: '姓名', key: 'name', dataIndex: 'uname' },
    { align: 'center', title: '电话', key: '电话', dataIndex: 'mobile' },
  ]

  operationColumns = [
    { align: 'center', title: '时间', key: '时间', dataIndex: 'timeName' },
    { align: 'center', title: '时间值', key: '时间值', dataIndex: 'time' },
    { align: 'center', title: '开始名称', key: '开始名称', dataIndex: 'start' },
    { align: 'center', title: '姓名', key: '姓名', dataIndex: 'name' },
  ]
  passengerCommentColumns = [
    { align: 'center', title: '评价人', key: '评价人', dataIndex: 'uname' },
    { align: 'center', title: '评分', key: '评分', dataIndex: 'level' },
    { align: 'center', title: '车内是否整洁', key: '车内是否整洁', dataIndex: 'clean' },
    { align: 'center', title: '驾驶是否平稳', key: '驾驶是否平稳', dataIndex: 'stable' },
    { align: 'center', title: '司机准时程度', key: '司机准时程度', dataIndex: 'ontime' },
  ]

  driverCommentColumns = [
    { align: 'center', title: '评价人', key: '评价人', dataIndex: 'uname' },
    { align: 'center', title: '评分', key: '评分', dataIndex: 'level' },
    { align: 'center', title: '是否干扰家驾驶', key: '是否干扰家驾驶', dataIndex: 'interference' },
    { align: 'center', title: '是否弄脏汽车', key: '是否弄脏汽车', dataIndex: 'damage' },
    { align: 'center', title: '乘客是否准时', key: '乘客是否准时', dataIndex: 'ontime' },
  ]

  info = async () => {
    let res = await this.$http.get(this.props.api + this.props.id);
    if (!res) return;
    console.log(res, "???", res.data.data)
    const {
      userCarTime,
      startLocationName,
      endLocationName,
      license,
      model,
      colour,
      startTime,
      endTime,
      startRouteUname,
      endRouteUname,
      passengerCommentList,
      driverComment,
      passengerUserList } = res.data.data;
    let routeDataSource = [];
    routeDataSource.push({ name: '预约用车时间', value: userCarTime });
    routeDataSource.push({ name: '起点', value: startLocationName });
    routeDataSource.push({ name: '终点', value: endLocationName });
    routeDataSource.push({ name: '车牌号', value: license });
    routeDataSource.push({ name: '车辆信息', value: model + " " + colour });


    let passengerDataSource = passengerUserList;


    let operationDataSource = [];
    operationDataSource.push({ timeName: '实际开始时间', time: startTime, start: '开始人', name: startRouteUname });
    operationDataSource.push({ timeName: '实际结束时间', time: endTime, start: '结束人', name: endRouteUname });

    let passengerCommentDataSource = passengerCommentList;


    let driverCommentDataSource = driverComment ? [driverComment] : [];



    Modal.info({
      title: this.props.title,
      maskClosable: true,
      cancelText: '关闭',
      content: (
        <Fragment>
          <Table
            columns={this.routeColumns}
            showHeader={false}
            bordered
            style={{ marginBottom: 20 }}
            dataSource={routeDataSource}
            pagination={false}
          />
          <Table
            columns={this.passengerColumns}
            dataSource={passengerDataSource}
            pagination={false}
            style={{ marginBottom: 20 }}
            bordered
          />
          <Table
            columns={this.operationColumns}
            showHeader={false}
            style={{ marginBottom: 50 }}
            dataSource={operationDataSource}
            pagination={false}
            bordered
          />
          <section className={'passenger-comment'}>
            <p>来自乘客评价：</p>
            <Table
              columns={this.passengerCommentColumns}
              dataSource={passengerCommentDataSource}
              pagination={false}
              style={{ marginBottom: 50 }}
              bordered
            />
          </section>
          <section>
            <p>来自司机评价：</p>
            <Table
              columns={this.driverCommentColumns}
              bordered
              dataSource={driverCommentDataSource}
              pagination={false}
            />
          </section>
        </Fragment>

      ),
      width: '55%'
    })
  }

  render() {
    return (
      <Button onClick={this.info}>查看详情</Button>
    )
  }
}
export default DetailButton