import React, { Fragment } from 'react';
import {
  Input,
  Button,
  Table,
  message,
  Icon,
  Modal,
  Switch,
  Select,
  TreeSelect,
} from 'antd';
import CustomBreadcrumb from '../../../components/CustomBreadcrumb';
import API from '../../../utils/API';

const { Search } = Input;
const { Option } = Select;


const FuncType = {
  'ADD': Symbol(),
  'UPDATE': Symbol(),
  'DELETE': Symbol(),
  'BATCH_DELETE': Symbol(),
}
class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      driverInfo: {},
      mobile: '',         // 手机号
      currentPage: 1,     // 页面
      total: '',
      dataSource: [],
      loading: false,
      departmentList: [],     // 部门的数组
      selectkeys: [],
      name: '',           // 用户名称
      userStatus: [],     // 用户状态
      department: [],     // 部门的名称
      userStatusList: [], // 用户状态数据
      visible: false,     // 是否显示对话框
      addList: [],        // 新增列表
      type: '',           // 功能类型
      width: 0,           // 对话框的宽
      roleList: [],       // 角色列表
      deleteRow: 1,      // 在新增对话框中，删除指定行的选择器
      updateList: [],     // 在修改时候的列表，只有一条
      deleteUserInfo: '', // 当点击删除的时候，显示的用户姓名
      defaultRoleList: [],    // 获取默认角色列表
    };

    this.pageSize = 10;   // 每行显示的条数
    this.saveOldData = null;  // 保存老数据
    this.isCancel = false;


    this.columns = [
      { align: 'center', title: '姓名', dataIndex: 'uname' },
      { width: '70px', align: 'center', title: '性别', dataIndex: 'sex', render: sex => (<span>{sex ? '男' : '女'}</span>) },
      { align: 'center', title: '工号', dataIndex: 'no' },
      { align: 'center', title: '手机号', dataIndex: 'mobilePhone' },
      { align: 'center', title: '直属部门', dataIndex: 'department' },
      { align: 'center', title: '职务/岗位', dataIndex: 'positionName' },
      { width: '70px', align: 'center', title: '状态', dataIndex: 'userStatusName' },
      { align: 'center', title: '角色', dataIndex: 'roleNames' },
      {
        align: 'center',
        title: '操作',
        render: record => (
          <div>
            <Button
              style={{ marginRight: 5 }}
              type="primary"
              onClick={_ => {
                this.setState({ updateList: [record], type: FuncType.UPDATE, visible: true });
                if (this.isCancel) return;
                this.saveOldData = { ...record };
              }}>修改</Button>
            <Button type="danger" onClick={_ => {
              this.setState({ type: FuncType.DELETE, visible: true, deleteUserInfo: record });
            }}>删除</Button>
          </div>
        )
      }
    ];
  }

  componentDidMount() {
    this.getDefaultRole();
    this.getList();
    this.getDepartmentData();
    this.getStatusData();
    this.getRoleData();
  }

  getList = async _ => {
    this.setState({ loading: true });
    const { currentPage, mobile, department, name, userStatus } = this.state;
    let res = await API.get(`/back/user/list?currentPage=${currentPage}&mobile=${mobile}&department=${department}&name=${name}&userStatus=${userStatus}&pageSize=${this.pageSize}`);
    if (res && res.data.code === 0) {
      res.data.data.result.forEach(v => {
        v.key = v.uid;
      });
      this.setState({ dataSource: res.data.data.result, total: res.data.data.totalCount });
    }
    this.setState({ loading: false });
  }

  getDepartmentData = async _ => {
    let res = await API.get("/back/organization/list");
    if (!res || res.data.code !== 0) return;
    const handle = (data) => {
      if (data && Array.isArray(data)) {
        data.forEach(d => {
          d.children = d.childrens;
          d.title = d.department;
          handle(d.children);
        });
      }
    }
    handle(res.data.data);
    this.setState({ departmentList: res.data.data });
  }

  getStatusData = async _ => {
    let res = await API.get("/back/user/status");
    if (!res || res.data.code !== 0) return;
    this.setState({ userStatusList: res.data.data });
  }
  getRoleData = async _ => {
    let res = await API.get("/back/user/roleAll");
    if (res && res.data.code === 0) {
      this.setState({ roleList: res.data.data });
    }
  }

  getDefaultRole = async _ => {
    let res = await API.get("/back/user/defaultRoleAll");
    if (res && res.data.code === 0) {
      this.setState({
        defaultRoleList: res.data.data,
        addList: [
          { key: 1, uname: '', sex: true, no: '', mobilePhone: '', departmentId: '', positionName: '', userStatus: "1000", roleIds: res.data.data.map(v => v.value) }
        ]
      })
    }
  }

  onDepartment = (_, department) => {
    // 当选择部门的时候
    this.setState({ department })
  }

  onStatus = (userStatus) => {
    // 当选择完状态
    this.setState({ userStatus })
  }

  // 删除
  handleDelete = async id => {
    let res = await this.$http.post('/back/fixedRoute/delete', { id });
    if (!res) return;
    if (res.data.code === 10002) {
      message.error(res.data.data);
    } else {
      message.success('删除成功！');
      this.getList();
    }
  };

  // 切换导入文件modal
  toggleImportModal = () => {
    this.setState({
      visible: !this.state.visible,
    })
  }

  Add = _ => {
    const { addList, userStatusList, departmentList, roleList, defaultRoleList } = this.state;

    const onNameChange = ({ target: { value } }, item) => {
      // name
      item.uname = value;
      this.setState({ addList });
    }
    const onNoChange = ({ target: { value } }, item) => {
      // no
      item.no = value;
      this.setState({ addList });
    }
    const onMobileChange = ({ target: { value } }, item) => {
      // mobile
      item.mobilePhone = value;
      this.setState({ addList });
    }
    const onDepartmentChange = (e, item) => {
      // department
      item.departmentId = e;
      this.setState({ addList });
    }
    const onRoleChange = ({ target: { value } }, item) => {
      // role
      item.positionName = value;
      this.setState({ addList });
    }
    const onSexChange = (e, item) => {
      // 性别
      item.sex = e;
      this.setState({ addList });
    }
    const onStatusChange = (e, item) => {
      console.log(e, "????")
      item.userStatus = e;
      this.setState({ addList });
    }
    const onRoleIdsChange = (e, item) => {
      item.roleIds = e;
      this.setState({ addList });
    }
    const onSelectDeleteRow = (e) => {
      // 删除指定行的选择器
      this.setState({ deleteRow: e })
    }
    const onAddRow = _ => {
      let row = { key: addList.length + 1, uname: '', sex: true, no: '', mobilePhone: '', departmentId: '', positionName: '', userStatus: '', roleIds: [] };
      addList.push(row);
      this.setState({ addList });
    }
    const onDeleteRow = _ => {
      addList.pop();
      this.setState({ addList });
    }
    const columns = [
      { width: '70px', align: 'center', title: '序号', dataIndex: 'key' },
      {
        align: 'center', title: _ => <span><span style={{ color: 'red', width: '100%' }}>*</span>姓名</span>, dataIndex: 'uname',
        render: (name, item) => <Input placeholder={'请输入姓名'} value={name} onChange={(e) => onNameChange(e, item)} />
      },
      {
        width: '100px', align: 'center', title: '性别', dataIndex: 'sex',
        render: (sex, item) => <Select defaultValue={sex} style={{ width: '100%' }} onChange={(e) => onSexChange(e, item)}>
          <Option value={true}>男</Option>
          <Option value={false}>女</Option>
        </Select>
      },
      {
        align: 'center', title: _ => <span><span style={{ color: 'red', width: '100%' }}>*</span>工号</span>, dataIndex: 'no',
        render: (no, item) => <Input value={no} placeholder={'请输入工号'} style={{ width: '100%' }} onChange={(e) => onNoChange(e, item)} />
      },
      {
        align: 'center', title: _ => <span><span style={{ color: 'red' }}>*</span>手机号</span>, dataIndex: 'mobilePhone',
        render: (mobile, item) => <Input value={mobile} placeholder={'请输入手机号'} onChange={(e) => onMobileChange(e, item)} />
      },
      {
        align: 'center', title: '直属部门', dataIndex: 'departmentId',
        render: (value, item) => <TreeSelect
          placeholder={'请选择部门'}
          treeData={departmentList}
          style={{ width: '100%' }}
          multiple={false}
          allowClear
          onChange={(e) => onDepartmentChange(e, item)} />
      },
      {
        align: 'center', title: '职务/岗位', dataIndex: 'positionName',
        render: (role, item) => <Input value={role} style={{ width: '100%' }} placeholder={'请输入职务/岗位'} onChange={(e) => onRoleChange(e, item)} />
      },
      {
        align: 'center', title: _ => <span><span style={{ color: 'red', width: '100%' }}>*</span>状态</span>, dataIndex: 'userStatus',
        render: (user, item) => <Select
          placeholder={'请选择状态'}
          style={{ width: '100%' }}
          defaultValue={user}
          allowClear
          onChange={(e) => onStatusChange(e, item)}>
          {
            userStatusList.map(option => {
              return (<Option value={option.value} key={option.value}>{option.name}</Option>)
            })
          }
        </Select>
      },
      {
        align: 'center', title: '角色', dataIndex: 'roleIds', render: (roleIds, item) => {
          return (<Select
            defaultValue={roleIds}
            mode="multiple"
            onChange={e => onRoleIdsChange(e, item)}
            placeholder={'请选择角色'}
            style={{ width: '100%' }}>
            {
              roleList && roleList.map(role => {
                return (
                  <Option key={role.value} value={role.value}>{role.name}</Option>
                )
              })
            }
          </Select>)
        }
      },
    ];
    return (
      <Fragment>
        <Table
          bordered
          pagination={false}
          tableLayout={'fixed'}
          scroll={{ x: 1300 }}
          showHeader
          title={_ => <section>
            <Button onClick={onAddRow} style={{ marginRight: 30 }} type={'primary'}>添加一行</Button>
            <Select value={1} onChange={onSelectDeleteRow} style={{ width: 100 }}>
              {
                addList.map(v => {
                  return <Option key={v.key} value={v.key}>{v.key}</Option>
                })
              }
            </Select>
            <Button type={'primary'} title={'根据序号进行删除'} style={{ marginLeft: 10 }} onClick={onDeleteRow}>删除行</Button>
          </section>}
          dataSource={addList}
          columns={columns} />
      </Fragment>
    );
  }

  Update = _ => {
    const { updateList, userStatusList, departmentList, roleList } = this.state;

    const onNameChange = ({ target: { value } }, item) => {
      // name
      item.uname = value;
      this.setState({ updateList });
    }
    const onMobileChange = ({ target: { value } }, item) => {
      // mobile
      item.mobilePhone = value;
      this.setState({ updateList });
    }
    const onDepartmentChange = (e, item) => {
      // department
      item.departmentId = e;
      this.setState({ updateList });
    }
    const onRoleChange = ({ target: { value } }, item) => {
      // role
      item.positionName = value;
      this.setState({ updateList });
    }
    const onSexChange = (e, item) => {
      // 性别
      item.sex = e;
      this.setState({ updateList });
    }
    const onStatusChange = (e, item) => {
      item.userStatusCode = e;
      this.setState({ updateList });
    }
    const onRoleIdsChange = (e, item) => {
      item.roleIds = e;
      this.setState({ updateList });
    }
    const columns = [
      { width: '70px', align: 'center', title: '序号', dataIndex: 'key' },
      {
        align: 'center', title: _ => <span><span style={{ color: 'red' }}>*</span>姓名</span>, dataIndex: 'uname',
        render: (name, item) => <Input placeholder={'请输入姓名'} value={name} onChange={(e) => onNameChange(e, item)} />
      },
      {
        width: '100px', align: 'center', title: '性别', dataIndex: 'sex',
        render: (sex, item) => <Select value={sex} onChange={(e) => onSexChange(e, item)}>
          <Option value={true}>男</Option>
          <Option value={false}>女</Option>
        </Select>
      },
      { align: 'center', title: _ => <span><span style={{ color: 'red' }}>*</span>工号</span>, dataIndex: 'no', },
      {
        align: 'center', title: _ => <span><span style={{ color: 'red' }}>*</span>手机号</span>, dataIndex: 'mobilePhone',
        render: (mobile, item) => <Input value={mobile} placeholder={'请输入手机号'} onChange={(e) => onMobileChange(e, item)} />
      },
      {
        align: 'center', title: '直属部门', dataIndex: 'departmentId',
        render: (department, item) => <TreeSelect
          placeholder={'请选择部门'}
          treeData={departmentList}
          value={department}
          style={{ width: '100%' }}
          multiple={false}
          onChange={(e) => onDepartmentChange(e, item)} />
      },
      {
        align: 'center', title: '职务/岗位', dataIndex: 'positionName',
        render: (role, item) => <Input value={role} placeholder={'请输入职务/岗位'} onChange={(e) => onRoleChange(e, item)} />
      },
      {
        align: 'center', title: '状态', dataIndex: 'userStatusCode',
        render: (user, item) => <Select value={user} placeholder={'请选择状态'} style={{ width: '100%' }} onChange={(e) => onStatusChange(e, item)}>
          {
            userStatusList.map(option => {
              return (<Option value={option.value} key={option.value}>{option.name}</Option>)
            })
          }
        </Select>
      },
      {
        align: 'center', title: '角色', dataIndex: 'roleIds', render: (role, item) => {
          return (<Select
            value={role.map(v => v.toString())}
            mode="multiple"
            onChange={e => onRoleIdsChange(e, item)}
            placeholder={'请选择角色'}
            style={{ width: '100%' }}>
            {
              roleList && roleList.map(role => {
                return (
                  <Option key={role.value} value={role.value}>{role.name}</Option>
                )
              })
            }
          </Select>)
        }
      },
    ];
    return (
      <Table
        bordered
        pagination={false}
        scroll={{ x: 1300 }}
        tableLayout={'fixed'}
        dataSource={updateList}
        columns={columns} />
    );
  }

  Delete = _ => {
    const { deleteUserInfo: { uname } } = this.state;
    return (<span>删除用户“{uname}”的数据项</span>);
  }
  BatchDelete = _ => {
    const { selectkeys } = this.state;
    return (<span>将删除已选择的{selectkeys.length}个用户</span>);
  }
  SelectFunc = ({ type }) => {
    switch (type) {
      case FuncType.ADD:
        return <this.Add />;
      case FuncType.UPDATE:
        return <this.Update />;
      case FuncType.DELETE:
        return <this.Delete />;
      case FuncType.BATCH_DELETE:
        return <this.BatchDelete />;
      default:
        return null;
    }
  }

  titleSelect = type => {
    switch (type) {
      case FuncType.ADD:
        return '新增用户';
      case FuncType.UPDATE:
        return '修改用户';
      case FuncType.DELETE:
        return '删除用户';
      case FuncType.BATCH_DELETE:
        return '批量删除用户';
      default:
        return '';
    }
  }

  add = async _ => {
    let { addList, defaultRoleList } = this.state;
    let temp = addList;

    let isPass = true;
    // 先对数据进行检查
    for (let i = 0; i < temp.length; i++) {
      let user = temp[i];
      if (!user.uname) {
        isPass = false;
        message.warn(`第${user.key}行中的姓名没有填写`);
        break;
      } else if (!user.no) {
        isPass = false;
        message.warn(`第${user.key}行中的工号没有填写`);
        break;
      } else if (!user.mobilePhone) {
        isPass = false;
        message.warn(`第${user.key}行中的手机号没有填写`);
        break;
      } else if (!user.userStatus) {
        isPass = false;
        message.warn(`第${user.key}行中的用户状态没有选择`);
        break;
      }
    }
    if (!isPass) return;
    temp[0].roleIds = temp[0].roleIds.map(v => parseInt(v));
    // 如果检查通过就进行提交
    for (let i = 0; i < temp.length; i++) {
      let user = temp[i];
      let res = await API.post("/back/user/saveOrUpdate", { ...user }, "json");
      if (res && res.data.code === 0) {
        message.success("新增用户成功");
      }
    }
    for (let i = 0; i < addList.length; i ++) {
      if (i !== 0) addList.pop();
    }
    Object.assign(addList[0], { key: 1, uname: '', sex: true, no: '', mobilePhone: '', departmentId: '', positionName: '', userStatus: "1000", roleIds: defaultRoleList.map(v => v.value) });
    this.setState({ visible: false, currentPage: 1, addList }, this.getList);
    this.isCancel = false;
  }

  update = async _ => {
    const { updateList } = this.state;
    let temp = updateList[0];
    temp.userStatus = temp.userStatusCode;
    // 首先判断用户是否做了修改
    let isUpdate = false;
    Object.entries(this.saveOldData).forEach(v => {
      if (v[1] !== temp[v[0]]) {
        isUpdate = true;
      }
    });
    if (!isUpdate) {
      message.warn("你并没有做任务修改");
      return;
    }

    let res = await API.post("/back/user/saveOrUpdate", { ...temp }, "json");
    if (res && res.data.code === 0) {
      message.success("修改用户信息成功");
      this.setState({ visible: false }, this.getList);
    }
    this.isCancel = false;
  }

  deleteUser = async _ => {
    const { deleteUserInfo: { uid }, total, currentPage } = this.state;
    const res = await API.post("/back/user/delete", { uid }, "json");
    if (res && res.data.code === 0) {
      message.success("删除用户成功");
      if (total % this.pageSize === 1 && currentPage > 1) {
        this.setState((pre) => ({ currentPage: pre.currentPage - 1 }));
      }
      this.setState({ visible: false }, this.getList);
    }
  }

  batchDeleteUser = async _ => {
    const { selectkeys, total, currentPage } = this.state;
    let errIndex = 0;
    let successIndex = 0;
    for (let i = 0; i < selectkeys.length; i++) {
      let uid = selectkeys[i];
      const res = await API.post("/back/user/delete", { uid }, "json");
      if (res && res.data.code === 0) {
        successIndex += 1;
      } else errIndex += 1;
    }
    if (total % this.pageSize === successIndex && currentPage > 1) {
      this.setState((pre) => ({ currentPage: pre.currentPage - 1 }));
    }
    message.success("已成功删除" + successIndex + "条数据" + (errIndex !== 0 ? ("，失败的条数为" + errIndex) : ""));
    this.setState({ visible: false, selectkeys: [] }, this.getList);
  }

  onClickOk = async _ => {
    const { type } = this.state;
    switch (type) {
      case FuncType.ADD:
        this.add();
        break;
      case FuncType.UPDATE:
        this.update();
        break;
      case FuncType.DELETE:
        this.deleteUser();
        break;
      case FuncType.BATCH_DELETE:
        this.batchDeleteUser();
        break;
    }
  }


  render() {
    const { mobile, dataSource, loading, total, name, departmentList,
      selectkeys, currentPage, userStatusList, visible, type,
    } = this.state;
    return (
      <Fragment>
        <CustomBreadcrumb arr={['组织结构管理', '用户管理']} />
        <div>
          <section style={{ marginBottom: '10px' }}>
            <Search
              placeholder="请输入姓名"
              value={name}
              style={{ width: 250, marginRight: 10 }}
              onChange={e => this.setState({ name: e.target.value })}
              onSearch={_ => this.setState({ currentPage: 1 }, this.getList)}
            />
            <Search
              placeholder="请输入手机号"
              value={mobile}
              style={{ width: 250, marginRight: 10 }}
              onChange={e => this.setState({ mobile: e.target.value })}
              onSearch={_ => this.setState({ currentPage: 1 }, this.getList)}
            />

            <TreeSelect
              placeholder={'请选择部门'}
              allowClear
              treeData={departmentList}
              style={{ width: 250, marginRight: 10 }}
              onChange={this.onDepartment} />

            <Select
              placeholder={'请选择状态'}
              allowClear
              style={{ width: 250, marginRight: 10 }}
              onChange={this.onStatus}>
              {
                userStatusList.map(option => {
                  return (<Option value={option.value} key={option.value}>{option.name}</Option>)
                })
              }
            </Select>

            <Button
              type="primary"
              onClick={_ => this.setState({ currentPage: 1 }, this.getList)}
              style={{ marginLeft: 10 }}
            >查询</Button>
          </section>
          <section style={{ display: 'flex', marginBottom: '10px' }}>
            <Button
              style={{ marginLeft: '10px' }}
              type="primary"
              onClick={_ => {
                this.setState({ visible: true, type: FuncType.ADD });
              }}
            >单条新增</Button>
            <Button
              style={{ marginLeft: '10px' }}
              type="primary"
              onClick={_ => this.setState({ type: FuncType.BATCH_DELETE, visible: true })}
            >批量删除</Button>
          </section>
          <Table
            rowSelection={{
              onChange: (selectkeys) => this.setState({ selectkeys }),
              selectedRowKeys: selectkeys
            }}
            scroll={{
              x: 1400
            }}
            style={{ width: '100%' }}
            dataSource={dataSource}
            loading={loading}
            columns={this.columns}
            pagination={{
              total,
              current: currentPage,
              onChange: currentPage => {
                this.setState({ currentPage }, this.getList)
              }
            }}
          />
        </div>
        <Modal
          title={this.titleSelect(type)}
          {...(type === FuncType.DELETE || type === FuncType.BATCH_DELETE) ? {} : { width: '90%' }}
          onOk={this.onClickOk}
          destroyOnClose
          onCancel={_ => this.setState({ visible: false }, _ => {
            // 如果是通过这种方式关闭的，那么下一次就不需要重新赋值
            this.isCancel = true;
          })}
          visible={visible}>
          <this.SelectFunc type={type} />
        </Modal>
      </Fragment>
    )
  }
}

export default User;