import React, { Component, Fragment } from 'react'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb';
import { Table, Button, Popconfirm, Switch, Modal, Input, Radio, Tree, message } from 'antd';
import Search from 'antd/lib/input/Search';
import API from '../../../utils/API';
import TextArea from 'antd/lib/input/TextArea';


const FuncType = {
  'ADD': Symbol(),
  'UPDATE': Symbol(),
  'DELETE': Symbol(),
  'BATCH_DELETE': Symbol(),
}

class Role extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      selectkeys: 0,
      loading: false,
      total: 0,
      role: '',
      currentPage: 1,
      visible: false,
      type: '',
      defaultAddStatus: '',
      permissions: [],
      info: '',               // 说明
      deleteRole: '',         // 要删除的名称
    }
    this.pageSize = 10;       // 每一页的个数
    this.permissionList = []; // 权限列表
    this.roleId = -1;         // 角色id
    this.saveOldInfo = {};    // 保存上一次的数据，用于当点击修改的时候，看是否有新的内容修改，如果没有修改失败


    this.columns = [
      { align: 'center', title: '序号', dataIndex: "number" },
      { align: 'center', title: '角色名称', dataIndex: 'roleName' },
      {
        align: 'center', title: '用户默认添加', dataIndex: 'defaultAdd', render: (isDefault, item) => {
          return (<Switch checked={isDefault} checkedChildren={'开'} unCheckedChildren={'关'} onChange={status => this.onChangeDefault(item, status)} />)
        }
      },
      { align: 'center', title: '说明', dataIndex: 'info' },
      {
        align: 'center',
        title: '操作',
        render: record => (
          <div>
            <Button
              style={{ marginRight: 5 }}
              type="primary"
              onClick={_ => {
                const {
                  roleName: role,
                  info,
                  defaultAdd: defaultAddStatus,
                  functions,
                  roleId
                } = record;
                let permissions = functions.map(v => v.toString());
                this.setState({
                  type: FuncType.UPDATE,
                  role,
                  info,
                  defaultAddStatus,
                  permissions,
                  visible: true,
                });
                this.roleId = roleId;
                this.saveOldInfo = {
                  role, info, defaultAddStatus, permissions
                }
              }}>修改</Button>
            <Button onClick={_ => {
              this.roleId = record.roleId
              this.setState({ visible: true, type: FuncType.DELETE, deleteRole: record.roleName });
            }} type="danger">删除</Button>
          </div>
        )
      }
    ]
  }
  onChangeDefault = async (item, status) => {
    let res = await API.post("/back/role/updateStatus", { roleId: item.roleId }, "json");
    if (res && res.data.code === 0) {
      const { dataSource } = this.state;
      item.defaultAdd = status;
      this.setState({ dataSource });
    }
  }
  componentDidMount() {
    this.getData();
    this.getPermissionList();
  }
  getData = async _ => {
    this.setState({ loading: true });
    const { currentPage, role } = this.state;
    let res = await API.get("/back/role/list?currentPage=" + currentPage
      + "&pageSize=" + this.pageSize
      + "&key=" + role);
    if (res && res.data.code === 0) {
      let { result = [], totalCount } = res.data.data || {}
      result.forEach((e, i) => {
        e.key = e.roleId;
        e.number = ((currentPage - 1) * this.pageSize) + i + 1;
      });
      this.setState({ dataSource: result, total: totalCount });
    }
    this.setState({ loading: false });
  }
  handleTree = data => {
    const recursion = (d) => {
      if (d && Array.isArray(d)) {
        d.forEach(v => {
          v.title = v.functionName;
          v.key = v.functionId;
          v.children = v.childrens;
          recursion(v.children);
        })
      }
    }
    recursion(data);
  }
  getPermissionList = async () => {
    let res = await API.get("/back/role/functions");
    if (res && res.data.code === 0) {
      this.handleTree(res.data.data);
      this.permissionList = res.data.data;
    }
  }
  handleDelete = () => {

  }

  Add = _ => {
    const { role, defaultAddStatus, info, permissions } = this.state;
    const onChange = ({ target: { value } }) => {
      this.setState({ defaultAddStatus: value })
    }

    const onCheck = (permissions) => {
      this.setState({ permissions });
    }

    return (
      <Fragment>
        <section style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ flex: 1 }}>角色名称</span>
          <Input
            placeholder={'请输入角色名称'}
            value={role}
            style={{ flex: 3 }}
            onChange={({ target: { value } }) => this.setState({ role: value })} />
        </section>
        <section style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
          <span style={{ flex: 1 }}>默认给用户添加</span>
          <Radio.Group onChange={onChange} value={defaultAddStatus} style={{ flex: 3 }}>
            <Radio value={false}>不添加该角色</Radio>
            <Radio value={true}>默认添加角色</Radio>
          </Radio.Group>
        </section>
        <section style={{ display: 'flex', marginTop: 10 }}>
          <span style={{ flex: 1 }}>设置权限</span>
          <Tree
            treeData={this.permissionList}
            onCheck={onCheck}
            checkedKeys={permissions}
            checkable
            style={{ flex: 3 }} />
        </section>
        <section style={{ display: 'flex', marginTop: 10 }}>
          <span style={{ flex: 1 }}>说明</span>
          <TextArea
            value={info}
            style={{ flex: 3 }}
            autoSize={{ minRows: 3, maxRows: 5 }}
            onChange={({ target: { value } }) => this.setState({ info: value })} />
        </section>
      </Fragment>
    );
  }

  Update = _ => {
    return <this.Add />;
  }

  Delete = _ => {
    const { deleteRole } = this.state;
    return (
      <p>删除“{deleteRole}”的数据项。删除后，相关用户会失去该角色下的功能权限</p>
    );
  }

  BatchDelete = _ => {
    const { selectkeys } = this.state;
    return (
      <p>将删除已选择的{selectkeys.length}个数据项</p>
    )
  }

  FuncSwitch = ({ type }) => {
    switch (type) {
      case FuncType.ADD:
        return (<this.Add />);
      case FuncType.UPDATE:
        return (<this.Update />);
      case FuncType.DELETE:
        return (<this.Delete />);
      case FuncType.BATCH_DELETE:
        return (<this.BatchDelete />);
    }
  }

  titleSwitch = (type) => {
    switch (type) {
      case FuncType.ADD:
        return "新增角色";
      case FuncType.UPDATE:
        return '修改角色';
      case FuncType.DELETE:
        return '删除角色';
      case FuncType.BATCH_DELETE:
        return '批量删除';
    }
  }

  onClickOk = async _ => {
    const { type, role, defaultAddStatus, permissions, info, total } = this.state;
    switch (type) {
      case FuncType.ADD:
        if (!role) {
          message.warn("角色名称不能为空");
          return;
        }
        let resAdd = await API.post("/back/role/saveOrUpdate", {
          info, roleName: role, defaultAdd: defaultAddStatus,
          functionIds: permissions
        }, "json");
        if (resAdd && resAdd.data.code === 0) {
          message.success("新增角色成功");
          this.setState({ visible: false, role: '', currentPage: 1, permissions: [], info: '' }, this.getData);
        }
        break;
      case FuncType.UPDATE:
        if (this.roleId === -1) {
          message.error("选择错误");
          return;
        } else if (
          this.saveOldInfo.role === role && 
          this.saveOldInfo.info === info &&
          this.saveOldInfo.permissions === permissions &&
          this.saveOldInfo.defaultAddStatus === defaultAddStatus) {
          message.warn("你并没有做任何修改");
          return;
        }
        let resUpdate = await API.post("/back/role/saveOrUpdate", {
          roleId: this.roleId,
          info, roleName: role, defaultAdd: defaultAddStatus,
          functionIds: permissions
        }, "json");
        if (resUpdate && resUpdate.data.code === 0) {
          message.success("修改角色成功");
          this.setState({ visible: false, role: '' }, this.getData);
        }
        break;
      case FuncType.DELETE:
        if (this.roleId === -1) {
          message.error("选择错误");
          return;
        }
        let resDelete = await API.post("/back/role/delete", { roleId: this.roleId }, "json");
        if (resDelete && resDelete.data.code === 0) {
          message.success("删除角色成功", total % this.pageSize);
          if (total % this.pageSize === 1) {
            this.setState((pre) => ({ currentPage: pre.currentPage - 1 }));
          }
          this.setState({ visible: false }, this.getData);
        }
        break;
      case FuncType.BATCH_DELETE:
        const { selectkeys } = this.state;
        let errIndex = 0;
        let successIndex = 0;
        for (let i = 0; i < selectkeys.length; i++) {
          let roleId = selectkeys[i];
          const res = await API.post("/back/role/delete", { roleId }, "json");
          if (res && res.data.code === 0) {
            successIndex += 1;
          } else errIndex += 1;
        }
        message.success("已成功删除" + successIndex + "条数据" + (errIndex !== 0 ? ("，失败的条数为" + errIndex) : ""));
        if (total % this.pageSize === successIndex) {
          this.setState((pre) => ({ currentPage: pre.currentPage - 1 }));
        }
        this.setState({ visible: false, selectkeys: [] }, this.getData);
        break;
    }
  }

  render() {
    const { selectkeys, dataSource, loading, total, role, visible, type, currentPage } = this.state;
    return (
      <div>
        <CustomBreadcrumb arr={['组织结构管理', '角色管理']} />
        <section>
          <Search
            placeholder="请输入用户角色"
            value={role}
            style={{ width: 250, marginRight: 10 }}
            onChange={e => this.setState({ role: e.target.value })}
            onSearch={_ => this.setState({ currentPage: 1 }, this.getData)}
          />
          <Button
            type="primary"
            onClick={_ => this.setState({ currentPage: 1 }, this.getData)}
            style={{ marginLeft: 10 }}
          >查询</Button>
        </section>
        <section style={{ margin: '10px 0' }}>
          <Button type={'primary'} onClick={_ => {
            this.setState({ type: FuncType.BATCH_DELETE, visible: true });
          }}>批量删除</Button>
          <Button
            type="primary"
            onClick={_ => this.setState({
              type: FuncType.ADD,
              visible: true,
              role: '',
              permissions: [],
              info: '',
              defaultAddStatus: false
            })}
            style={{ marginLeft: 10 }}
          >新增</Button>
        </section>
        <Table
          rowSelection={{
            onChange: (selectkeys) => this.setState({ selectkeys }),
            selectedRowKeys: selectkeys
          }}
          scroll={{ x: 950 }}
          style={{ width: '100%' }}
          dataSource={dataSource}
          loading={loading}
          columns={this.columns}
          pagination={{
            current: currentPage,
            defaultPageSize: this.pageSize,
            total,
            onChange: currentPage => this.setState({ currentPage }, this.getData)
          }}
        />

        <Modal
          title={this.titleSwitch(type)}
          onCancel={_ => this.setState({ visible: false })}
          onOk={this.onClickOk}
          visible={visible}>
          <this.FuncSwitch type={type} />
        </Modal>
      </div>
    )
  }
}
export default Role;
