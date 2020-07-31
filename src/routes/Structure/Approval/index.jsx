import React, { Fragment } from 'react';
import CustomBreadcrumb from '../../../components/CustomBreadcrumb';
import API from '../../../utils/API';
import { Tree, Switch, Icon, message, Button, Table } from 'antd';
const TreeNode = Tree.TreeNode;

class Approval extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            loading: false,
        }
    }
    componentDidMount() {
        this.getList();
    }
    getList = async _ => {
        this.setState({ loading: true });
        let res = await API.get("/back/application/process/list");
        if (res && res.data.code === 0) {
            this.dataSourceHandle(res.data.data);
            this.setState({ dataSource: res.data.data })
        }
        this.setState({ loading: false });
    }
    dataSourceHandle = data => {
        const recursion = (source, departmentId) => {
            if (source && Array.isArray(source)) {
                source.forEach(l => {
                    if (l.department) {
                        l.all = l.department;
                        l.key = l.oid;
                        if (l.children.length !== 0) {
                            recursion(l.children);
                        }
                        l.users.forEach(user => {
                            user.key = user.uid;
                            user.all = user.name;
                            user.status = <Switch checked={user.approval} onChange={_ => this.onSetApproval(user)} />;
                            user.countOutCar = <Button
                                type="link"
                                onClick={_ => this.onSetDefault(user)}
                                style={{
                                    marginLeft: 10,
                                    cursor: user.defaultApproval ? 'default' : 'pointer',
                                    color: user.defaultApproval ? 'black' : ''
                                }}>
                                {user.defaultApproval ? '默认审批人' : '设为默认'}
                            </Button>;
                        });
                        l.children = [...l.users, ...l.children];
                        if (l.users.length !== 0) {
                            recursion(l.users, l.oid);
                        }
                    } else {
                        l.oid = departmentId;
                    }
                });
            }
        }
        recursion(data);
    }

    columns = [
        { title: '组织结构', dataIndex: 'all' },
        { align: 'center', title: '状态', dataIndex: 'status' },
        { align: 'center', title: '操作', dataIndex: 'countOutCar' },
    ]

    onSetApproval = async user => {
        if (!user) {
            message.error("选择错误");
            return;
        }
        const { oid, uid } = user;
        let res = await API.post("/back/application/process/updateApproval", { oid, uid }, "json");
        if (res && res.data.code === 0) {
            if (user.approval) {
                message.success("成功取消审批人");
            } else {
                message.success("设置审批人成功");
            }
            this.getList();
            return;
        }
        message.info("设置审批人失败");
    }
    onSetDefault = async user => {
        const { defaultApproval } = user;
        if (defaultApproval) return;
        if (!user) {
            message.error("选择错误");
            return;
        }
        const { oid, uid } = user;
        let res = await API.post("/back/application/process/updateDefaultApproval", { oid, uid }, "json");
        if (res && res.data.code === 0) {
            message.success("设置默认审批人成功");
            this.getList();
            return;
        }
        message.info("设置默认审批人失败");
    }
    List = (list, departmentId = -1) => {
        if (!list || !Array.isArray(list)) return null;
        return (<Fragment>
            {
                list.map(l => {
                    if (l.department) {
                        return <TreeNode title={l.department} key={l.oid}>
                            {this.List(l.users, l.oid)}
                            {this.List(l.children)}
                        </TreeNode>
                    } else {
                        l.oid = departmentId;
                        return <TreeNode title={
                            <div style={{ display: 'flex', alignItems: 'center', width: 400 }}>
                                <span style={{ flex: 1 }}>{l.name}</span>
                                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                    <Switch checked={l.approval} onChange={_ => this.onSetApproval(l)} />
                                    <Button
                                        type="link"
                                        onClick={_ => this.onSetDefault(l)}
                                        style={{
                                            marginLeft: 10,
                                            cursor: l.defaultApproval ? 'default' : 'pointer',
                                            color: l.defaultApproval ? 'black' : ''
                                        }}>
                                        {l.defaultApproval ? '默认审批人' : '设为默认'}
                                    </Button>
                                </div>
                            </div>
                        } key={l.uid} />
                    }

                })
            }
        </Fragment>)
    }

    render() {
        const { dataSource, loading } = this.state;
        return (
            <div>
                <CustomBreadcrumb arr={['组织结构管理', '审批管理']} />
                {/* <Tree
                    style={{ flex: 1, backgroundColor: '#fff' }}
                    switcherIcon={<Icon type="caret-down" style={{ fontSize: 18 }} />}>
                    {this.List(list)}
                </Tree> */}
                <Table columns={this.columns} loading={loading} style={{ width: '50%' }} dataSource={dataSource} pagination={false} />
            </div>
        )
    }
}


export default Approval;