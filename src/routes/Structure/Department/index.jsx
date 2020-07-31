import React, { Fragment } from 'react';
import CustomBreadcrumb from '../../../components/CustomBreadcrumb';
import { Switch, Button, Modal, message, TreeSelect, Input, Radio, Table } from 'antd';
import API from '../../../utils/API';
import '../style.css';


const StatusValue = ['NORMAL', 'STOP'];
const StatusCode = {
    'NORMAL': '正常',
    'STOP': '停用'
}

const FuncType = {
    'ADD': Symbol(),
    'ConfirmDisable': Symbol(),
    'Update': Symbol(),
    'Delete': Symbol(),
}

class Department extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            department: '',
            list: [],
            visible: false,         // 是否显示对话框
            type: '',               // 类型，显示什么
            dataType: null,         // 显示对话框，当点击确认的情况所需要的数据
            addValue: [],           // 当点击新增的时候添加值的时候保存到这里面
            departmentName: '',     // 部分名称
            updateValue: [],        // 当点击修改的时候，父级的会被保存在这里
            statusDepartment: '',   // 当修改的时候显示的部门名称
            updateOid: [],          // 当修改的时候所选择的oid
            dataSource: [],         // 数据
        }

        this.saveOldvalue = {};
    }

    componentDidMount() {
        this.init();
    }

    init = async _ => {
        let res = await API.get("/back/organization/list");
        if (!res || res.data.code !== 0) return;
        this.addOrUpdateData = JSON.parse(JSON.stringify(res.data.data));
        this.addOrUpdateDataHandle(this.addOrUpdateData);
        this.dataSourceHandle(res.data.data);
        this.setState({ dataSource: res.data.data })
    }

    addOrUpdateDataHandle = data => {
        const recursion = source => {
            if (source && Array.isArray(source)) {
                source.forEach(l => {
                    l.children = l.childrens;
                    l.title = l.department;
                    recursion(l.children);
                })
            }
        }
        recursion(data);
    }

    onStatusChange = async (status, item) => {
        if (!status) {
            this.setState({ type: FuncType.ConfirmDisable, visible: true, dataType: item });
        } else {
            let res = await this.updateDepartmentStatus(item.oid);
            if (res && res.data.code === 0) {
                this.init();
            }
        }
    }

    dataSourceHandle = data => {
        const recursion = source => {
            if (source && Array.isArray(source)) {
                source.forEach(l => {
                    l.all = l.department;
                    l.status = <Switch
                        checked={StatusCode[l.organizationStatusCode] === StatusCode['NORMAL'] ? true : false}
                        checkedChildren={StatusCode[l.organizationStatusCode]}
                        onChange={(e) => this.onStatusChange(e, l)}
                        unCheckedChildren={StatusCode[l.organizationStatusCode]} />;
                    l.countOutCar = <section>
                        <Button onClick={_ => this.onUpdate(l)} size={'small'} style={{ marginRight: 10 }} type="primary">修改</Button>
                        <Button onClick={_ => this.onDelete(l)} size={'small'} type="danger">删除</Button>
                    </section>;
                    if (l.childrens.length !== 0) {
                        l.children = l.childrens;
                    }
                    recursion(l.children);
                });
            }
        }
        recursion(data);
    }

    columns = [
        { title: '组织结构', dataIndex: 'all' },
        // { align: 'center', title: '状态', dataIndex: 'status' },
        { align: 'center', title: '操作', dataIndex: 'countOutCar' },
    ]


    onUpdate = (dataType) => {
        let statusDepartment = dataType.organizationStatusCode;
        let updateOid = dataType.fatherId === 0 ? [] : dataType.fatherId;
        let departmentName = dataType.department;
        // 修改
        this.setState({
            dataType,
            visible: true,
            type: FuncType.Update,
            statusDepartment,
            updateOid,
            departmentName
        });

        this.saveOldvalue["statusDepartment"] = statusDepartment;
        this.saveOldvalue["updateOid"] = updateOid;
        this.saveOldvalue["departmentName"] = departmentName;
    }
    onDelete = (item) => {
        // 删除
        this.setState({ type: FuncType.Delete, dataType: item, visible: true })
    }


    onSearch = _ => {
        // 搜索

    }

    onAdd = _ => {
        // 新增
        this.setState({ visible: true, type: FuncType.ADD });
    }


    ConfirmDisable = _ => {
        return (<p>确认停用？</p>);
    }

    updateDepartmentStatus = (oid) => {
        if (!oid) message.error("oid错误");
        return API.post("/back/organization/updateStatus", { oid }, "json");
    }

    Add = () => {
        const { addValue, departmentName, dataSource } = this.state;
        const onChange = addValue => {
            this.setState({ addValue })
        }
        const onChangeInput = ({ target: { value } }) => {
            this.setState({ departmentName: value });
        }
        return (
            <Fragment>
                <section style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: 10 }}>上级部门</span>
                    <TreeSelect
                        style={{ flex: 1 }}
                        value={addValue}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="请选择归属部门"
                        allowClear
                        multiple={false}
                        treeData={this.addOrUpdateData}
                        onChange={onChange} />
                </section>
                <section style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                    <span style={{ marginRight: 10 }}>部门名称</span>
                    <Input style={{ flex: 1 }} placeholder={'请输入部门名称'} value={departmentName} onChange={onChangeInput} />
                </section>
            </Fragment>
        )
    }

    Update = () => {
        const { statusDepartment, updateOid, departmentName, dataType } = this.state;
        const onChange = updateOid => {
            if (dataType.value === updateOid) {
                message.warn("不能选择自己");
            } else {
                this.setState({ updateOid })
            }
        }
        const onChangeInput = ({ target: { value } }) => {
            this.setState({ departmentName: value });
        }
        const onChangeStatus = ({ target: { value } }) => {
            this.setState({ statusDepartment: value });
        }
        return (
            <Fragment>
                <section style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: 10 }}>上级部门</span>
                    <TreeSelect
                        style={{ flex: 1 }}
                        value={updateOid}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="请选择归属部门"
                        allowClear
                        multiple={false}
                        treeData={this.addOrUpdateData}
                        onChange={onChange} />
                </section>
                <section style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                    <span style={{ marginRight: 10 }}>部门名称</span>
                    <Input style={{ flex: 1 }} placeholder={'请输入部门名称'} value={departmentName} onChange={onChangeInput} />
                </section>
                {/* <section style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                    <span style={{ marginRight: 10 }}>部门状态</span>
                    <Radio.Group onChange={onChangeStatus} value={statusDepartment}>
                        <Radio value={StatusValue[0]}>{StatusCode['NORMAL']}</Radio>
                        <Radio value={StatusValue[1]}>{StatusCode['STOP']}</Radio>
                    </Radio.Group>
                </section> */}
            </Fragment>
        )
    }

    Delete = () => {

        return (
            <Fragment>
                <p>删除部门“部门名称”的数据项</p>
                <p>删除部门后，该部门原有人员将没有归属部门，需要在【用户管理】功能中重新关联</p>
            </Fragment>
        );
    }

    SwitchFunc = ({ type }) => {
        switch (type) {
            case FuncType.ADD:
                return (<this.Add />);
            case FuncType.ConfirmDisable:
                return (<this.ConfirmDisable />);
            case FuncType.Update:
                return (<this.Update />);
            case FuncType.Delete:
                return (<this.Delete />);
            default:
                return null;
        }
    }

    switchTitle = (type) => {
        switch (type) {
            case FuncType.ADD:
                return "新增部门";
            case FuncType.ConfirmDisable:
                return "确认";
            case FuncType.Update:
                return '修改部门';
            case FuncType.Delete:
                return '删除部门';
            default:
                return '';
        }
    }


    onOk = async _ => {
        const { type, dataType, departmentName: department, addValue, updateOid, statusDepartment } = this.state;
        switch (type) {
            case FuncType.ConfirmDisable:
                let res = await this.updateDepartmentStatus(dataType.oid);
                if (res && res.data.code === 0) {
                    this.init();
                }
                break;
            case FuncType.ADD:
                if (!department) {
                    message.warn("请输入部门名称");
                    return;
                }
                let resAdd = await API.post("/back/organization/saveOrUpdate", { fatherId: Array.isArray(addValue) ? 0 : addValue, department }, "json");
                if (resAdd && resAdd.data.code === 0) {
                    message.success("新增部门成功");
                    this.init();
                }
                break;
            case FuncType.Update:
                if (this.saveOldvalue["departmentName"] === department
                    && this.saveOldvalue["updateOid"] === updateOid
                    && this.saveOldvalue["statusDepartment"] === statusDepartment) {
                    message.warn("你并没有做任何修改");
                } else {
                    let resUpdate = await API.post("/back/organization/saveOrUpdate",
                        { fatherId: updateOid || 0, department, organizationStatus: statusDepartment, oid: dataType.oid },
                        "json");
                    if (resUpdate && resUpdate.data.code === 0) {
                        message.success("修改部门成功");
                        this.init();
                    }
                }
                break;
            case FuncType.Delete:
                let resDelete = await API.post("/back/organization/delete", { oid: dataType.oid }, "json");
                if (resDelete && resDelete.data.code === 0) {
                    message.success("删除部门成功");
                    this.init();
                }
                break;
            default:
                break;
        }
        this.setState({ visible: false });
    }


    render() {
        const { visible, type, dataSource } = this.state;
        return (
            <div>
                <CustomBreadcrumb arr={['组织结构管理', '部门管理']} />
                <section style={{ margin: '15px 0' }}>
                    <Button
                        type="primary"
                        onClick={this.onAdd}
                        style={{ marginLeft: 10 }}
                    >新增</Button>
                </section>
                <Table columns={this.columns} dataSource={dataSource} pagination={false} />
                <Modal
                    title={this.switchTitle(type)}
                    visible={visible}
                    onOk={this.onOk}
                    onCancel={_ => this.setState({ visible: false })}>
                    <this.SwitchFunc type={type} />

                </Modal>
            </div>
        )
    }
}


export default Department;