import React from "react";
import { Switch, Redirect } from "react-router-dom";
import LoadableComponent from "../../utils/LoadableComponent";
import PrivateRoute from "../PrivateRoute";

// 组织架构管理
const Role = LoadableComponent((_) => import("../../routes/Structure/Role"));
const User = LoadableComponent((_) => import("../../routes/Structure/User"));
const Approval = LoadableComponent((_) =>
  import("../../routes/Structure/Approval")
);
const Department = LoadableComponent((_) =>
  import("../../routes/Structure/Department")
);

//其它
const ErrorPage = LoadableComponent((_) =>
  import("../../routes/Other/ErrorPage/index")
);

const Test = LoadableComponent((_) => import("../../test"));

class ContentMain extends React.Component {
  render() {
    return (
      <div style={{ padding: 16, position: "relative" }}>
        <Switch>
          <PrivateRoute exact path='/home/structure/role' component={Role} />
          <PrivateRoute exact path='/home/structure/user' component={User} />
          <PrivateRoute
            exact
            path='/home/structure/approval'
            component={Approval}
          />
          <PrivateRoute
            exact
            path='/home/structure/department'
            component={Department}
          />
          <PrivateRoute exact path='/home/test' component={Test} />
          <Redirect exact from='/' to='/home/structure/department' />
          <PrivateRoute exact path='*' component={ErrorPage} />
        </Switch>
      </div>
    );
  }
}

export default ContentMain;
